const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const BOOKING_URL = process.env.BOOKING_URL || 'https://booking-ui-testbed-production.up.railway.app';

// Serve the game page at /race
app.get('/race', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'public', 'race.html'), 'utf8');
  res.type('html').send(html);
});

app.get('/health', (_, res) => res.json({ ok: true }));

// Proxy everything else to the booking UI (same-origin for iframe access)
const proxy = createProxyMiddleware({
  target: BOOKING_URL,
  changeOrigin: true,
  ws: false,
});

app.use((req, res, next) => {
  // Don't proxy our own routes
  if (req.path === '/race' || req.path === '/health') return next();
  return proxy(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`booking-race-game on :${port} | proxying booking UI from: ${BOOKING_URL}`));
