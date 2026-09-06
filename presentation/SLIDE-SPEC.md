# ABC Tutoring — Website Walkthrough Deck: Build Spec

This is a **specification** for an AI agent to generate a 5-slide PowerPoint (.pptx) deck, 16:9 widescreen, which will then be exported to PDF by the presenter (File > Export > PDF). This document contains no HTML and is not the deck itself — it describes exactly what the deck must contain.

**Audience:** Dana, owner of ABC Tutoring, a small local tutoring business. She is non-technical and will likely read this deck alone, without anyone in the room to explain it. Every slide must be self-explanatory in plain English. Do not use the words "funnel," "event," "telemetry," "localStorage," or "PostHog SDK" (or similar engineering jargon) anywhere in on-slide copy or headlines.

---

## Design tokens

Match the deck's visual style to the live website. Apply these consistently across all 5 slides.

**Color palette**
| Token | Hex | Use |
|---|---|---|
| Background (cream) | `#FDFBF7` | Slide background, all slides |
| Surface (white) | `#FFFFFF` | Cards, image mattes, panels |
| Primary (deep teal) | `#2F6F62` | Slide titles, headline accents, primary shapes |
| Primary dark (darker teal) | `#245449` | Emphasis text, chart primary series, step numbers |
| Accent (amber) | `#F2A65A` | Highlights, call-outs, second chart series, numbered badges |
| Body text (charcoal) | `#2B2B2B` | All body copy |
| Muted text | `#5F5B54` | Captions, presenter asides shown small on-slide, secondary labels |
| Border | `#EAE3D8` | Card outlines, dividers, table gridlines |

**Type**
- Font family: Nunito (preferred). Fallback stack: Avenir Next, Segoe UI, sans-serif. Use the same rounded, friendly sans-serif everywhere — no serif, no monospace.
- Slide title: 32–36 pt, bold, deep teal (`#2F6F62`).
- Headline / subhead (on-slide big statement): 22–26 pt, semi-bold, charcoal (`#2B2B2B`).
- Body text / bullets: 16–18 pt, regular, charcoal (`#2B2B2B`).
- Captions / labels / chart axis text: 12–14 pt, regular, muted (`#5F5B54`).

**Layout rules**
- Generous whitespace: minimum 0.5" slide margins, minimum 0.3" padding inside any card or box.
- Rounded corners on every card, image frame, and callout box (corner radius ~0.12"–0.15", i.e. a soft rounded rectangle, not sharp corners and not a full pill).
- Warm and friendly throughout — never dark-mode, never a black or navy background, never a dense corporate table-and-bullet look.
- Keep on-slide text sparse. If a sentence can be cut to a phrase, cut it.

---

## Slide 1 — "What I heard from you"

**Purpose:** Reflect Dana's own stated needs back to her, in her own words, so she can immediately confirm "yes, this person listened to me."

**Slide title:** What I heard from you

**On-slide copy** (as a checklist-style list of 6 short lines, each with a rounded checkmark badge in teal):
- Right now everything runs through your phone and a Google Sheet
- You want a simple site: a home page, a page to meet the tutors, and a way to book
- Each tutor's page should show their photo, subjects, grade levels, rate, and real availability
- Booking should just ask for the parent's name and email, and the student's name, grade, and subject
- The calendar has to show each tutor's actual free times — not a generic 9-to-5
- It needs to feel clean and friendly on a phone — not dark, not corporate, not like a big test-prep chain

**Layout:** Full-width single column. Slide title top-left. Below it, the 6 lines stacked vertically as a checklist, each on its own row with a small circular teal checkmark icon to the left and the line of text to the right, generous line spacing (about 0.35" between rows). No image on this slide — let the whitespace and the checklist carry it.

**Presenter note:** This slide is a listening check, not a status report — pause here and let Dana confirm each line matches what she asked for before moving on.

---

## Slide 2 — "Your website"

**Purpose:** Show Dana her actual site, on a phone, since two-thirds of her parents will view it that way.

**Slide title:** Your website

**On-slide copy:** One short caption beneath each screenshot (see layout below). No additional headline or paragraph text.

- Caption under image 1: "Home — a warm welcome and a clear next step"
- Caption under image 2: "Meet the tutors — photo, subjects, rate, and open times"
- Caption under image 3: "Book a session — one short form, done in about a minute"

**Images:**
- `presentation/img/index.png` (phone-width home page)
- `presentation/img/tutors.png` (phone-width tutor listing)
- `presentation/img/book.png` (phone-width booking form)

**Layout:** Slide title top-left, small. Below it, three equal-width columns spanning the slide, each column holding one phone screenshot centered in a white rounded-rectangle frame (subtle border in `#EAE3D8`) with its caption in muted text directly beneath the frame. Keep generous side margins so the three phone images don't feel cramped — images should appear tall and phone-shaped, not stretched.

**Presenter note:** These are live screenshots from the real site at https://ct-upskilling-2026.github.io, shown at phone width because that's how most parents will actually see it.

---

## Slide 3 — "How a parent books"

**Purpose:** Walk Dana through the booking experience as her customers see it, and land the "no more phone tag" payoff.

**Slide title:** How a parent books

**On-slide copy:** Four numbered steps, each a short line:
1. Pick a tutor — see their subjects, rate, and photo
2. Pick an open time slot — only real, available times are shown
3. Fill in one short form — parent and student details
4. Get an instant confirmation — and that slot closes automatically so nobody double-books it

Below the four steps, one bold standalone line:
**Start to finish: about a minute. No phone tag.**

**Images:** `presentation/img/book.png` and `presentation/img/confirmed.png`, shown small as supporting thumbnails (not full-size).

**Layout:** Left two-thirds of the slide: the four numbered steps stacked vertically, each with a large circular amber (`#F2A65A`) badge containing the step number, and the step text to the right of its badge. The bold "about a minute" line sits below step 4, full width of that column, set apart with extra top spacing. Right one-third of the slide: the two supporting screenshots (book.png above confirmed.png), each in a small white rounded frame, stacked vertically, roughly half the size of the phone images used on Slide 2.

**Presenter note:** Emphasize "the slot closes automatically" — that single behavior is what eliminates the double-booking risk she has today with the Google Sheet and her phone.

---

## Slide 4 — "What you can now see about your visitors"

**Purpose:** Present the new visibility into visitor behavior as a **recommendation**, not as something Dana asked for. She was asked twice what she wanted to track and both times answered with booking-form questions instead — so this must be framed honestly as "here's what I'd suggest you watch, and why," never as "here's what you requested."

**Slide title:** What you can now see about your visitors

**On-slide copy:**

Opening line (framing, sits directly under the title, smaller than a headline but larger than body text):
"A suggestion from me: here are the four things I'd watch, and what each one is worth to you."

Headline call-out (the lead insight, set apart in an amber-bordered callout box):
"44 parents came looking for Algebra II help. Only 4 of them could book. 10 hit a tutor with no openings left."
Sub-line inside the same callout, smaller: "One tutor covers Algebra II with just 2 hours a week — that's the clearest place to add help. Compare Elementary Reading, which books at 41% because that tutor has plenty of open hours."

Three supporting stat lines, placed near their respective charts:
- "Two-thirds of parents visit from a phone (233 of 340)"
- "Facebook brings the most visitors (158) — but your flyer still brought 58 people"
- "Every visitor who looked but couldn't book: 18 families hit a tutor with no open times left"

**Charts (specify chart type + exact data for each):**

1. **Chart A — Horizontal bar chart: "Looked vs. Booked, by subject"** (the lead chart — give it the most visual weight, placed top-left or spanning the top of the chart area)
   Two bars per subject (paired/grouped horizontal bars), subject labels down the left, "looked" in muted teal and "booked" in solid deep teal or amber:
   - Elementary Reading: looked 29, booked 12 (41%)
   - Pre-Algebra: looked 27, booked 10 (37%)
   - Algebra I: looked 45, booked 12 (27%) — annotate "3 turned away"
   - Elementary Math: looked 48, booked 10 (21%) — annotate "3 turned away"
   - Science: looked 24, booked 4 (17%) — annotate "1 turned away"
   - Algebra II: looked 44, booked 4 (9%) — annotate "10 turned away"
   Sort bars by booking rate (percent), highest at top (Elementary Reading, 41%) to lowest at bottom (Algebra II, 9%), so the Reading-vs-Algebra II contrast is visually obvious top-to-bottom. Visually call out the Algebra II bar (e.g. amber outline or "10 turned away" flag) since it carries the slide's lead insight.

2. **Chart B — Simple horizontal funnel/step bar chart: "From visit to booking"**
   One bar per stage, all same color (deep teal), decreasing width/length to show drop-off, with the count and percent labeled on each bar:
   - Visited home page: 340 (100%)
   - Viewed the tutor list: 217 (64%)
   - Opened a tutor profile: 138 (41%)
   - Picked a time: 81 (24%)
   - Started the booking form: 67 (20%)
   - Booked: 52 (15%)

3. **Chart C — Donut or simple bar chart: "How parents found you"**
   - Facebook: 158
   - Word of mouth: 81
   - Flyer: 58
   - Direct (typed the address in): 43
   Use four distinct colors from the palette family (teal shades + amber + a neutral) with a small legend.

4. **Chart D — Simple two-segment bar or donut: "Phone vs. computer"**
   - Phone: 233 (69%)
   - Computer: 107 (31%)
   Two segments only, teal for phone, amber for computer, with percent labels directly on the chart.

**Layout:** Slide title top-left. Framing line directly beneath title. The amber-bordered lead-insight callout box sits prominently near the top of the chart area (or as a banner across the top, above the four charts) so it cannot be missed. Below/around it, a 2x2 grid of the four charts filling the rest of the slide, each chart in its own card with a small title above it. Chart A (Looked vs. Booked) should be visually largest — either given the top full-width row with Charts B, C, D below in a row of three, or given a 2-column-wide cell in the grid — reflecting its priority as the lead insight.

**Presenter note (on this slide, note ONLY — do not put this on the slide itself):** These are simulated demo numbers from 2 weeks of test traffic (340 visitors), not real customers — the tool is proven and ready to read her real traffic once the site is live and promoted. Also reiterate verbally: this is a recommendation, not something she asked for — she was asked twice what she wanted to know about visitors and both times described booking-form fields instead, which is exactly why this whole slide is framed as "here's what I'd suggest," not "here's what you requested."

---

## Slide 5 — "What I need from you"

**Purpose:** Close with a clear, short action list — what Dana must supply, and what's deliberately deferred to phase 2.

**Slide title:** What I need from you

**On-slide copy**, in two clearly separated sections:

Section A heading: "To replace the sample tutors"
- Real names, photos, subjects, and grade levels for your 6 tutors
- Each tutor's hourly rate
- Each tutor's real weekly availability (not the placeholder times currently shown)
- One line, set apart in a muted note style: "All of this lives in a single file — once you send it over, it's a quick swap, no rebuilding the site."

Section B heading: "Coming in phase 2 (not built yet)"
- A simple screen where you can add or remove tutors yourself
- A shared calendar so bookings stay in sync across every device (not just the browser that made them)
- Automatic email confirmations to parents
- Invoicing

**Layout:** Slide title top-left. Two side-by-side cards below it, roughly equal width (left card = Section A, right card = Section B), each in a white rounded card with its own heading in deep teal, bulleted list in charcoal body text, and (for Section A) the muted note line at the bottom of that card in a slightly smaller, italic-style muted font. No images on this slide.

**Presenter note:** Be explicit and warm that sample tutors were used because real tutor details were never provided — this isn't a gap in the work, it's the one open input still needed from her. Frame phase 2 items as sequenced, not forgotten.

---

## How to build this

1. Generate the .pptx from this specification: create exactly 5 slides in the order above, 16:9 widescreen, applying the Design tokens section throughout (colors, font, spacing, rounded corners).
2. Use the exact on-slide copy given for each slide — do not paraphrase headlines or bullet text.
3. Place the specified images from `presentation/img/` (`index.png`, `tutors.png`, `book.png`, `confirmed.png`, `index-desktop.png` is available but not required by this plan) per each slide's layout description.
4. Build the four charts on Slide 4 with the exact data given, in the specified chart types.
5. Add each slide's presenter note as PowerPoint speaker notes (not on-slide text).
6. Once the .pptx is generated and reviewed, export it to PDF: File > Export > PDF (or Save As > PDF) from PowerPoint.
