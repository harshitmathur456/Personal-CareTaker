# Going Home Right: Product Requirements Document

Team Redemption · aayu 2026 (DevAarambh) · Problem Statement T03 · Version 0.1 (draft)

## 1. Overview

Going Home Right turns a hospital discharge summary (PDF or photo) into a simple daily care plan that a patient's whole family can follow: a morning / afternoon / night medicine schedule, reminders at dose time, the next check-up date, and a "call the doctor if..." card. Anything the system cannot read or interpret with certainty is flagged for a nurse. It never guesses and never diagnoses.

**The problem (from the problem statement).** Kamla Devi, 68, is discharged after a heart admission. A nurse explains the sheet quickly to her son at the billing counter: "Tab Ecosprin 75 OD, Tab Metoprolol 25 BD, review after 7 days, SOS if breathlessness." At home, her daughter-in-law, who was never at the hospital, gives the medicines. By day three one tablet is doubled, another is missed, and nobody notices the follow-up date pass.

**Why now / why us.** Discharge instructions are explained once, verbally, to the wrong person, in shorthand. We close the gap between what the hospital said and what the family actually does at home.

## 2. Goals and non-goals

### Goals

- G1. Convert a discharge summary into a correct, plain-language daily schedule in one upload.
- G2. Make sure every dose and the follow-up visit are reminded at the right time.
- G3. Keep discharge documents in one place so the doctor can view them at the next visit.
- G4. Let a family manage routine recovery at home without a paid personal caretaker.
- G5. Be safe by design: rules decide anything safety-critical, and ambiguity goes to a human.

### Non-goals (v1)

- Diagnosing conditions, suggesting new medicines, or changing any prescribed dose.
- Replacing the nurse, doctor or pharmacist.
- Integration with hospital information systems (HIS/EMR). v1 works from the document alone.
- Emergency response. The app tells the family when to call the doctor; it does not dispatch help.

## 3. Users and personas

| Persona | Who they are | What they need |
| --- | --- | --- |
| Patient | Elderly or recovering person, often with several medicines | Know what to take, when, and why |
| Family caregiver | The person actually giving the medicines at home (e.g. a daughter-in-law who was not at the hospital) | One clear plan, reminders, a "when to worry" card |
| Nurse | Discharge-desk or ward nurse | A quick queue to confirm or correct flagged items before the plan goes live |
| Doctor | Treating doctor at the next visit | See past discharge documents and the medicine timeline in seconds |

## 4. Scope and prioritisation

All eight features are part of the hackathon demo. Priority shows what must work flawlessly versus what can be a lighter version.

| # | Feature | Priority | Demo depth |
| --- | --- | --- | --- |
| F1 | Discharge scanner (PDF / photo extraction) | P0 | Fully working |
| F2 | Medicine calendar (morning / afternoon / night) | P0 | Fully working |
| F3 | Dose reminders at medicine time | P0 | Fully working |
| F4 | Next check-up date and reminder | P0 | Fully working |
| F5 | Nurse sign-off queue for ambiguous items | P0 | Fully working |
| F6 | Reports keeper (discharge images, doctor view) | P1 | Working, simple |
| F7 | "Call the doctor if..." card and caregiver-friendly plan (reduces need for a paid caretaker) | P1 | Working |
| F8 | Food check: meals logged vs the doctor's diet advice | P1 | Working, rule-based |
| F9 | Physiotherapy arrangement for injury recovery | P2 | Request flow with mock providers |

## 5. Functional requirements

### F1. Discharge scanner

- FR-1.1 The user can upload a PDF, or take or upload one or more photos, of a discharge summary.
- FR-1.2 Text PDFs are parsed directly. Scanned PDFs and photos go through image cleanup (rotate, deskew, contrast) and OCR.
- FR-1.3 The system extracts: medicines (name, strength, form), frequency, timing notes, duration, follow-up date or interval, warning signs, diet instructions, physiotherapy advice, allergies.
- FR-1.4 Every extracted field stores a link to its source line and a confidence score.
- FR-1.5 Fields below the confidence threshold, or that fail validation, are marked "needs review" and are never shown to the family as final.
- Acceptance: for a clean sample sheet, all listed medicines appear in the draft plan with correct frequency; for a deliberately blurred or ambiguous line, the item lands in the nurse queue instead of the plan.

### F2. Medicine calendar

- FR-2.1 The approved plan is rendered as a daily view with Morning, Afternoon and Night slots, plus a week view.
- FR-2.2 Shorthand is decoded by a rules engine (section 7), never by the LLM.
- FR-2.3 Each dose can be marked taken or skipped, with a timestamp.
- Acceptance: "Tab Metoprolol 25 BD" appears as two doses a day (default Morning and Night) and the family can tick each one.

### F3. Dose reminders

- FR-3.1 A reminder fires at each slot time. Default slot times are editable per patient.
- FR-3.2 If a dose is not confirmed within a grace window, send one follow-up reminder to the caregiver.
- FR-3.3 Delivery via web push; optional SMS or WhatsApp fallback is a later add-on.
- FR-3.4 Reminders include the medicine name and strength so the right tablet is picked.
- Acceptance: with a test dose scheduled for two minutes ahead, the push notification arrives and tapping it opens the confirm screen.

### F4. Next check-up

- FR-4.1 The follow-up date ("review after 7 days") is converted to a calendar date from the discharge date, shown to the nurse for confirmation if the discharge date is missing.
- FR-4.2 Reminders go out ahead of the date and on the day.
- FR-4.3 The follow-up appears on the family dashboard and on the doctor's view.

### F5. Nurse sign-off queue

- FR-5.1 A nurse role sees every item flagged as unclear, with the source line, the system's reading and edit controls.
- FR-5.2 Examples that must be flagged: a medicine with no readable dose, "SOS" with no medicine named, "OD" where eye-side versus once-daily is possible, conflicting instructions, unknown abbreviations.
- FR-5.3 A plan only goes live to the family after all flagged items are approved or removed. The approver and time are recorded.
- Acceptance: the sample line "SOS if breathlessness" is flagged because it names no medicine.

### F6. Reports keeper

- FR-6.1 Original discharge images and PDFs are stored securely against the patient.
- FR-6.2 The patient or caregiver can share a read-only, time-limited link or QR code with a doctor.
- FR-6.3 The doctor view shows the original document beside the extracted medicine timeline.

### F7. Care card and caregiver mode

- FR-7.1 A "Call the doctor if..." card lists the warning signs written in the summary, in plain language, with a one-tap call button for the saved doctor or hospital number.
- FR-7.2 Only warning signs found in the document are shown. The app does not add its own.
- FR-7.3 Multiple family members can be invited to the same patient plan so care does not depend on who was at the hospital.

### F8. Food check

- FR-8.1 Diet advice from the summary (for example "low salt", "no sugar") is stored as rules.
- FR-8.2 The user logs meals (quick picker or free text). Items matching a restricted category are shown as "not in the doctor's advice" with the source line.
- FR-8.3 The app reports against the doctor's instructions only. It does not recommend diets.

### F9. Physiotherapy arrangement

- FR-9.1 If the summary mentions physiotherapy or the patient has a physical injury, show a "Arrange physiotherapy" action.
- FR-9.2 The user picks home visit or clinic, preferred time, and sends a request to a listed provider. For the demo, providers are a mocked directory.
- FR-9.3 Sessions appear on the same calendar as medicines.

## 6. User flow

1. Hospital or family uploads the discharge summary.
2. System reads it and builds a draft plan.
3. Clear items go straight into the draft. Unclear items go to the nurse queue.
4. Nurse approves or edits, and the plan goes live.
5. The family sees the daily schedule and receives reminders.
6. Doses are ticked, the follow-up is reminded, and documents are kept for the next visit.

## 7. Safety and rules

The system is split into three responsibilities.

| Who | Does what |
| --- | --- |
| AI (OCR + LLM) | Reads the page, extracts fields into a strict schema, writes plain-language wording |
| Rules engine | Decodes shorthand, builds the schedule, calculates dates, validates every field |
| Human (nurse) | Confirms anything flagged, and the plan cannot go live without it |

### Shorthand dictionary (initial)

| Code | Meaning | Default slots (editable) |
| --- | --- | --- |
| OD | Once a day | Morning |
| BD / BID | Twice a day | Morning, Night |
| TDS / TID | Three times a day | Morning, Afternoon, Night |
| QID | Four times a day | Fixed four-slot pattern |
| HS | At bedtime | Night |
| SOS / PRN | Only if needed | Not scheduled; shown as an as-needed item |
| AC / PC | Before / after meals | Adds a meal note to the slot |

Notes: default slots are conventions, so the nurse can change them. Unknown codes are flagged, never inferred.

### Hard guardrails

- Never diagnose, never suggest a new medicine, never change a dose.
- Never show an unapproved item to the family as final.
- Never fill in a missing dose or frequency.
- LLM output must validate against a schema (zod) or the item is rejected and flagged.
- Every plan field is traceable to a source line and an audit record.
- Footer on plan screens: "Confirm with your doctor or nurse."

## 8. Tech stack (Node.js + Next.js)

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS | One codebase for UI and API routes, fast to demo |
| PWA | Web app manifest + service worker + Web Push (web-push library, VAPID keys) | Installs on any phone, delivers reminders without an app store |
| API | Next.js Route Handlers (REST/JSON) for requests; zod for validation | Keeps the stack simple for a hackathon |
| Background worker | Separate Node.js process using BullMQ with Redis | OCR, LLM extraction and reminder scheduling must not block web requests |
| Database | PostgreSQL (Supabase) with Prisma ORM | Relational data fits plans, doses and audit logs |
| Auth | Supabase Auth (phone OTP or email) with roles: patient, caregiver, nurse, doctor | Role-based access is core to the nurse and doctor flows |
| File storage | Supabase Storage (private buckets, signed URLs) | Discharge images and PDFs |
| Image prep | sharp | Rotate, resize, contrast before OCR |
| PDF text | pdfjs-dist or pdf-parse; scanned PDFs rasterised to images | Handles both text and scanned PDFs |
| OCR | Cloud OCR API (e.g. Google Cloud Vision) with Tesseract.js as offline fallback | Cloud OCR copes better with crumpled photos |
| LLM | An LLM API with JSON-schema output (e.g. Anthropic Claude API) | Structured extraction and plain-language wording only |
| Testing | Vitest for the rules engine, Playwright for end-to-end | The rules engine is the safety core, so it gets the most tests |
| Hosting | Vercel for Next.js; Railway or Render for the worker; Upstash Redis | Quick deploy for a live demo |

## 9. Architecture

**Request path.** Browser (PWA) → Next.js route handlers → Postgres and Storage. Uploading a document creates a job in the queue and returns immediately.

**Processing path.** Worker picks up the job → preprocess with sharp → text via pdf parser or OCR → LLM extracts fields into a zod-validated JSON schema → rules engine decodes and validates → draft plan saved with confidence and source links → flagged items create nurse tasks.

**Reminder path.** When a plan is approved, the worker schedules delayed BullMQ jobs for each dose and follow-up. Each job sends a web push and logs delivery.

**Doctor path.** The caregiver generates a signed, expiring share link; the doctor opens a read-only view of the documents and timeline.

## 10. Data model (core tables)

| Table | Key fields |
| --- | --- |
| users | id, role, name, phone/email |
| patients | id, name, age, discharge\_date, owner\_id |
| patient\_members | patient\_id, user\_id, relation, role |
| documents | id, patient\_id, storage\_path, type, uploaded\_at |
| extractions | id, document\_id, raw\_text, status |
| plan\_items | id, patient\_id, kind (medicine, follow\_up, warning, diet, physio), data (json), source\_text, source\_ref, confidence, status (draft, flagged, approved) |
| doses | id, plan\_item\_id, scheduled\_at, slot, status (pending, taken, skipped), confirmed\_at |
| nurse\_reviews | id, plan\_item\_id, reviewer\_id, action, note, reviewed\_at |
| reminders | id, dose\_or\_followup\_id, send\_at, channel, status |
| meal\_logs | id, patient\_id, logged\_at, text, matched\_rule\_id |
| physio\_requests | id, patient\_id, provider\_id, mode, requested\_for, status |
| audit\_log | id, actor\_id, action, entity, at |

## 11. API outline

| Endpoint | Purpose |
| --- | --- |
| POST /api/patients | Create a patient profile |
| POST /api/documents | Upload a discharge file and enqueue extraction |
| GET /api/documents/:id/status | Poll extraction progress |
| GET /api/patients/:id/plan | Fetch the current plan |
| GET /api/review/queue | Nurse: list flagged items |
| POST /api/review/:itemId | Nurse: approve, edit or remove an item |
| POST /api/doses/:id/confirm | Mark a dose taken or skipped |
| POST /api/push/subscribe | Save a push subscription |
| POST /api/share | Create an expiring doctor link |
| POST /api/meals | Log a meal and check it against diet rules |
| POST /api/physio/requests | Request a physiotherapy session |

## 12. Non-functional requirements

- **Privacy and consent.** Health data is sensitive personal data. Collect explicit consent, store only what is needed, and align with India's Digital Personal Data Protection Act, 2023. Get legal review before any real-world pilot.
- **Security.** Encryption in transit and at rest, private storage buckets with signed URLs, role-based access, row-level security in Postgres, audit logging.
- **Demo data.** The hackathon demo uses synthetic discharge sheets only, no real patient information.
- **Reliability.** Extraction runs asynchronously, with retries and a clear "processing" state. A failed extraction never produces a silent partial plan.
- **Performance (targets, to be measured).** A plan draft should appear soon after upload, ideally within about 30 seconds for a typical one-page summary.
- **Accessibility.** Large text, high contrast, and simple language for elderly users. Hindi and other regional languages are a planned extension.
- **Offline tolerance.** The service worker caches today's schedule so it still opens with poor connectivity.

## 13. Success metrics (proposed)

| Metric | Why it matters |
| --- | --- |
| Share of doses confirmed on time | Direct measure of adherence |
| Share of extracted fields correct on a test set of sample sheets | Extraction quality |
| Share of ambiguous test lines correctly flagged rather than guessed | Safety (target: all of them) |
| Follow-up visits kept versus reminded | Continuity of care |
| Time for a doctor to find a past document | Value of the reports keeper |

Baselines are not yet measured. We should collect them from the demo and any pilot rather than assume them.

## 14. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Poor photo quality or handwriting | Image cleanup, confidence scores, re-scan prompt, nurse queue |
| LLM misreads or invents a field | Schema validation, source-line linking, rules engine verifies, human approval before going live |
| Wrong shorthand interpretation | Dictionary owned by rules, flag unknown or ambiguous codes |
| Over-reliance on the app for medical decisions | No diagnosis, "call the doctor if" card only from the document, standing disclaimer |
| Privacy breach | Minimal data, access control, expiring share links, audit trail |
| Missed reminders (browser limits on push) | Grace-window follow-up, optional SMS or WhatsApp later, in-app today view |
| Hospital adoption | Works from the document alone via QR or upload, no integration needed to start |

## 15. Build plan

| Phase | Focus | Output |
| --- | --- | --- |
| 1. Foundation | Next.js app, auth with roles, database schema, storage, queue and worker skeleton | Login, upload, empty plan view |
| 2. Core pipeline | Preprocessing, OCR, LLM extraction with schema, rules engine and its tests | Upload to draft plan with flags |
| 3. Care experience | Calendar, reminders and push, follow-up tracker, nurse queue, care card | Full family and nurse flow |
| 4. Extras | Reports keeper and doctor share, food check, physiotherapy request | All eight features demoable |
| 5. Demo polish | Synthetic sample sheets (clean, blurry, ambiguous), demo script, error states | Rehearsed live demo |

Suggested demo story: upload Kamla Devi's discharge sheet, show the decoded plan, show "SOS if breathlessness" flagged for the nurse, approve it, receive a live reminder, then open the doctor's view.

## 16. Open questions

- Which languages must the first version support (English only, or Hindi too)?
- Which OCR provider will we use for the demo, and what is our budget for API calls?
- Who plays the nurse in the live demo, and should the nurse flow be a separate screen or a role switch?
- Where does the physiotherapy provider list come from for the demo (mock data or a real directory)?
- Do we show hospital branding on the plan, and who owns the data in a pilot (patient or hospital)?
- Team ID for the submission, still to be filled from the portal.
