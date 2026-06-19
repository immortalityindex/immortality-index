// Immortality Index — Cloudflare Worker (scanner + email notifier)

const PROJECT_ID = 'immortality-index';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const SITE_URL = 'immortalityindex.github.io/immortality-index';

// ── SVG helpers ─────────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function bgBase(W, H) {
  const gv = Array.from({length:16},(_,i)=>`<line x1="${i*80}" y1="0" x2="${i*80}" y2="${H}" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>`).join('');
  const gh = Array.from({length:9},(_,i)=>`<line x1="0" y1="${i*80}" x2="${W}" y2="${i*80}" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>`).join('');
  return `<rect width="${W}" height="${H}" fill="#070d1a"/>${gv}${gh}<circle cx="960" cy="120" r="220" fill="#4db8ff" fill-opacity="0.04"/><circle cx="180" cy="480" r="160" fill="#4db8ff" fill-opacity="0.03"/><rect x="60" y="60" width="${W-120}" height="${H-120}" fill="#ffffff" fill-opacity="0.02" rx="8" stroke="#4db8ff" stroke-opacity="0.15" stroke-width="1"/>`;
}
function brand() {
  return `<text x="100" y="116" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="500" fill="#7cc8f8" fill-opacity="0.65" letter-spacing="3">IMMORTALITY INDEX</text>`;
}
function footerSVG(W, H) {
  const mo = new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'});
  return `<text x="100" y="${H-65}" font-family="system-ui,-apple-system,sans-serif" font-size="18" fill="#7cc8f8" fill-opacity="0.48">${SITE_URL}</text><text x="${W-100}" y="${H-65}" font-family="system-ui,-apple-system,sans-serif" font-size="17" fill="#7cc8f8" fill-opacity="0.36" text-anchor="end">${esc(mo)}</text>`;
}
function pBar(x, y, w, h, pct) {
  const fw = pct > 0 ? `<rect x="${x}" y="${y}" width="${Math.max(h, w*pct).toFixed(1)}" height="${h}" rx="${h/2}" fill="url(#bar)"/>` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="#ffffff" fill-opacity="0.08"/>${fw}`;
}

function stateOfPlaySVG(g, n) {
  const W=1200, H=628, bw=W-200;
  const gp = g.total>0 ? g.confirmed/g.total : 0;
  const np = n.total>0 ? n.confirmed/n.total : 0;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1d6fa8"/><stop offset="100%" stop-color="#4db8ff"/></linearGradient></defs>
${bgBase(W,H)}${brand()}
<text x="100" y="198" font-family="system-ui,-apple-system,sans-serif" font-size="50" font-weight="700" fill="#ffffff">Where does humanity stand</text>
<text x="100" y="258" font-family="system-ui,-apple-system,sans-serif" font-size="50" font-weight="700" fill="#ffffff">on defeating aging?</text>
<text x="100" y="346" font-family="system-ui,-apple-system,sans-serif" font-size="21" fill="#b4d2ff" fill-opacity="0.8">Genetics Track</text>
<text x="${W-100}" y="346" font-family="system-ui,-apple-system,sans-serif" font-size="21" font-weight="600" fill="#ffffff" text-anchor="end">${g.confirmed} / ${g.total}  (${(gp*100).toFixed(1)}%)</text>
${pBar(100,358,bw,14,gp)}
<text x="100" y="432" font-family="system-ui,-apple-system,sans-serif" font-size="21" fill="#b4d2ff" fill-opacity="0.8">Nanotech Track</text>
<text x="${W-100}" y="432" font-family="system-ui,-apple-system,sans-serif" font-size="21" font-weight="600" fill="#ffffff" text-anchor="end">${n.confirmed} / ${n.total}  (${(np*100).toFixed(1)}%)</text>
${pBar(100,444,bw,14,np)}
${footerSVG(W,H)}</svg>`;
}

function digestSVG(trackName, confirmed, total, newMs) {
  const W=1200, H=628, bw=W-200;
  const pct = total>0 ? confirmed/total : 0;
  const isG = trackName==='Genetics';
  const c0 = isG ? '#16a34a' : '#92400e';
  const c1 = isG ? '#4ade80' : '#fbbf24';
  const shown = newMs.slice(0,3);
  const msLines = shown.map((ms,i) => {
    const nm = ms.name.length>52 ? ms.name.slice(0,52)+'...' : ms.name;
    return `<text x="120" y="${308+i*52}" font-family="system-ui,-apple-system,sans-serif" font-size="19" fill="${c1}">+  ${esc(ms.id)}  ${esc(nm)}</text>`;
  }).join('');
  const barY = 308 + shown.length*52 + 28;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${c0}"/><stop offset="100%" stop-color="${c1}"/></linearGradient></defs>
${bgBase(W,H)}${brand()}
<text x="100" y="188" font-family="system-ui,-apple-system,sans-serif" font-size="42" font-weight="700" fill="#ffffff">${esc(trackName)} Track  --  scan update</text>
<text x="100" y="246" font-family="system-ui,-apple-system,sans-serif" font-size="26" fill="${c1}">${confirmed} / ${total} confirmed  (${(pct*100).toFixed(1)}%)</text>
${msLines}
${pBar(100,barY,bw,14,pct)}
${footerSVG(W,H)}</svg>`;
}

// ── Firebase utilities ──────────────────────────────────────────────────────
async function getToken(env) {
  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now()/1000);
  const enc = obj => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const header = enc({alg:'RS256',typ:'JWT'});
  const payload = enc({iss:sa.client_email,sub:sa.client_email,
    aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600,
    scope:'https://www.googleapis.com/auth/datastore'});
  const unsigned = `${header}.${payload}`;
  const keyStr = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g,'').replace(/\n/g,'');
  const keyData = Uint8Array.from(atob(keyStr),c=>c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8',keyData,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const r = await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${unsigned}.${sigB64}`});
  return (await r.json()).access_token;
}

function verifyFirebaseJwt(auth) {
  try {
    const token = auth.replace('Bearer ','');
    const parts = token.split('.');
    if (parts.length!==3) return false;
    const pad = s=>s+'='.repeat((4-s.length%4)%4);
    const payload = JSON.parse(atob(pad(parts[1].replace(/-/g,'+').replace(/_/g,'/'))));
    const now = Math.floor(Date.now()/1000);
    return payload.iss==='https://securetoken.google.com/'+PROJECT_ID && payload.aud===PROJECT_ID && payload.exp>now;
  } catch { return false; }
}

function toV(v) {
  if (v===null||v===undefined) return {nullValue:null};
  if (typeof v==='boolean') return {booleanValue:v};
  if (typeof v==='number') return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};
  if (typeof v==='string') return {stringValue:v};
  if (Array.isArray(v)) return {arrayValue:{values:v.map(toV)}};
  if (typeof v==='object') return {mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,toV(x)]))}};
  return {stringValue:String(v)};
}
function fromV(v) {
  if (!v) return null;
  if ('nullValue' in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('stringValue' in v) return v.stringValue;
  if ('arrayValue' in v) return (v.arrayValue.values||[]).map(fromV);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,x])=>[k,fromV(x)]));
  return null;
}
function fromDoc(doc) {
  if (!doc?.fields) return null;
  return Object.fromEntries(Object.entries(doc.fields).map(([k,v])=>[k,fromV(v)]));
}
async function fsGet(path, token) {
  const r = await fetch(`${FS_BASE}/${path}`,{headers:{Authorization:`Bearer ${token}`}});
  if (r.status===404) return null;
  return fromDoc(await r.json());
}
async function fsSet(path, data, token) {
  const fields = Object.fromEntries(Object.entries(data).map(([k,v])=>[k,toV(v)]));
  const mask = Object.keys(fields).map(k=>`updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  await fetch(`${FS_BASE}/${path}?${mask}`,{method:'PATCH',
    headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
    body:JSON.stringify({fields})});
}
async function fsCollection(col, token) {
  const r = await fetch(`${FS_BASE}/${col}`,{headers:{Authorization:`Bearer ${token}`}});
  const d = await r.json();
  return (d.documents||[]).map(doc=>({id:doc.name.split('/').pop(),...fromDoc(doc)}));
}

// ── Auth ────────────────────────────────────────────────────────────────────
const CORS = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization, x-admin-secret, Content-Type'};
function isAuthorized(request, env) {
  const secret = request.headers.get('x-admin-secret');
  const auth = request.headers.get('authorization')||'';
  if (env.ADMIN_SECRET && secret===env.ADMIN_SECRET) return true;
  if (env.CRON_SECRET && auth==='Bearer '+env.CRON_SECRET) return true;
  if (auth.startsWith('Bearer ')) return verifyFirebaseJwt(auth);
  return false;
}

// ── Email via Resend ─────────────────────────────────────────────────────────
function buildTweetUrl(text) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

function emailHtml(subject, tweetText) {
  const tweetUrl = buildTweetUrl(tweetText);
  const escaped = tweetText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070d1a;font-family:system-ui,-apple-system,sans-serif;color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070d1a;">
<tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0f1829;border:1px solid #1e3a5f;border-radius:8px;overflow:hidden;max-width:600px;">
  <tr><td style="padding:28px 36px;border-bottom:1px solid #1e3a5f;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:3px;color:#7cc8f8;text-transform:uppercase;">Immortality Index</p>
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${subject}</h1>
  </td></tr>
  <tr><td style="padding:28px 36px;">
    <p style="margin:0 0 12px;font-size:13px;color:#7cc8f8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Suggested tweet</p>
    <div style="background:#070d1a;border:1px solid #1e3a5f;border-radius:6px;padding:20px;font-size:15px;line-height:1.7;color:#e0f0ff;">${escaped}</div>
    <div style="margin:24px 0;text-align:center;">
      <a href="${tweetUrl}" style="display:inline-block;padding:14px 36px;background:#1d9bf0;color:#ffffff;text-decoration:none;border-radius:9999px;font-size:15px;font-weight:700;letter-spacing:0.3px;">Post on X / Twitter</a>
    </div>
    <p style="margin:0;font-size:12px;color:#4db8ff;opacity:0.5;text-align:center;">${SITE_URL}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

async function sendEmail(subject, tweetText, env) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'Immortality Index <scanner@immortalityindex.dev>',
      to: [env.NOTIFY_EMAIL],
      subject,
      html: emailHtml(subject, tweetText)
    })
  });
  if (!r.ok) console.error(`Resend ${r.status}:`, await r.text());
}

// ── Tweet text builders ─────────────────────────────────────────────────────
function buildStateOfPlayText(g, n) {
  const gp = (g.total>0 ? g.confirmed/g.total*100 : 0).toFixed(1);
  const np = (n.total>0 ? n.confirmed/n.total*100 : 0).toFixed(1);
  return `Humanity has mapped the path to defeating biological aging.
26 scientific barriers. Binary milestones. No hype.

Genetics:  ${g.confirmed}/${g.total} (${gp}%)
Nanotech:  ${n.confirmed}/${n.total} (${np}%)

We track the race in real time.

${SITE_URL}

#Longevity #AgingResearch #OpenScience`;
}

function buildDigestText(trackName, confirmed, total, newMs) {
  const pct = (total>0 ? confirmed/total*100 : 0).toFixed(1);
  const n = newMs.length;
  const tag = trackName==='Genetics' ? '#Genetics #Epigenetics' : '#Nanotechnology #Nanotech';
  let text = `Immortality Index -- ${n} new milestone${n!==1?'s':''} confirmed.\n\n`;
  text += `${trackName} Track: ${confirmed}/${total} (${pct}%)\n\n`;
  newMs.slice(0,2).forEach(ms => {
    const nm = ms.name.length>48 ? ms.name.slice(0,48)+'...' : ms.name;
    text += `+ ${ms.id}: ${nm}\n`;
  });
  if (newMs.length>2) text += `+ ${newMs.length-2} more\n`;
  text += `\nWe are ${pct}% of the way.\n\n${SITE_URL}\n\n${tag} #Longevity`;
  return text;
}

// ── Email orchestration ──────────────────────────────────────────────────────
async function emailAfterScan(obstacles, newlyConfirmed, token, env) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return;

  function trackStats(obs) {
    return {
      confirmed: obs.reduce((s,o)=>s+(o.milestones||[]).filter(m=>m.completed).length,0),
      total: obs.reduce((s,o)=>s+(o.milestones||[]).length,0)
    };
  }
  const genetics = obstacles.filter(o=>(o.id||'').startsWith('G'));
  const nanotech = obstacles.filter(o=>(o.id||'').startsWith('N'));
  const gStats = trackStats(genetics);
  const nStats = trackStats(nanotech);

  const prev = await fsGet('_meta/twitterState', token);

  try {
    if (!prev) {
      // First run — send state of play email
      const text = buildStateOfPlayText(gStats, nStats);
      await sendEmail('Immortality Index — initial state of play', text, env);
    } else {
      // Only email for tracks with newly confirmed milestones
      const gNew = newlyConfirmed.filter(m=>m.id.startsWith('G'));
      const nNew = newlyConfirmed.filter(m=>m.id.startsWith('N'));
      if (gNew.length>0) {
        const text = buildDigestText('Genetics', gStats.confirmed, gStats.total, gNew);
        const n = gNew.length;
        await sendEmail(`Immortality Index — ${n} Genetics milestone${n!==1?'s':''} confirmed`, text, env);
      }
      if (nNew.length>0) {
        const text = buildDigestText('Nanotech', nStats.confirmed, nStats.total, nNew);
        const n = nNew.length;
        await sendEmail(`Immortality Index — ${n} Nanotech milestone${n!==1?'s':''} confirmed`, text, env);
      }
    }
  } catch(e) {
    console.error('Email failed:', e.message);
  }

  await fsSet('_meta/twitterState',{
    geneticsConfirmed: gStats.confirmed,
    nanotechConfirmed: nStats.confirmed,
    lastEmailedAt: new Date().toISOString()
  }, token);
}

// ── Scan logic ──────────────────────────────────────────────────────────────
async function scanObstacle(obs, env, token) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

  let milestones = obs.milestones||[];
  const defUpdatedAt = obs.milestonesUpdatedAt||null;
  if (defUpdatedAt) {
    let staleFound = false;
    milestones = milestones.map(ms => {
      if (ms.completed && ms.confirmedAt && ms.confirmedAt<defUpdatedAt) {
        staleFound=true;
        return {id:ms.id,name:ms.name,completed:false,evidence:''};
      }
      return ms;
    });
    if (staleFound) await fsSet(`obstacles/${obs.id}`,{milestones,lastUpdated:new Date().toISOString()},token);
  }

  const toScan = milestones.filter(ms=>!ms.completed);
  if (!toScan.length) return {scanned:0,confirmed:0,skipped:true,newMilestones:[]};

  const milestoneList = toScan.map((ms,i)=>`${i+1}. [${ms.id}] "${ms.name}"`).join('\n');
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
  const delay = ms=>new Promise(r=>setTimeout(r,ms));
  for (let attempt=1; attempt<=2; attempt++) {
    try {
      geminiResp = await fetch(GEMINI_URL,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
      if (geminiResp.ok) break;
      if ((geminiResp.status===429||geminiResp.status===503) && attempt<2) { await delay(8000); continue; }
      break;
    } catch { if (attempt<2) { await delay(3000); continue; } }
  }

  if (!geminiResp?.ok) {
    return {scanned:toScan.length,confirmed:0,error:geminiResp?`Gemini ${geminiResp.status}`:'fetch failed',newMilestones:[]};
  }

  try {
    const gd = await geminiResp.json();
    const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text?.trim()||'';
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) return {scanned:toScan.length,confirmed:0,error:'No JSON in response',newMilestones:[]};
    const results = JSON.parse(m[0]);
    const now = new Date().toISOString();
    const updatedMilestones = [...milestones];
    const newMilestones = [];
    let confirmed = 0;
    for (const result of results) {
      const idx = milestones.findIndex(ms=>ms.id===result.id);
      if (idx===-1) continue;
      if (result.achieved && result.confidence!=='low') {
        updatedMilestones[idx] = {...milestones[idx],completed:true,
          evidence:result.evidence||'',confirmedAt:now,confidence:result.confidence};
        newMilestones.push({id:milestones[idx].id, name:milestones[idx].name, evidence:result.evidence||''});
        confirmed++;
      }
    }
    if (confirmed>0) await fsSet(`obstacles/${obs.id}`,{milestones:updatedMilestones,lastUpdated:now},token);
    return {scanned:toScan.length,confirmed,newMilestones,updatedMilestones};
  } catch(e) {
    return {scanned:toScan.length,confirmed:0,error:e.message,newMilestones:[]};
  }
}

async function runFullScan(env) {
  const token = await getToken(env);
  const now = new Date().toISOString();
  const obstacles = await fsCollection('obstacles', token);
  const totalMilestones = obstacles.reduce((s,o)=>s+(o.milestones?.length||0),0);
  const delay = ms=>new Promise(r=>setTimeout(r,ms));
  let milestonesScanned=0, milestonesUpdated=0, obstaclesUpdated=0;
  const log = [];
  const allNewlyConfirmed = [];

  await fsSet('_meta/scanStatus',{status:'running',startedAt:now,
    totalObstacles:obstacles.length,totalMilestones,milestonesScanned:0,
    milestonesUpdated:0,obstaclesUpdated:0,log:[],updatedAt:now},token);

  for (let i=0; i<obstacles.length; i++) {
    const obs = obstacles[i];
    await fsSet('_meta/scanStatus',{currentObstacle:obs.shortName||obs.name,
      obstacleIndex:i+1,milestonesScanned,milestonesUpdated,obstaclesUpdated,
      log:log.slice(-20),updatedAt:new Date().toISOString()},token);
    if (i>0) await delay(7000);
    const result = await scanObstacle(obs, env, token);
    milestonesScanned += result.scanned||0;
    if (result.confirmed>0) {
      milestonesUpdated += result.confirmed;
      obstaclesUpdated++;
      allNewlyConfirmed.push(...(result.newMilestones||[]));
      // Update in-memory obstacle so emailAfterScan sees fresh counts
      if (result.updatedMilestones) obstacles[i] = {...obs, milestones:result.updatedMilestones};
    }
    log.push({t:new Date().toISOString().slice(11,19),obs:obs.shortName||obs.id,
      scanned:result.scanned,confirmed:result.confirmed,...(result.error?{error:result.error}:{})});
  }

  await fsSet('_meta/scanStatus',{status:'complete',completedAt:new Date().toISOString(),
    milestonesScanned,milestonesUpdated,obstaclesUpdated,log:log.slice(-50),
    updatedAt:new Date().toISOString()},token);

  // Email after scan completes — first run sends state of play, subsequent runs only email on new milestones
  await emailAfterScan(obstacles, allNewlyConfirmed, token, env);
}

// ── HTTP handler ────────────────────────────────────────────────────────────
export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(runFullScan(env)); },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method==='OPTIONS') return new Response(null,{status:204,headers:CORS});

    if (request.method==='GET' && url.pathname==='/status') {
      try {
        const token = await getToken(env);
        const status = await fsGet('_meta/scanStatus', token);
        return new Response(JSON.stringify(status||{status:'never'}),
          {headers:{'Content-Type':'application/json',...CORS}});
      } catch(e) { return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS}); }
    }

    if (request.method==='GET' && url.pathname==='/obstacles') {
      if (!isAuthorized(request,env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:CORS});
      try {
        const token = await getToken(env);
        const obs = await fsCollection('obstacles', token);
        const list = obs.map(o=>({id:o.id,name:o.shortName||o.name,
          total:o.milestones?.length||0,remaining:(o.milestones||[]).filter(m=>!m.completed).length}));
        return new Response(JSON.stringify({obstacles:list}),{headers:{'Content-Type':'application/json',...CORS}});
      } catch(e) { return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS}); }
    }

    if (request.method==='POST' && url.pathname==='/scan') {
      if (!isAuthorized(request,env)) return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:CORS});
      try {
        const body = await request.json().catch(()=>({}));
        const token = await getToken(env);
        if (body.obstacleId) {
          const obs = await fsGet(`obstacles/${body.obstacleId}`, token);
          if (!obs) return new Response(JSON.stringify({error:'Not found'}),{status:404,headers:CORS});
          obs.id = body.obstacleId;
          const result = await scanObstacle(obs, env, token);
          const status = await fsGet('_meta/scanStatus', token);
          if (status) {
            await fsSet('_meta/scanStatus',{
              milestonesScanned:(status.milestonesScanned||0)+(result.scanned||0),
              milestonesUpdated:(status.milestonesUpdated||0)+(result.confirmed||0),
              currentObstacle:obs.name||body.obstacleId,
              updatedAt:new Date().toISOString(),
              ...(result.error?{lastError:result.error}:{})
            },token);
          }
          return new Response(JSON.stringify(result),{headers:{'Content-Type':'application/json',...CORS}});
        }
        ctx.waitUntil(runFullScan(env));
        return new Response(JSON.stringify({started:true}),{headers:{'Content-Type':'application/json',...CORS}});
      } catch(e) { return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS}); }
    }

    return new Response('Not found',{status:404});
  }
};
