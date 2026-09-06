# ABC Tutoring — website

## 1. What this is

This is a 4-page prototype website for **ABC Tutoring**, a small local tutoring service: a home page, an "Our Tutors" page, a booking page, and a confirmation page. It's a static site — plain HTML, CSS, and JavaScript, no server and no database — hosted for free on GitHub Pages at **https://ct-upskilling-2026.github.io**.

Because there's no backend, bookings aren't saved to a shared calendar anywhere. When a visitor books a session, it's recorded in their own browser's `localStorage`. See [How booking works](#3-how-booking-works) below for what that means in practice.

## 2. Dana: how to change your tutors

**The only file you ever need to edit is `data/tutors.js`.** You don't need to touch anything else — not the HTML pages, not the styling, nothing. Edit that one file, save it, refresh the website, and your changes are live.

Open `data/tutors.js` in any text editor (even Notepad or TextEdit works, though a code editor like VS Code makes the brackets easier to follow). You'll see a list of tutor blocks that look like this:

```js
{
  "id": "maya-r",              // a short unique code for this tutor — no spaces, lowercase
  "name": "Maya R.",           // shown on the site
  "initials": "MR",            // shown in the little colored circle avatar
  "color": "#2F6F62",          // the avatar's background color (any hex color code)
  "blurb": "Patient with younger students and great at rebuilding confidence after a rough report card.",
  "subjects": [                // must match names from the "subjects" list at the top of the file
    "Elementary Math",
    "Pre-Algebra"
  ],
  "gradeLow": 2,                // youngest grade this tutor works with
  "gradeHigh": 7,                // oldest grade this tutor works with
  "rate": 45,                    // dollars per hour
  "mode": "Both",                 // "In-person", "Online", or "Both"
  "availability": [
    { "day": "Tue", "times": ["16:00", "17:00"] },
    { "day": "Thu", "times": ["16:00", "17:00"] },
    { "day": "Sat", "times": ["09:00", "10:00"] }
  ]
}
```

A few things worth knowing:

- **`availability` is just a normal weekly schedule** — which day of the week, and which times on that day (in 24-hour format, so `"14:00"` means 2pm and `"09:00"` means 9am). You do **not** need to list out specific dates. The website automatically turns this weekly schedule into real, dated openings for the next 21 days on its own, so it never goes stale — you set it once and it just keeps working.
- **`gradeLow` of `0` means Kindergarten.** So a tutor with `"gradeLow": 0, "gradeHigh": 5"` works with students from Kindergarten through 5th grade.
- **To remove a tutor**, delete their entire `{ ... }` block, including the comma that follows it (or precedes it, if it's the last one in the list).
- **To add a tutor**, copy an existing tutor's whole block (from the opening `{` to the closing `}`), paste it either right before or right after another block, and change the details. Make sure every tutor has a unique `id`.
- If you want to offer a subject that isn't already in the list, add it to the `"subjects"` array at the very top of the file first, then use it in a tutor's `subjects` list.
- Small typos matter here — keep the quote marks, commas, and curly braces `{ }` in place when you copy/edit. If the page looks broken after you save, the most common cause is a missing comma between two tutor blocks.

## 3. How booking works

When a visitor picks an open time slot and submits the booking form, that slot is marked as taken and disappears from availability **immediately** — for that visitor.

The catch: because this prototype has no backend or shared database, "taken" only means taken *in that person's own browser*. Two different families browsing on two different phones could both see — and both book — the same time slot, because neither browser knows what the other one did. This is fine for a demo and for testing the flow, but it is **not** safe for a real launch with real double-bookings on the line. A real launch would need a small shared backend (even a simple one) so that once a slot is booked, it disappears for everyone, everywhere — not just in the browser that booked it.

## 4. Analytics

The site sends usage events to [PostHog](https://posthog.com) so you can see how visitors actually move through the site — where they came from, which tutors they look at, where they give up, and when bookings happen. PostHog also automatically records a `$pageview` event every time someone loads a page, with no extra work needed.

The PostHog key lives in `assets/js/analytics.js`, on the line that starts with `window.ABC_POSTHOG_KEY = 'phc_...'`. If you ever need to point the site at a different PostHog project, that's the only place to change.

Here are the custom events the site sends and the business question each one answers:

| Event | Fires when... | Answers |
|---|---|---|
| `referral_source` | Once per visit, on the first page a visitor loads | Where are parents finding us — Facebook, a flyer, word of mouth, or direct? (`src`, `landing_page`) |
| `tutor_list_viewed` | The tutors page loads or a filter is changed | What are parents searching for? (`filter_subject`, `filter_grade`, `results_count`, `trigger`) |
| `tutor_profile_opened` | A visitor clicks into a specific tutor's "book" / "waitlist" button | Which tutors get attention, and do they have open slots? (`tutor`, `tutor_id`, `subjects`, `rate`, `has_slots`) |
| `no_slots_available` | A tutor shows as fully booked (on the tutors list or booking page) | Which tutors need more availability or should be hired for? (`tutor`, `tutor_id`, `subjects`) |
| `slot_selected` | A visitor clicks an open time slot on the booking page | Which days/times are actually in demand? (`tutor`, `tutor_id`, `day_of_week`, `hour`, `days_ahead`) |
| `booking_form_started` | A visitor's cursor first enters the booking form | How many people get as far as starting to fill in their details? (`tutor`, `has_slot`) |
| `booking_validation_failed` | The booking form is submitted with a missing/invalid field | Where does the form trip people up? (`reason`) |
| `booking_completed` | A booking is successfully submitted | The actual conversions — who booked, for what, and when? (`tutor`, `tutor_id`, `subject`, `grade`, `grade_num`, `mode`, `rate`, `day_of_week`, `hour`, `days_ahead`) |
| `confirmation_viewed` | The confirmation page loads after a successful booking | Confirms the booking flow completed end to end (`tutor`, `subject`) |
| `$pageview` | Every page load (automatic, built into PostHog) | Overall traffic and which pages get visited |

Every event — including the automatic `$pageview` — also carries `referral_source` and `is_simulated` automatically, so you can break any chart down by where the visitor came from. See below.

## 5. Simulated traffic

Since the site is brand new, there's no real traffic yet to build a dashboard against. `tools/simulate.mjs` generates realistic *fake* traffic and sends it to PostHog, backdated over the last two weeks, so the dashboard has something meaningful to show right away.

```bash
POSTHOG_KEY=phc_xxx node tools/simulate.mjs
```

Add `--dry` to preview the summary in your terminal without sending anything to PostHog:

```bash
POSTHOG_KEY=phc_xxx node tools/simulate.mjs --dry
```

It simulates roughly **340 visitors** and **~1,500 events** spread across the past 14 days, following a realistic funnel (browsing peaks in the evening and on Sunday afternoons, some tutors are more in-demand than others, some visitors abandon at each step, etc.).

**Important:** every single simulated event carries `"is_simulated": true`. Once real visitors start using the site, filter dashboards and insights to `is_simulated = false` (or `is not set`) so the fake demo traffic doesn't get mixed in with real numbers. Don't delete or ignore this property — it's the only thing separating demo data from reality.

## 6. Building the PostHog dashboard

These steps assume you've never used PostHog before. Do these after you've sent simulated traffic (Section 5) so there's data to build against.

1. Log into PostHog and open your project. In the left sidebar, click **Dashboards**, then **New dashboard**. Give it a name like "ABC Tutoring" and click **Create**.

**Tile 1 — the booking funnel**

2. In the left sidebar, click **Insights**, then **New insight**.
3. Choose the **Funnel** insight type (usually a tab/button along the top of the insight editor).
4. Add these five steps, in order, using the "Add step" button each time:
   - `$pageview`
   - `tutor_list_viewed`
   - `tutor_profile_opened`
   - `slot_selected`
   - `booking_completed`
5. Name the insight something like "Booking funnel," then click **Save**, and on the save dialog choose **Add to dashboard** and pick the dashboard you created in step 1.

**Tile 2 — bookings by tutor**

6. **New insight** again, this time choose the **Trends** type.
7. Set the event to `booking_completed`.
8. Click **Add breakdown** (sometimes labeled "+ Breakdown"), and choose the property `tutor`.
9. Save it as "Bookings by tutor" and add it to the dashboard.

**Tile 3 — demand vs. fulfilled, by subject**

10. **New insight** → **Trends**. Set the event to `tutor_list_viewed`, then add a breakdown on `filter_subject`. Save as "Subject demand" and add to the dashboard.
11. Make a second Trends insight: event `booking_completed`, breakdown on `subject`. Save as "Subject bookings" and add to the dashboard. (Comparing these two tiles side by side shows which subjects have demand that isn't being met.)

**Tile 4 — where parents come from**

12. **New insight** → **Trends**. Set the event to `referral_source`, breakdown on `src`. Save as "Referral source" and add to the dashboard.

**Tile 5 — turned-away demand**

13. **New insight** → **Trends**. Set the event to `no_slots_available`, breakdown on `subjects`. Save as "Turned away (no slots)" and add to the dashboard.

**Tile 6 — when people book**

14. **New insight** → **Trends**. Set the event to `booking_completed`, breakdown on `hour`. Save as "Bookings by hour" and add to the dashboard.
15. Make a second one the same way, breakdown on `day_of_week` instead. Save as "Bookings by day of week" and add to the dashboard.

**Tile 7 — device mix**

16. **New insight** → **Trends**. Set the event to `$pageview`, breakdown on `$device_type`. Save as "Visitors by device" and add to the dashboard.

**Sharing the dashboard**

17. Open the dashboard you built (click its name in the left sidebar under **Dashboards** if you've navigated away).
18. Click **Share** near the top right.
19. Turn on **public access** (sometimes labeled "Share dashboard publicly"). PostHog will give you a link.
20. Copy that link — anyone with it can view the dashboard without a PostHog login. This is the link to hand to Dana or anyone else who just needs to look at the numbers.

## 7. Running it locally

From the repo root:

```bash
python3 -m http.server 8899
```

Then open **http://localhost:8899** in a browser. All four pages (`index.html`, `tutors.html`, `book.html`, `confirmed.html`) work from there. If PostHog isn't configured or blocked, events just print to the browser console instead of failing silently.

`tools/test.html` is a small self-checking test page for the site's booking/availability logic — no build step or test runner needed. Open it directly in a browser (either `file://` or through the local server above) and it will print `PASS` or `FAIL` for 12 assertions covering things like: availability correctly projecting into real dates, grade labels (`K`, `1st`, `2nd`, `3rd`, `11th`, `12th`), time formatting (`9am`, `4pm`, `12pm`), and a booked slot correctly disappearing from that tutor's availability without affecting other tutors.

## 8. File map

| File | Purpose |
|---|---|
| `index.html` | Home page |
| `tutors.html` | "Our Tutors" browse/filter page |
| `book.html` | Booking page (pick a tutor, pick a slot, fill in details) |
| `confirmed.html` | Post-booking confirmation page |
| `data/tutors.js` | **The tutor roster and subject list — the only file Dana edits** |
| `assets/css/style.css` | All site styling |
| `assets/js/app.js` | Shared site logic: turning weekly availability into dated slots, grade/time label formatting, storing bookings in `localStorage`, nav bar/footer markup |
| `assets/js/analytics.js` | PostHog setup, the `abcTrack()` event helper, and referral-source detection |
| `tools/simulate.mjs` | Generates and sends simulated visitor traffic to PostHog for dashboard testing (see Section 5) |
| `tools/test.html` | Self-checking browser test page for the booking/availability logic (see Section 7) |
| `presentation/` | Screenshots and a generated `metrics.json` summary, used for presenting the prototype |
