const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const BOOKING_URL = process.env.BOOKING_URL || 'https://booking-ui-testbed-production.up.railway.app';

// Serve index.html with BOOKING_URL injected
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  html = html.replace('BOOKING_URL_PLACEHOLDER', BOOKING_URL);
  res.type('html').send(html);
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`booking-race-game on :${port} | booking UI: ${BOOKING_URL}`));
