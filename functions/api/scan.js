// Cloudflare Pages Function — proxy to the deployed scanner Worker
// Route: POST /api/scan  (admin.html trigger button)

const WORKER_URL = 'https://immortality-index-scanner.immortalityindex.workers.dev/scan';

export async function onRequestPost(context) {
  const auth = context.request.headers.get('Authorization') || '';
  let body = '{}';
  try { body = await context.request.text(); } catch {}

  const resp = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
    },
    body,
  });

  const data = await resp.text();
  return new Response(data, {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}
