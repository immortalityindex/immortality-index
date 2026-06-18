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
  const key = await crypto.subtle.importKey('pkcs8', keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${unsigned}.${sigB64}`
  });
  return (await r.json()).access_token;
}

function verifyFirebaseJwt(auth) {
  try {
    const token = auth.replace('Bearer ', '');
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const pad = s => s + '='.repeat((4 - s.length % 4) % 4);
    const payload = JSON.parse(atob(pad(parts[1].replace(/-/g,'+').replace(/_/g,'/'))));
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
  if (typeof v === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k,x]) => [k,toV(x)])) } };
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
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,x])=>[k,fromV(x)]));
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
  const d = await r.json();
  return (d.documents || []).map(doc => ({ id: doc.name.split('/').pop(), ...fromDoc(doc) }));
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

// Scan a single obstacle synchronously
async function scanObstacle(obs, env, token) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const milestones = obs.milestones || [];
  const toScan = milestones.filter(ms => !ms.completed);
  if (!toScan.length) return { scanned: 0, confirmed: 0, skipped: true };

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
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      geminiResp = await fetch(GEMINI_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (geminiResp.ok) break;
      if ((geminiResp.status === 429 || geminiResp.status === 503) && attempt < 2) {
        await delay(8000); continue;
      }
      break;
    } catch { if (attempt < 2) { await delay(3000); continue; } }
  }

  if (!geminiResp?.ok) {
    const err = geminiResp ? `Gemini ${geminiResp.status}` : 'fetch failed';
    return { scanned: toScan.length, confirmed: 0, error: err };
  }

  try {
    const gd = await geminiResp.json();
    const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) return { scanned: toScan.length, confirmed: 0, error: 'No JSON in response' };
    const results = JSON.parse(m[0]);
    const now = new Date().toISOString();
    const updatedMilestones = [...milestones];
    let confirmed = 0;
    for (const result of results) {
      const idx = milestones.findIndex(ms => ms.id === result.id);
      if (idx === -1) continue;
      if (result.achieved && result.confidence !== 'low') {
        updatedMilestones[idx] = { ...milestones[idx], completed: true,
          evidence: result.evidence || '', confirmedAt: now, confidence: result.confidence };
        confirmed++;
      }
    }
    if (confirmed > 0) {
      await fsSet(`obstacles/${obs.id}`, { milestones: updatedMilestones, lastUpdated: now }, token);
    }
    return { scanned: toScan.length, confirmed };
  } catch (e) {
    return { scanned: toScan.length, confirmed: 0, error: e.message };
  }
}

// Full sequential scan for cron (runs in waitUntil)
async function runFullScan(env) {
  const token = await getToken(env);
  const now = new Date().toISOString();
  const obstacles = await fsCollection('obstacles', token);
  const totalMilestones = obstacles.reduce((s, o) => s + (o.milestones?.length || 0), 0);
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let milestonesScanned = 0, milestonesUpdated = 0, obstaclesUpdated = 0;
  const log = [];

  await fsSet('_meta/scanStatus', { status: 'running', startedAt: now,
    totalObstacles: obstacles.length, totalMilestones, milestonesScanned: 0,
    milestonesUpdated: 0, obstaclesUpdated: 0, log: [], updatedAt: now }, token);

  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    await fsSet('_meta/scanStatus', { currentObstacle: obs.shortName || obs.name,
      obstacleIndex: i + 1, milestonesScanned, milestonesUpdated, obstaclesUpdated,
      log: log.slice(-20), updatedAt: new Date().toISOString() }, token);
    if (i > 0) await delay(7000);
    const result = await scanObstacle(obs, env, token);
    milestonesScanned += result.scanned || 0;
    if (result.confirmed > 0) { milestonesUpdated += result.confirmed; obstaclesUpdated++; }
    log.push({ t: new Date().toISOString().slice(11,19), obs: obs.shortName || obs.id,
      scanned: result.scanned, confirmed: result.confirmed, ...(result.error ? { error: result.error } : {}) });
  }

  await fsSet('_meta/scanStatus', { status: 'complete', completedAt: new Date().toISOString(),
    milestonesScanned, milestonesUpdated, obstaclesUpdated, log: log.slice(-50),
    updatedAt: new Date().toISOString() }, token);
}

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(runFullScan(env)); },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    // GET /status — public
    if (request.method === 'GET' && url.pathname === '/status') {
      try {
        const token = await getToken(env);
        const status = await fsGet('_meta/scanStatus', token);
        return new Response(JSON.stringify(status || { status: 'never' }),
          { headers: { 'Content-Type': 'application/json', ...CORS } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
      }
    }

    // GET /obstacles — returns list of obstacle IDs and milestone counts
    if (request.method === 'GET' && url.pathname === '/obstacles') {
      if (!isAuthorized(request, env))
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
      try {
        const token = await getToken(env);
        const obs = await fsCollection('obstacles', token);
        const list = obs.map(o => ({
          id: o.id, name: o.shortName || o.name,
          total: o.milestones?.length || 0,
          remaining: (o.milestones || []).filter(m => !m.completed).length
        }));
        return new Response(JSON.stringify({ obstacles: list }),
          { headers: { 'Content-Type': 'application/json', ...CORS } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
      }
    }

    // POST /scan — scan ONE obstacle by id, returns result synchronously
    // Body: { obstacleId: string } OR { all: true } for full scan (background)
    if (request.method === 'POST' && url.pathname === '/scan') {
      if (!isAuthorized(request, env))
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
      try {
        const body = await request.json().catch(() => ({}));
        const token = await getToken(env);

        if (body.obstacleId) {
          // Single-obstacle scan — synchronous, fits in 30s
          const obs = await fsGet(`obstacles/${body.obstacleId}`, token);
          if (!obs) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: CORS });
          obs.id = body.obstacleId;
          const result = await scanObstacle(obs, env, token);
          // Update scan status
          const status = await fsGet('_meta/scanStatus', token);
          if (status) {
            await fsSet('_meta/scanStatus', {
              milestonesScanned: (status.milestonesScanned || 0) + (result.scanned || 0),
              milestonesUpdated: (status.milestonesUpdated || 0) + (result.confirmed || 0),
              currentObstacle: obs.name || body.obstacleId,
              updatedAt: new Date().toISOString(),
              ...(result.error ? { lastError: result.error } : {})
            }, token);
          }
          return new Response(JSON.stringify(result),
            { headers: { 'Content-Type': 'application/json', ...CORS } });
        }

        // Legacy: full scan in background (only works if Worker lifetime allows)
        ctx.waitUntil(runFullScan(env));
        return new Response(JSON.stringify({ started: true }),
          { headers: { 'Content-Type': 'application/json', ...CORS } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
