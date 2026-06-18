// Cloudflare Pages Function — /api/milestones
// Reads all obstacle documents from Firestore and returns them as JSON.
// Requires these environment variables set in Cloudflare Pages dashboard:
//   FIREBASE_PROJECT_ID  — your Firebase project ID
//   FIREBASE_API_KEY     — your Firebase web API key

export async function onRequest(context) {
  const PROJECT = context.env.FIREBASE_PROJECT_ID;
  const KEY     = context.env.FIREBASE_API_KEY;

  if (!PROJECT || !KEY) {
    return new Response(JSON.stringify({ error: "Missing Firebase env vars" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)` +
    `/documents/obstacles?key=${KEY}&pageSize=50`;

  let raw;
  try {
    const res = await fetch(url);
    raw = await res.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  // Transform Firestore wire format → clean objects
  function unwrap(v) {
    if (!v) return null;
    if ("stringValue"  in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("integerValue"  in v) return Number(v.integerValue);
    if ("doubleValue"   in v) return v.doubleValue;
    if ("arrayValue"    in v) return (v.arrayValue.values || []).map(unwrap);
    if ("mapValue"      in v) {
      const out = {};
      for (const [k, fv] of Object.entries(v.mapValue.fields || {})) out[k] = unwrap(fv);
      return out;
    }
    return null;
  }

  const obstacles = (raw.documents || []).map(doc => {
    const fields = doc.fields || {};
    const id = doc.name.split("/").pop();
    const obj = { id };
    for (const [k, v] of Object.entries(fields)) obj[k] = unwrap(v);
    // Compute completion percentage
    const ms = Array.isArray(obj.milestones) ? obj.milestones : [];
    obj.completionPct = ms.length
      ? Math.round(ms.filter(m => m.completed).length / ms.length * 100)
      : 0;
    return obj;
  });

  // Sort by track then phase then order
  obstacles.sort((a, b) =>
    (a.track || "").localeCompare(b.track || "") ||
    (a.phase  || 0) - (b.phase  || 0) ||
    (a.order  || 0) - (b.order  || 0)
  );

  const payload = {
    meta: {
      source:      "Immortality Index",
      doi:         "10.5281/zenodo.PLACEHOLDER",
      license:     "CC BY 4.0",
      generated:   new Date().toISOString(),
      totalObstacles: obstacles.length,
      completedObstacles: obstacles.filter(o => o.completionPct === 100).length,
    },
    obstacles,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type":                "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control":               "public, max-age=3600",
    },
  });
}
