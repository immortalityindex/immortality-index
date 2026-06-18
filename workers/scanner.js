// Immortality Index — Cloudflare Worker
const PROJECT_ID = 'immortality-index';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getToken(env) {
  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);
  const enc = obj => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const header = enc({ alg: 'RS256', typ: 'JWT' });
  const payload = enc({ iss: sa.client_email, sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/datastore' });
  const unsigned = `${header}.${payload}`;
  const keyStr = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g,'').replace(/\n/g,'');
  const keyData = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${unsigned}.${sigB64}`
  });
  return (await r.json()).access_token;
}

// Verify Firebase ID token by decoding JWT payload (checks iss, aud, exp)
function verifyFirebaseJwt(auth) {
  try {
    const token = auth.replace('Bearer ', '');
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const pad = s => s + '='.repeat((4 - s.length % 4) % 4);
    const payload = JSON.parse(atob(pad(parts[1].replace(/-/g, '+').replace(/_/g, '/'))));
    const now = Math.floor(Date.now() / 1000);
    return payload.iss === 'https://securetoken.google.com/' + PROJECT_ID
        && payload.aud === PROJECT_ID
        && payload.exp > now;
  } catch { return false; }
}

function toV(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toV) } };
  if (typeof v === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k,x]) => [k, toV(x)])) } };
  return { stringValue: String(v) };
}
function fromV(v) {
  if (!v) return null;
  if ('nullValue' in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('stringValue' in v) return v.stringValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromV);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k,x]) => [k, fromV(x)]));
  return null;
}
function fromDoc(doc) {
  if (!doc?.fields) return null;
  return Object.fromEntries(Object.entries(doc.fields).map(([k,v]) => [k, fromV(v)]));
}

async function fsGet(path, token) {
  const r = await fetch(`${FS_BASE}/${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 404) return null;
  return fromDoc(await r.json());
}
async function fsSet(path, data, token) {
  const fields = Object.fromEntries(Object.entries(data).map(([k,v]) => [k, toV(v)]));
  const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  await fetch(`${FS_BASE}/${path}?${mask}`, {
    method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });
}
async function fsCollection(col, token) {
  const r = await fetch(`${FS_BASE}/${col}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await r.json();
  return (data.documents || []).map(doc => ({ id: doc.name.split('/').pop(), ...fromDoc(doc) }));
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, x-admin-secret, Content-Type'
};

function isAuthorized(request, env) {
  const secret = request.headers.get('x-admin-secret');
  const auth = request.headers.get('authorization') || '';
  if (env.ADMIN_SECRET && secret === env.ADMIN_SECRET) return true;
  if (env.CRON_SECRET && auth === 'Bearer ' + env.CRON_SECRET) return true;
  if (auth.startsWith('Bearer ')) return verifyFirebaseJwt(auth);
  return false;
}

async function runScan(env) {
  const token = await getToken(env);
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const now = new Date().toISOString();
  const scanId = now;
  const delay = ms => new Promise(r => setTimeout(r, ms));

  const writeStatus = data => fsSet('_meta/scanStatus', { ...data, updatedAt: new Date().toISOString() }, token);
  const isCancelled = async () => {
    const snap = await fsGet('_meta/activeScan', token);
    return snap ? snap.scanId !== scanId : false;
  };

  const obstacles = await fsCollection('obstacles', token);
  const totalMilestones = obstacles.reduce((s, o) => s + (o.milestones?.length || 0), 0);

  await fsSet('_meta/activeScan', { scanId }, token);
  await writeStatus({ status: 'running', startedAt: now, currentObstacle: '',
    obstacleIndex: 0, totalObstacles: obstacles.length,
    milestonesScanned: 0, totalMilestones, milestonesUpdated: 0, obstaclesUpdated: 0, log: [] });

  let milestonesScanned = 0, milestonesUpdated = 0, obstaclesUpdated = 0;
  const log = [];

  for (let oi = 0; oi < obstacles.length; oi++) {
    const obs = obstacles[oi];
    const milestones = obs.milestones || [];
    const toScan = milestones.filter(ms => !ms.completed);
    if (!toScan.length) { milestonesScanned += milestones.length; continue; }

    await writeStatus({ status: 'running', startedAt: now, currentObstacle: obs.shortName || obs.name,
      obstacleIndex: oi + 1, totalObstacles: obstacles.length,
      milestonesScanned, totalMilestones, milestonesUpdated, obstaclesUpdated, log: log.slice(-20) });

    if (await isCancelled()) { return { cancelled: true }; }
    await delay(13000);

    const milestoneList = toScan.map((ms, i) => `${i+1}. [${ms.id}] "${ms.name}"`).join('\n');
    const prompt = `You are a scientific literature analyst specialising in longevity, genetics, and nanotechnology research.

Obstacle: "${obs.name}"

For EACH milestone below, assess whether it has been ACHIEVED in peer-reviewed scientific literature as of your knowledge cutoff.

ACHIEVED means: direct experimental evidence meeting the specific quantitative threshold described, published in a reputable journal.
NOT YET ACHIEVED means: theoretical goal, only partial evidence, preprints only, or incomplete clinical trials.

Milestones:
${milestoneList}

Respond ONLY as a JSON array — one object per milestone, in order:
[{"id": "...", "achieved": true/false, "confidence": "high"/"medium"/"low", "evidence": "One sentence citing specific paper/author/journal/year if achieved, otherwise null"}, ...]`;

    let geminiResp = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        geminiResp = await fetch(GEMINI_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (geminiResp.ok) break;
        if ((geminiResp.status === 429 || geminiResp.status === 503) && attempt < 3) { await delay(30000); continue; }
        break;
      } catch (_) { if (attempt < 3) { await delay(5000); continue; } }
    }

    if (!geminiResp?.ok) {
      const errText = geminiResp ? (await geminiResp.text()).slice(0, 200) : 'fetch failed';
      log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, error: `Gemini ${geminiResp?.status}: ${errText}` });
      milestonesScanned += toScan.length; continue;
    }

    try {
      const geminiData = await geminiResp.json();
      const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, error: 'No JSON array in response' });
        milestonesScanned += toScan.length; continue;
      }
      const results = JSON.parse(jsonMatch[0]);
      const updatedMilestones = [...milestones];
      let obsChanged = false, obsConfirmed = 0;

      for (const result of results) {
        const idx = milestones.findIndex(ms => ms.id === result.id);
        if (idx === -1) continue;
        if (result.achieved && result.confidence !== 'low') {
          updatedMilestones[idx] = { ...milestones[idx], completed: true,
            evidence: result.evidence || '', confirmedAt: now, confidence: result.confidence };
          obsChanged = true; milestonesUpdated++; obsConfirmed++;
        }
        milestonesScanned++;
      }
      milestonesScanned += Math.max(0, toScan.length - results.length);
      log.push({ t: new Date().toISOString().slice(11,19), obs: obs.shortName || obs.id, scanned: toScan.length, confirmed: obsConfirmed });

      if (obsChanged) {
        await fsSet(`obstacles/${obs.id}`, { milestones: updatedMilestones, lastUpdated: now }, token);
        obstaclesUpdated++;
      }
    } catch (e) {
      log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, error: `Parse error: ${e.message}` });
      milestonesScanned += toScan.length;
    }
  }

  await writeStatus({ status: 'complete', startedAt: now, completedAt: new Date().toISOString(),
    totalObstacles: obstacles.length, milestonesScanned, totalMilestones,
    milestonesUpdated, obstaclesUpdated, log: log.slice(-50) });

  return { scanned: obstacles.length, milestonesUpdated, obstaclesUpdated };
}

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(runScan(env)); },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    if (request.method === 'GET' && url.pathname === '/status') {
      try {
        const token = await getToken(env);
        const status = await fsGet('_meta/scanStatus', token);
        return new Response(JSON.stringify(status || { status: 'never' }), {
          headers: { 'Content-Type': 'application/json', ...CORS }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
      }
    }

    if (request.method === 'POST' && url.pathname === '/scan') {
      if (!isAuthorized(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
      }
      ctx.waitUntil(runScan(env));
      return new Response(JSON.stringify({ started: true }), { headers: { 'Content-Type': 'application/json', ...CORS } });
    }

    return new Response('Not found', { status: 404 });
  }
};
