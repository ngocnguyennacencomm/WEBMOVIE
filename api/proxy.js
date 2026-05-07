export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  // Thử lần lượt các base URL của vsmov
  const bases = [
    `https://vsmov.com/${path}`,
    `https://vsmov.com/api/${path}`,
  ];

  for (const url of bases) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://vsmov.com/',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'vi-VN,vi;q=0.9',
        },
      });
      if (response.ok) {
        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=60');
        return res.status(200).json(data);
      }
    } catch (e) { continue; }
  }

  return res.status(404).json({ error: 'Không tìm thấy endpoint hợp lệ từ vsmov.com' });
}
