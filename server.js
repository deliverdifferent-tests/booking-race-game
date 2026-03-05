const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use('/Assets', express.static(path.join(__dirname, 'wwwroot', 'Assets')));
app.use('/App', express.static(path.join(__dirname, 'wwwroot', 'App')));

// No caching + log all requests
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  if (!req.path.match(/\.(js|css|png|jpg|ico|woff|ttf|map)$/)) {
    console.log(`[REQ] ${req.method} ${req.path}`);
  }
  next();
});

app.get('/health', (_, res) => res.json({ ok: true }));

// ── Country Code ──
app.get('/CountryCode', (_, res) => res.json('NZ'));

// ── Clients ──
const testContact = {
  id: 1, name: 'Test User', email: 'test@test.com', mobile: '0211234567',
  jobTitle: 'Manager', createdUnix: 1700000000,
  defaultJobSize: null, defaultPackageSize: null, defaultTrackingMethod: null,
  defaultTrackingEmail: 'test@test.com', defaultTrackingMobile: '0211234567',
  holdJobs: false, defaultJobType: null, defaultJobSpeed: null,
  defaultClientAddressBookId: null
};
const testClient = {
  id: 1, name: 'Test Company Ltd', code: 'TEST001', americanCity: 'Auckland',
  countryCode: 'NZ', accessorialChargeGroupId: 1, bookJobPermission: true,
  loggedInContactId: 1, createdUnix: 1700000000, addressBookOnly: false,
  defaultSpeedId: 1, defaultVehicleSizeId: 1, useGoogleMaps: true,
  internal: false, defaultClient: null, address: '123 Queen Street, Auckland',
  suburb: 'Auckland CBD', city: 'Auckland', state: '', zipCode: '1010',
  addressExtras: '', extraInfo: '', webServicePassword: 'test',
  sigRequiredDefault: null, economyRun1: null, economyRun2: null,
  economyRun3: null, economyRun4: null, economyRun5: null,
  economyRun6: null, economyRun7: null, economyRun8: null,
  stockSizes: [
    { id: 1, name: 'Small Satchel', length: 30, width: 20, height: 10, weight: 1 },
    { id: 2, name: 'Medium Box', length: 40, width: 30, height: 30, weight: 5 },
    { id: 3, name: 'Large Box', length: 60, width: 40, height: 40, weight: 10 },
    { id: 4, name: 'Banana Box', length: 50, width: 35, height: 30, weight: 8 }
  ],
  contacts: [testContact]
};

app.get('/API/Client', (_, res) => res.json({ success: true, clients: [testClient] }));
app.get('/API/Client/all', (_, res) => res.json({ success: true, clients: [testClient] }));
app.get('/API/Client/:id/thisClient', (_, res) => res.json({ success: true, client: testClient }));
app.get('/API/Client/Access/:code', (_, res) => res.json({ success: true, valid: true, clientId: 1 }));
app.post('/API/Client/:id', (_, res) => res.json({ success: true }));

// ── Contacts ──
app.get('/API/Contact/:clientId', (_, res) => res.json({ success: true, contacts: [{ id: 1, name: 'Test User', email: 'test@test.com', mobile: '0211234567' }] }));
app.post('/API/Contact/:id', (_, res) => res.json({ success: true }));
app.post('/API/Contact', (_, res) => res.json({ success: true, contactId: 99 }));
app.delete('/API/Contact/:id', (_, res) => res.json({ success: true }));

// ── Contact Subscriptions ──
app.get('/API/ContactSubscription/:id', (_, res) => res.json({ success: true, subscriptions: [] }));
app.post('/API/ContactSubscription', (_, res) => res.json({ success: true }));
app.delete('/API/ContactSubscription/:id/:subId', (_, res) => res.json({ success: true }));

// ── Client Contacts ──
app.get('/API/ClientContact/:contactId/:clientId', (_, res) => res.json({ success: true, clientContact: { id: 1, contactId: 1, clientId: 1, isAdmin: true, canBook: true } }));
app.post('/API/ClientContact/:id', (_, res) => res.json({ success: true }));
app.post('/API/ClientContact', (_, res) => res.json({ success: true }));
app.delete('/API/ClientContact/:id', (_, res) => res.json({ success: true }));

// ── Client Contact Internet Permissions ──
app.get('/API/ClientContactInternetPermission/:id', (_, res) => res.json({ success: true, permissions: [] }));
app.post('/API/ClientContactInternetPermission', (_, res) => res.json({ success: true }));
app.delete('/API/ClientContactInternetPermission/:id/:subId', (_, res) => res.json({ success: true }));

// ── Client Contact Job Types ──
app.get('/API/ClientContactJobType/:id', (_, res) => res.json({ success: true, jobTypes: [] }));
app.post('/API/ClientContactJobType', (_, res) => res.json({ success: true }));
app.delete('/API/ClientContactJobType/:id/:jobTypeId', (_, res) => res.json({ success: true }));

// ── Internet Permissions ──
app.get('/API/InternetPermission', (_, res) => res.json({ success: true, permissions: [{ id: 1, description: 'Book Jobs' }] }));

// ── Speeds ──
app.get('/API/Speed/:clientId', (_, res) => res.json({ success: true, speeds: [
  { id: 1, name: 'Standard', description: 'Standard delivery', minutes: 240, groupingName: 'Standard', jobLetter: 'S', imageUrl: '/Assets/images/economy.png', speedGroupId: 1 },
  { id: 2, name: 'Express', description: 'Express delivery', minutes: 120, groupingName: 'Express', jobLetter: 'E', imageUrl: '/Assets/images/1hour.png', speedGroupId: 2 },
  { id: 3, name: 'Overnight', description: 'Overnight delivery', minutes: 720, groupingName: 'Overnight', jobLetter: 'O', imageUrl: '/Assets/images/airNationwide.png', speedGroupId: 3 },
  { id: 50, name: '3 Hours', description: 'Delivery within 3 hours', minutes: 180, groupingName: 'Standard', jobLetter: 'H', imageUrl: '/Assets/images/3hour.png', speedGroupId: 1 },
  { id: 51, name: 'Same Day', description: 'Delivery same business day', minutes: 480, groupingName: 'Standard', jobLetter: 'D', imageUrl: '/Assets/images/economy.png', speedGroupId: 1 }
] }));
app.get('/api/Speed/Allowed', (_, res) => res.json({ success: true, speeds: [
  { id: 1, name: 'Standard' }, { id: 2, name: 'Express' }, { id: 3, name: 'Overnight' }, { id: 50, name: '3 Hours' }, { id: 51, name: 'Same Day' }
] }));
app.post('/API/Speed/description', (_, res) => res.json({ success: true, description: 'Standard Delivery' }));

// ── Vehicle Sizes ──
app.get('/API/VehicleSize/:clientId', (_, res) => res.json({ success: true, vehicleSizes: [
  { id: 1, name: 'Car/Van', description: 'Small (Car/Van)', maxWeight: 25, defaultForBooking: true },
  { id: 2, name: 'Van', description: 'Medium (Van)', maxWeight: 100, defaultForBooking: false },
  { id: 3, name: 'Truck', description: 'Large (Truck)', maxWeight: 500, defaultForBooking: false }
] }));

// ── Job Type Statuses ──
app.get('/API/JobTypeStatus', (_, res) => res.json({ success: true, jobTypeStatuses: [
  { id: 1, description: 'Pickup' }, { id: 2, description: 'Delivery' }
] }));

// ── Suburbs ──
app.get('/API/Suburb', (_, res) => res.json({ success: true, suburbs: [
  { id: 1, name: 'Auckland CBD', postCode: '1010', city: 'Auckland', siteId: 1, alias: null },
  { id: 2, name: 'Newmarket', postCode: '1023', city: 'Auckland', siteId: 1, alias: null },
  { id: 3, name: 'Ponsonby', postCode: '1011', city: 'Auckland', siteId: 1, alias: null },
  { id: 4, name: 'Mt Eden', postCode: '1024', city: 'Auckland', siteId: 1, alias: ['Mount Eden'] },
  { id: 5, name: 'Parnell', postCode: '1052', city: 'Auckland', siteId: 1, alias: null },
  { id: 6, name: 'Grey Lynn', postCode: '1021', city: 'Auckland', siteId: 1, alias: null },
  { id: 7, name: 'Remuera', postCode: '1050', city: 'Auckland', siteId: 1, alias: null },
  { id: 8, name: 'Penrose', postCode: '1061', city: 'Auckland', siteId: 2, alias: null },
  { id: 9, name: 'Manukau', postCode: '2104', city: 'Auckland', siteId: 2, alias: null },
  { id: 10, name: 'Henderson', postCode: '0612', city: 'Auckland', siteId: 3, alias: null }
] }));

// ── TimeZones ──
app.get('/API/TimeZone', (_, res) => res.json({ success: true, timeZones: [
  { id: 1, displayName: 'Pacific/Auckland', utcOffset: 12 }
] }));
app.post('/API/Key/:lat/:lng', (_, res) => res.json('Pacific/Auckland'));

// ── Sites ──
app.get('/API/Site', (_, res) => res.json({ success: true, sites: [{ id: 1, name: 'Auckland', code: 'AKL' }] }));

// ── Accessorial Charges ──
app.get('/API/AccessorialCharge/:groupId/:clientId/:speedId/:vehicleSizeId', (_, res) => res.json({ success: true, accessorialCharges: [] }));

// ── References ──
app.get('/API/Reference/:clientId/:letter', (_, res) => res.json({ success: true, references: [] }));
app.post('/API/reference/:id/:refName/:letter', (_, res) => res.json({ success: true }));
app.delete('/API/reference/:id/:refId/:letter', (_, res) => res.json({ success: true }));

// ── Address Book ──
app.get('/API/AddressBook/:clientId', (_, res) => res.json({ success: true, addressBook: [] }));
app.post('/API/AddressBook/:clientId/update', (_, res) => res.json({ success: true }));
app.post('/API/AddressBook/:clientId', (_, res) => res.json({ success: true, addressBookId: 1 }));
app.delete('/API/AddressBook/:id', (_, res) => res.json({ success: true }));

// ── Saved Bookings (JobSaved) ──
app.get('/API/JobSaved/:clientId', (_, res) => res.json({ success: true, jobSaveds: [] }));
app.post('/API/JobSaved/:clientId/update', (_, res) => res.json({ success: true }));
app.post('/API/JobSaved/:clientId', (_, res) => res.json({ success: true, jobSavedId: 1 }));

// ── Undeliverable Locations ──
app.get('/api/UndeliverableLocation', (_, res) => res.json({ success: true, locations: [] }));

// ── Geocode / Key ──
app.post('/api/Key', (req, res) => res.json({
  success: true,
  googleMapsData: {
    results: [{
      formatted_address: '123 Queen Street, Auckland CBD, Auckland 1010, New Zealand',
      geometry: { location: { lat: -36.848461, lng: 174.763336 } },
      address_components: [
        { long_name: '123', types: ['street_number'] },
        { long_name: 'Queen Street', types: ['route'] },
        { long_name: 'Auckland CBD', types: ['sublocality'] },
        { long_name: 'Auckland', types: ['locality'] },
        { long_name: '1010', types: ['postal_code'] },
        { long_name: 'New Zealand', types: ['country'], short_name: 'NZ' }
      ]
    }]
  }
}));

// ── Couriers ──
app.get('/API/Courier', (_, res) => res.json({ success: true, couriers: [{ id: 1, name: 'FedEx Test' }] }));

// ── UrgentAPI (Token, Rates, Job) ──
app.post('/API/UrgentAPI/Token', (_, res) => res.json({
  success: true, token: 'TEST-TOKEN-' + Date.now(), expiry: new Date(Date.now() + 3600000).toISOString()
}));

app.post('/API/UrgentAPI/Rates', (req, res) => {
  console.log('[RATES] returning mock rates');
  res.json({ errors: {}, rates: [
    {
      speedId: 50, actualSpeedId: 50, vehicleSizeId: 1,
      serviceName: '3 Hours',
      description: 'Delivery within 3 hours',
      amount: 69.00, currency: 'NZD',
      duration: 180,
      availabilityColour: '#00FF00',
      availabilityMessage: 'Available',
      accessorialChargeGroupId: 1,
      bookDate: new Date().toISOString(),
      selected: false
    },
    {
      speedId: 51, actualSpeedId: 51, vehicleSizeId: 1,
      serviceName: 'Same Day',
      description: 'Delivery same business day',
      amount: 49.00, currency: 'NZD',
      duration: 480,
      availabilityColour: '#00FF00',
      availabilityMessage: 'Available',
      accessorialChargeGroupId: 1,
      bookDate: new Date().toISOString(),
      selected: false
    }
  ] });
});

app.post('/api/UrgentAPI/Rerate', (_, res) => res.json({ success: true, amount: 22.50 }));

app.post('/API/UrgentAPI/Job', (_, res) => {
  const jobId = Math.floor(Math.random() * 900000) + 100000;
  res.json({ success: true, jobID: jobId, jobNumber: `TEST-${jobId}`, isBulk: false, prebook: false, email: 'test@test.com' });
});

app.post('/api/UrgentAPI/Quantity', (_, res) => res.json({ success: true }));

app.post('/API/UrgentAPI/JobLabel', (_, res) => res.json({ success: true, labelData: null }));

// ── Jobs ──
app.get('/api/Job/Contact/:clientId/:contactId', (_, res) => res.json({ success: true, jobs: [] }));
app.post('/api/Job/FilteredContact/:clientId/:contactId', (_, res) => res.json({ success: true, jobs: [] }));
app.post('/api/Job/Contact', (_, res) => res.json({ success: true }));
app.get('/API/Job/:jobId/:jobNumber/:prebook', (req, res) => res.json({
  success: true, job: { jobId: Number(req.params.jobId), jobNumber: req.params.jobNumber, status: 'Booked' }
}));
app.delete('/API/Job/:jobId/:jobNumber', (_, res) => res.json({ success: true }));
app.post('/API/Job/:jobId/:jobNumber/:toggleVoid', (_, res) => res.json({ success: true }));
app.post('/API/Job/ConnectReturnParts/:a/:b', (_, res) => res.json({ success: true }));

// ── Invoices ──
app.get('/API/Invoice/:clientId', (_, res) => res.json({ success: true, invoices: [] }));

// ── Stripe ──
app.post('/API/stripe', (_, res) => res.json({ success: true, sessionId: 'cs_test', url: '/' }));
app.post('/API/stripe/:customerId', (_, res) => res.json({ success: true }));
app.post('/API/stripe/onetime/:page', (_, res) => res.json({ success: true, url: '/' }));

// ── Feedback / Email ──
app.post('/API/Feedback', (_, res) => res.json({ success: true }));
app.post('/API/Email', (_, res) => res.json({ success: true }));

// ── Labels ──
app.get('/Labels/Jobs/:jobId/:clientId', (_, res) => res.json({ success: true }));
app.get('/Labels/BulkJobs/:bulkJobId', (_, res) => res.json({ success: true }));

// ── Race mode ──
app.get('/race', (req, res) => {
  res.sendFile(path.join(__dirname, 'race.html'));
});

// ── SPA catch-all ──
app.get('*', (req, res) => {
  if (req.path.startsWith('/API/') || req.path.startsWith('/api/')) {
    return res.status(200).json({ success: true });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all POST/DELETE for any unmocked API
app.all('/API/*', (_, res) => res.json({ success: true }));
app.all('/api/*', (_, res) => res.json({ success: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`booking-ui-testbed (real UI + mock APIs) on :${port}`));
