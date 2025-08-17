// Basic index API endpoint
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'ok',
    message: 'Basic API working',
    timestamp: new Date().toISOString()
  });
}