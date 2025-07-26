// api/index.js

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  try {
    const fetchRes = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers || {}),
      },
      body: req.method === 'GET' ? null : req.body,
    });

    const contentType = fetchRes.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await fetchRes.json();
      return res.status(fetchRes.status).json(data);
    } else {
      const text = await fetchRes.text();
      return res.status(fetchRes.status).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
}
