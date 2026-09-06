/* ABC Tutoring — simulated visitor traffic for PostHog.
 *
 *   POSTHOG_KEY=phc_xxx node tools/simulate.mjs
 *   POSTHOG_KEY=phc_xxx node tools/simulate.mjs --dry     (print summary, send nothing)
 *
 * Sends ~2 weeks of backdated, realistically-shaped traffic so the dashboard has
 * something to say on day one. Every event carries is_simulated:true so it can be
 * filtered out once real parents start visiting.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const KEY  = process.env.POSTHOG_KEY || process.argv.find(a => a.startsWith('phc_'));
const HOST = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';
const DRY  = process.argv.includes('--dry');
const SITE = process.env.SITE_URL || 'https://ct-upskilling-2026.github.io';

if (!KEY && !DRY) {
  console.error('Missing PostHog key.  Usage: POSTHOG_KEY=phc_xxx node tools/simulate.mjs');
  process.exit(1);
}

/* Use the real tutor file so the simulation always matches the live site. */
const raw = readFileSync(new URL('../data/tutors.js', import.meta.url), 'utf8');
const DATA = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));

const VISITORS = 340;
const DAYS     = 14;

const pick = (w) => {           // weighted pick from {key: weight}
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [k, v] of Object.entries(w)) if ((r -= v) <= 0) return k;
  return Object.keys(w)[0];
};
const rand = (a, b) => a + Math.random() * (b - a);
const uuid = () => crypto.randomUUID();

const SOURCES  = { facebook: 45, 'word-of-mouth': 30, flyer: 15, direct: 10 };
const SUBJECTS = { 'Algebra I': 22, 'Elementary Math': 20, 'Algebra II': 18,
                   'Pre-Algebra': 14, 'Science': 14, 'Elementary Reading': 12 };
const DEVICES  = { Mobile: 68, Desktop: 32 };

/* Parents browse in the evening and on Sunday afternoon, not at 10am Tuesday. */
const DOW_W  = [22, 18, 13, 12, 11, 12, 12];                       // Sun..Sat
const HOUR_W = { 9:2, 10:3, 12:4, 13:6, 14:6, 15:5, 16:6, 17:8, 18:11, 19:16, 20:15, 21:9, 22:4 };

function whenever() {
  for (let tries = 0; tries < 60; tries++) {
    const d = new Date(Date.now() - Math.floor(rand(0, DAYS)) * 86400000);
    if (Math.random() * 22 > DOW_W[d.getDay()]) continue;
    d.setHours(+pick(HOUR_W), Math.floor(rand(0, 60)), Math.floor(rand(0, 60)), 0);
    return d;
  }
  return new Date();
}

const tutorsFor = (subject) => DATA.tutors.filter(t => t.subjects.includes(subject));
const supply    = (t) => t.availability.reduce((n, a) => n + a.times.length, 0);

const batch = [];
const tally = { visitors: 0, byStep: {}, source: {}, subject: {}, tutor: {}, device: {}, bookedSubject: {},
                hours: {}, dow: {}, turnedAway: {}, bookings: 0 };
const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };

function emit(v, event, props, ts) {
  bump(tally.byStep, event);
  batch.push({
    event,
    timestamp: ts.toISOString(),
    properties: {
      distinct_id: v.id, $session_id: v.session,
      $current_url: SITE + props.$pathname, $host: SITE.replace('https://', ''),
      $device_type: v.device, $os: v.device === 'Mobile' ? 'iOS' : 'Mac OS X',
      $browser: v.device === 'Mobile' ? 'Mobile Safari' : 'Chrome',
      referral_source: v.source, is_simulated: true,
      ...props
    }
  });
}

for (let i = 0; i < VISITORS; i++) {
  const v = { id: 'sim_' + uuid(), session: uuid(),
              source: pick(SOURCES), device: pick(DEVICES) };
  let t = whenever();
  const step = (s) => { t = new Date(t.getTime() + rand(20, 150) * 1000); return s; };

  tally.visitors++; bump(tally.source, v.source); bump(tally.device, v.device);

  emit(v, '$pageview', { $pathname: '/index.html' }, t);
  emit(v, 'referral_source', { $pathname: '/index.html', src: v.source, landing_page: '/index.html' }, t);

  if (Math.random() > 0.62) continue;                       // left from the home page
  const subject = pick(SUBJECTS);
  bump(tally.subject, subject);

  step(); emit(v, '$pageview', { $pathname: '/tutors.html' }, t);
  emit(v, 'tutor_list_viewed', { $pathname: '/tutors.html', filter_subject: subject,
        filter_grade: 'any', results_count: tutorsFor(subject).length, trigger: 'page_load' }, t);

  if (Math.random() > 0.661) continue;                      // browsed, didn't open anyone
  const cands = tutorsFor(subject);
  const tutor = cands[Math.floor(Math.random() * cands.length)];

  /* Scarce tutors turn parents away. Algebra II only has Marcus, with 2 slots a week. */
  const scarce = supply(tutor) <= 2 ? 0.55 : supply(tutor) <= 4 ? 0.18 : 0.04;
  if (Math.random() < scarce) {
    emit(v, 'no_slots_available', { $pathname: '/tutors.html', tutor: tutor.name,
          tutor_id: tutor.id, subjects: tutor.subjects.join(', ') }, t);
    bump(tally.turnedAway, subject);
    continue;
  }

  step(); emit(v, 'tutor_profile_opened', { $pathname: '/tutors.html', tutor: tutor.name,
        tutor_id: tutor.id, subjects: tutor.subjects.join(', '), rate: tutor.rate, has_slots: true }, t);

  if (Math.random() > 0.634) continue;
  const slotRule = tutor.availability[Math.floor(Math.random() * tutor.availability.length)];
  const hour     = parseInt(slotRule.times[Math.floor(Math.random() * slotRule.times.length)], 10);
  const ahead    = Math.floor(rand(1, 15));

  step(); emit(v, '$pageview', { $pathname: '/book.html' }, t);
  emit(v, 'slot_selected', { $pathname: '/book.html', tutor: tutor.name, tutor_id: tutor.id,
        day_of_week: slotRule.day, hour, days_ahead: ahead }, t);

  if (Math.random() > 0.808) continue;                      // opened the form, wandered off
  step(); emit(v, 'booking_form_started', { $pathname: '/book.html', tutor: tutor.name, has_slot: true }, t);

  if (Math.random() > 0.762) continue;                      // abandoned mid-form
  const grade = Math.max(tutor.gradeLow, Math.min(tutor.gradeHigh,
                 Math.round(rand(tutor.gradeLow, tutor.gradeHigh))));

  step(); emit(v, 'booking_completed', { $pathname: '/book.html', tutor: tutor.name, tutor_id: tutor.id,
        subject, grade_num: grade, mode: tutor.mode, rate: tutor.rate,
        day_of_week: slotRule.day, hour, days_ahead: ahead }, t);
  emit(v, '$pageview', { $pathname: '/confirmed.html' }, t);

  tally.bookings++; bump(tally.tutor, tutor.name); bump(tally.hours, hour); bump(tally.dow, slotRule.day); bump(tally.bookedSubject, subject);
}

/* ---------- report ---------- */
batch.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
const pct = (n) => (100 * n / tally.visitors).toFixed(0) + '%';
const line = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])
                     .map(([k, n]) => `${k}: ${n}`).join('   ');

console.log(`\n  ${batch.length} events for ${tally.visitors} visitors over ${DAYS} days\n`);
console.log('  FUNNEL');
console.log(`    visited home        ${tally.visitors}  (100%)`);
console.log(`    viewed tutors       ${tally.byStep.tutor_list_viewed || 0}  (${pct(tally.byStep.tutor_list_viewed || 0)})`);
console.log(`    opened a tutor      ${tally.byStep.tutor_profile_opened || 0}  (${pct(tally.byStep.tutor_profile_opened || 0)})`);
console.log(`    picked a time       ${tally.byStep.slot_selected || 0}  (${pct(tally.byStep.slot_selected || 0)})`);
console.log(`    started the form    ${tally.byStep.booking_form_started || 0}  (${pct(tally.byStep.booking_form_started || 0)})`);
console.log(`    BOOKED              ${tally.bookings}  (${pct(tally.bookings)})\n`);
console.log('  SOURCE       ', line(tally.source));
console.log('  DEVICE       ', line(tally.device));
console.log('  SUBJECT WANT ', line(tally.subject));
console.log('  BOOKED BY    ', line(tally.tutor));
console.log('  TURNED AWAY  ', line(tally.turnedAway), `(total ${tally.byStep.no_slots_available || 0})`);
console.log('  POPULAR HOURS', line(tally.hours));
console.log('  DEMAND vs BOOKED (by subject)');
for (const [s, want] of Object.entries(tally.subject).sort((a, b) => b[1] - a[1])) {
  const got = tally.bookedSubject[s] || 0, away = tally.turnedAway[s] || 0;
  console.log('    ' + s.padEnd(20) + String(want).padStart(3) + ' looked ' + String(got).padStart(4) +
              ' booked ' + String(Math.round(100 * got / want)).padStart(4) + '%  ' +
              (away ? '(' + away + ' turned away)' : ''));
}
console.log('');

writeFileSync(new URL('../presentation/metrics.json', import.meta.url),
  JSON.stringify({ generated: new Date().toISOString(), days: DAYS, ...tally }, null, 2));
console.log('  wrote presentation/metrics.json (numbers for the slides)\n');

if (DRY) { console.log('  --dry: nothing sent to PostHog.\n'); process.exit(0); }

/* ---------- send ---------- */
let sent = 0;
for (let i = 0; i < batch.length; i += 100) {
  const chunk = batch.slice(i, i + 100);
  const res = await fetch(`${HOST}/batch/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: KEY, batch: chunk })
  });
  if (!res.ok) { console.error(`  batch failed: ${res.status} ${await res.text()}`); process.exit(1); }
  sent += chunk.length;
  process.stdout.write(`\r  sent ${sent}/${batch.length}`);
}
console.log(`\n  done — events appear in PostHog within a minute or two.\n`);
