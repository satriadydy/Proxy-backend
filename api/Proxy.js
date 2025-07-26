export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  const headers = { ...req.headers };
  delete headers.host;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    const body = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') return res.status(204).end();

    res.status(response.status);
    res.setHeader('Content-Type', contentType || 'application/json');
    res.send(body);
  } catch (err) {
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
