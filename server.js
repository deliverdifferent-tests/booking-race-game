const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const BOOKING_URL = process.env.BOOKING_URL || 'https://booking-ui-testbed-production.up.railway.app';

// Serve the game page at /race
app.get('/race', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'public', 'race.html'), 'utf8');
  res.type('html').send(html);
});

app.get('/health', (_, res) => res.json({ ok: true }));

// Proxy everything else to the booking UI (same-origin for iframe access)
app.use('/', createProxyMiddleware({
  target: BOOKING_URL,
  changeOrigin: true,
  ws: false,
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`booking-race-game on :${port} | proxying booking UI from: ${BOOKING_URL}`));
