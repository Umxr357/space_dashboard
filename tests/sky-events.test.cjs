// Usage: node tests/sky-events.test.cjs <path-to-astronomy-engine-2.1.19-astronomy.js>
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const A = require(path.resolve(process.argv[2]));
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const core = html.split('// ECLIPSE_CORE_START')[1].split('// ECLIPSE_CORE_END')[0];
const api = new Function(core.slice(core.indexOf('const SKY_CITIES')) + ';return {SKY_CITIES,calculateNextEclipse,eclipseVisibleWindows,skyLocalTime,eclipseCalendar};')();
const { SKY_CITIES, calculateNextEclipse, eclipseVisibleWindows, skyLocalTime, eclipseCalendar } = api;
const now = Date.parse('2026-09-09T00:00:00Z');
assert.equal(SKY_CITIES.length, 20);
assert.equal(new Set(SKY_CITIES.map(c => c.id)).size, 20);
const results = new Map();
for (const city of SKY_CITIES) {
  const r = calculateNextEclipse(A, city, now);
  assert.ok(r, city.id);
  assert.ok(r.begin < r.peak && r.peak < r.end);
  assert.ok(r.coverage >= 0 && r.coverage <= 1);
  assert.ok(r.windows.some(w => w[1] > now));
  assert.ok(r.windows.every(w => w[0] >= r.begin && w[1] <= r.end && w[1] > w[0]));
  assert.ok(r.frames.every(f => Number.isFinite(f.coverage) && f.coverage >= 0 && f.coverage <= 1));
  assert.ok(skyLocalTime(r.peak, city, true));
  results.set(city.id, r);
}
// Independent reference: NASA London local circumstances (standard time / UTC).
// https://eclipse.gsfc.nasa.gov/SEcirc/SEcircEU/LondonGBR1%2B21.html
const london = results.get('london');
assert.ok(Math.abs(london.peak - Date.parse('2027-08-02T09:00:00Z')) < 120000);
assert.ok(Math.abs(london.coverage - 0.419) < 0.005);
assert.match(skyLocalTime(london.peak, SKY_CITIES.find(c => c.id === 'london')), /10:00/);
// Independent reference: NASA Dallas 2024 totality maximum, 1:42 pm CDT.
// https://science.nasa.gov/eclipses/future-eclipses/eclipse-2024/where-when/
const dallas = calculateNextEclipse(A, {id:'dallas',lat:32.7767,lon:-96.797}, Date.parse('2024-04-01T00:00:00Z'));
assert.equal(dallas.kind, 'total');
assert.ok(Math.abs(dallas.peak - Date.parse('2024-04-08T18:42:00Z')) < 120000);
assert.equal(results.get('sydney').kind, 'total');
// Sunset-edge case: visible partial phase, but maximum occurs after sunset.
const singapore = results.get('singapore');
assert.ok(singapore.peakAltitude < 0);
assert.ok(singapore.windows.at(-1)[1] < singapore.peak);
const delhi = SKY_CITIES.find(c => c.id === 'delhi');
const first = results.get('delhi');
assert.equal(calculateNextEclipse(A, delhi, first.peak).peak, first.peak);
assert.ok(calculateNextEclipse(A, delhi, first.end + 1000).peak > first.peak);
assert.equal(calculateNextEclipse(A, delhi, now, 0), null);
assert.throws(() => calculateNextEclipse(A, {lat:91,lon:0}, now));
assert.deepEqual(eclipseVisibleWindows(0,180000,()=>-1), []);
assert.deepEqual(eclipseVisibleWindows(0,180000,()=>1), [[0,180000]]);
const rising = eclipseVisibleWindows(0,180000,t=>t-90000);
assert.ok(Math.abs(rising[0][0]-90000)<500);
const ics = eclipseCalendar(first, {...delhi,name:'City, test; Unicode 東京'});
assert.match(ics, /DTSTART:\d{8}T\d{6}Z/);
assert.match(ics, /City\\, test\\;/);
assert.ok(ics.split('\r\n').every(line => Buffer.byteLength(line,'utf8') <= 75));
assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
console.log('PASS: 20 cities, NASA London/Dallas references, totality, sunset, ongoing/expired events, timezone, validation, calendar.');
