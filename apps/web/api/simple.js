// Extremely simple API endpoint for testing
export default function handler(req, res) {
  return res.status(200).json({
    message: 'Simple test endpoint working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}