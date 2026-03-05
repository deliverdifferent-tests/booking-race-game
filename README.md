# DD Booking Race 🏎️

Split-screen training game for delivery ops teams.

- **Left side**: Real booking UI (iframe from booking-ui-testbed)
- **Right side**: OutRun-style pseudo-3D racing game

## Workflow
1. Type pickup address → car accelerates
2. Select from autocomplete → combo boost
3. Select parcel size → nitro flames
4. Choose delivery speed → overtakes
5. Click Book → 🏁 MISSION COMPLETE

## Run Locally
```bash
npm install
BOOKING_URL=http://localhost:3001 npm start
```

## Environment Variables
- `BOOKING_URL` — URL of the booking-ui-testbed deployment (default: Railway URL)
- `PORT` — server port (default: 3000)

## Deploy to Railway
Push to GitHub → link repo in Railway → set `BOOKING_URL` env var → deploy.
