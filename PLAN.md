# NeuroMot video plan

This file is the living plan for the daily #NeuroMot video. The daily task reads it **before** writing the script and building the video, and **updates it after** each day's analysis of past videos.

Last updated: 2026-11-11 (interaction review: Rosemary IG only 8 views in a day, 0 real comments; item 17 = interaction kit for every video); earlier 2026-11-10 (H.M. Brain Story first past 1,000 views, IG 12.3 s watch; fixes for Thu: opinion 1/2 question, TikTok carousel-first); earlier 2026-11-08 (Tremor carousel 273 passed its video 210 on TikTok; next fix: 1/2 question on screen from second 0; TikTok carousel-first test Tue); earlier 2026-11-07 (daily analysis: Tremor best first day, 600 views, Facebook 296; IG 35.2% past 3 s but watch time still ~6 s → Sunday test unchanged); earlier 2026-11-06 ( EMMA-Can's fixes — true shock number in the first second + cover-first — gave the best Instagram 3-s rate ever, 39.1%, but watch time stayed ~5.7 s; first time a TikTok video beat its carousel; YouTube channel lost advanced features, so pinning is blocked); earlier 2026-11-04 (ENRICH 3rd two-option hook at 28%+; 48 s did not raise watch time)

## Fixed rules (never change these)

- Use only facts from the paper. Re-check every number.
- All graphics are original; no copied figures.
- Every caption has the citation + DOI, the main limitation, and "For education — not medical advice."
- Vertical 1080×1920 only. No letterboxed or wide videos, ever.
- Never use "<" or ">" in YouTube titles or descriptions.

## Current plan (change these when the data says so)

1. **Hook in the first 2 seconds.** Open on a two-option decision question (see rule 8), big on screen and spoken first. Example: "Operate now… or wait 2 weeks?" No logo intro and no slow build-up.
2. **Length: about 35 seconds (Motaz, 2026-11-01)** — roughly 85–100 spoken words, 5–6 short scenes (hook, what they did, main result, the catch, takeaway + question). Instagram viewers watched only ~6 s of the 54-s Eptinezumab video, so test ~35 s against the old ~50 s and compare 3-second rate + average watch time.
3. **End with a question that invites a comment.** Example: "Would you operate? Comment 1 for yes, 2 for wait." Then "Follow for one neuro paper a day."
4. **v3 style (approved by Motaz on 2026-10-22, see template/README.md).** Dr. Mot (cartoon stick doctor = Motaz) with smooth poses; eased zoom in/out; real 3D object (Three.js) in the hook; 3D motion graphics (page fly-ins, card flips, extruded titles, parallax particles); real journal page screenshots with red boxes + note pills (open-access/CC BY papers only; paywalled = title/authors block only); burned-in word-by-word captions with yellow key words; sound effects only (whoosh/pop/click/swipe) — NO music, no instruments (Motaz's rule); loop ending (last line "because the real question is…" fades into the cover); "NEURO PAPER #N" badge; light human jokes (med-student life, everyday, memes), script must sound 100% human.
4b. **Cover = Canva** (9:16 only, AI 3D hero image + big 2-line headline + key number box + NEURO PAPER #N + #NeuroMot, text out of the bottom 20%). The same cover is the video's first frame and the loop's last frame.
4c. **Carousel** (6 slides, 4:5, Canva) of the same paper posted at 18:00 on Instagram + Facebook + TikTok (photo mode, no music). Real numbers only — never invented curves/funnels.
5. **3 videos a week (Motaz, 2026-10-23): Sunday, Tuesday, Thursday at 12:00 noon (Asia/Hebron)**, each from the MOST ATTRACTIVE idea from any source (app summaries, the playbook ideas, or a fresh search) — a new paper gets a verified summary in the app first (Motaz, 2026-10-31); carousel the same day at 18:00. Late-night posts (9–11 PM) did worst.
6. **Caption:** first line = the hook question; keep the key numbers short; hashtags start with #NeuroMot (5–9 in total).
7. **Pinned picks:** **Thursday 2026-11-05 = EMMA-Can** (summary doc_id 2026-10-26, chronic subdural hematoma ± middle meningeal artery embolization; two-option hook e.g. "Drain it… or also block the artery?"). Paper #10 (DBS vs focused ultrasound, doc 2026-10-28) is already made for Friday 2026-11-06 — never reuse it.
8. **Hook = two-option decision question, always (Motaz, 2026-11-01).** It is the only pattern that clearly helped the first 3 seconds: "Operate now, or wait?" (ASDH) 32% stayed past 3 s, vs 21–26% for yes/no or "Can X do Y?" hooks (Eptinezumab 25.5%). The hook lab still runs, but the chosen hook must be a two-option choice ("A, or B?").

10. **Topic priority (Motaz, 2026-11-01):** prefer stroke and neurosurgery decision papers (thrombectomy, bleeds, surgery timing) — SELECT2 802 and AneurysmAI 545 views beat headache (~325) and Alzheimer's (288). Other topics only when nothing strong fits.

9. **Growth prompts (Motaz, 2026-10-31, see strategy/playbook.md):** every video gets a hook lab (15 hooks in 5 groups → best 5 → use #1) and a retention pass on the script; carousels end with a save reason + a share reason. Pinned hooks still win over the hook lab.

10. **3D anatomy segment (Motaz, 2026-11-03):** if the paper has a clear body place (spine, nerve, brain region, bleed, vessel), add a 5–10 s x-ray-body anatomy scene (template/src/Anatomy.tsx) right after the hook. Skip it when it doesn't help.

14. REAL PHOTOS (Motaz, 2026-11-07): Brain Stories show real photos of the people/places (patient, hospital, doctor) — only free-license ones (Wikimedia Commons public domain / CC BY / CC BY-SA), credit on screen + in caption; if no free photo exists (e.g. H.M.), use a drawn silhouette and say so.
14c. IDEA FINDER (Motaz, 2026-11-07): before picking a Brain Story, run Taplio search_inspiration (queries like "neurosurgery history patient story", "brain neurology famous case", "neurologist story", "famous patient brain"; lang en; min_likes 200; max_days_old 365) and look at which stories got the most likes/shares. Use only the TOPIC; never copy text; check every fact yourself. First scan (2026-11-07): Brenda Milner and H.M. story 1,206 likes / 237 shares (top); Paul Kalanithi, the neurosurgeon who became the patient, 406; Dr. Howard Tucker, the oldest working neurologist, 362. New ideas from it: Brenda Milner herself, Paul Kalanithi, Howard Tucker (check current facts first).
14d. FACEBOOK CAROUSELS (Motaz, 2026-11-09: "facebook is very bad in carousel"): Facebook photo posts reach only a handful of people (Metricool reach 1-7 per carousel), while Facebook REELS reach non-followers (150-300 views). From Thursday: post the carousel to Instagram + TikTok only. TEST on Facebook instead: turn the 6 slides into a 15-18 s slideshow reel (each slide ~2.5 s with a slow zoom, the video's SFX, cover first) and post it as a Facebook REEL at 18:00. Judge after 2 tries.
14e. FORMAT CHANGE (Motaz, 2026-11-09): ALL video days (Sun/Tue/Thu) are now Brain Stories picked with Taplio (no paper-summary videos until he asks again). Next number: BRAIN STORY #3 (#2 Rosemary Kennedy made 9 Nov for Tue 10 Nov).
PINNED Tue 2026-11-10 = BRAIN STORY #2: Rosemary Kennedy and the 1941 lobotomy (Taplio: 345 likes, 82 comments, 107 shares; same author as the Milner post with 1,206 likes). Neurology angle: what a prefrontal lobotomy cut (the frontal lobe's connections) and why it destroyed her speech and walking. Question: "What did the surgeons cut? 1 = frontal lobe connections, 2 = the brainstem" (answer 1). Facts to verify with 2+ sources before writing (Wikipedia only as a pointer): born 13 Sep 1918; lobotomy Nov 1941 at 23 by Walter Freeman and James Watts, awake during it; afterwards could barely walk or speak; lived at St. Coletta, Wisconsin; died 7 Jan 2005 at 86; sister Eunice Kennedy Shriver started Camp Shriver (1962) and the Special Olympics (1968). Tone: respectful, no jokes about her disability; Dr. Mot serious in her scenes (a light moment only about the 1949 Nobel irony if used). Photos: only free-license or clearly public-domain ones (check Commons: Walter Freeman, Rosemary Kennedy); credit each. 3D: prefrontal fibers lit then cut. Ending: "1 or 2? Dr. Mot, one brain story at a time".
14f. WOMEN IN PHOTOS (Motaz, 2026-11-09, Islamic rule, FIXED): in every photo of a woman, blur her HAIR and all visible SKIN (neck, chest, arms, legs) and keep her FACE and her CLOTHING sharp. Do it in the image file with PIL before using it: blurred copy (GaussianBlur 26) + a mask that is sharp only on a face ellipse and clothing polygons, with skin polygons cut out (example: tools/blur_women.py usage in examples/brain-story-RK). Check the result by eye before rendering. Masked/capped surgical staff whose hair is covered are fine. Never use AI images of women.
14b. **New direction (Motaz, 2026-11-07): videos are not only paper summaries.** Two formats now:
   - **Brain Stories** (new): one true story from neurology/neurosurgery history (famous patients, first surgeries, big discoveries), told like the H.M. LinkedIn post: a concrete first line (year + person + what happened), the twist, what it taught us about the brain, one-line lesson. Frame it as NEUROLOGY/anatomy (which brain part, what it does) — never psychology. Show the brain part in the 3D x-ray anatomy style. Facts only, checked against the original paper or a reliable source (cite it on screen and in the caption). No photos of real patients unless clearly public domain; use Dr. Mot + 3D + drawings instead. Ending question = a 1/2 guess (e.g. "Which part was removed? 1 = hippocampus, 2 = frontal lobe").
   - **You're the surgeon** (papers): keep, as before.
   - Mix: Sun = Brain Story, Tue = paper (You're the surgeon), Thu = Brain Story — then judge with the numbers after 2 weeks.
   - Pinned: **Sun 2026-11-08 = H.M. (Henry Molaison)** — 1953 surgery at 27 for seizures (both medial temporal lobes, incl. hippocampi, removed by William Scoville), seizures better but no new memories; Brenda Milner's mirror-star test: better every day, "never done this" every day; studied until his death in 2008, name made public then. Source: Scoville & Milner, J Neurol Neurosurg Psychiatry 1957 (+ check before use). Lesson: remembering events and learning a skill use different brain systems.
   - Next story ideas (check facts first): Phineas Gage (1848, iron rod, frontal lobe); "Tan" — Broca's patient Leborgne (1861, speech area); Wilder Penfield's awake surgery and the homunculus; split-brain patients (corpus callosum); the 1949 Nobel for lobotomy.

12. **Fixes from 2026-11-03 (weak-point review, see analytics/lessons.md):** (a) show the 1/2 comment question on screen at ~8–10 s as well as the end, and set Metricool firstCommentText = the question for Instagram + Facebook; (b) the most shocking true number on screen in the first 2 s next to the hook, 35–40 s total; (c) decision videos are a series "YOU'RE THE SURGEON · case N" (pill on screen + caption) ending "Follow for case N+1": Thu 2026-11-05 = case 1, Fri 2026-11-06 = case 2.

13. **Fixes from 2026-11-06 (see analytics/lessons.md):** (a) open loop at 3–5 s ("the answer surprised the surgeons — stay to the end") and a new picture every 1.5–2 s in the first 10 s; (b) one-tap question with a reward: "Comment 1 or 2 — I reply to every answer with the reason", and reply the same day.

15. **Fixes from 2026-11-08 (see analytics/lessons.md):** (a) the 1/2 question with both options on screen from second 0–2, next to the hook; (b) TikTok only: carousel at 12:00, video at 18:00 on Tue 2026-11-10 (IG/FB unchanged); (c) if H.M. Instagram watch time is not above 6.2 s, cut to ~30 s.

16. **Fixes from 2026-11-10 (see analytics/lessons.md):** (a) the 1/2 question is an OPINION choice with no wrong answer ("Would you have said yes? 1 = yes, 2 = no"), on screen at 0–2 s and at the end; (b) Thu 2026-11-12: TikTok carousel 12:00 + TikTok video 18:00 (IG/FB unchanged) — 15(b) was not run on 11-10; (c) keep Brain Story length/pace (H.M. IG 12.3 s).

17. **Interaction kit, every video from Fri 2026-11-13 (Gage moved from Thu 11-12) (see analytics/lessons.md 2026-11-11):** (a) first 3 s never graphic (no wound, blood or instrument inside a head before 3 s): a graphic hook may be why Rosemary got 8 Instagram views; (b) opinion 1/2 question with no wrong answer, on screen at 0-2 s, spoken once early and as the last line; (c) one save line + one share line in every script; (d) first comment = the question + "I'll post my own answer with the reason tonight", and at the 18:08 review Motaz's answer goes in as a reply (real account only); (e) the review must finish like + question comment on all 4 apps, catch-up runs finish what is missing; (f) reply to every real comment the same day and end with a short follow-up question; (g) TikTok: carousel 12:00, video 18:00, carousel slide 1 = the question; (h) if a reel has under 50 Instagram views at 24 h while the one before had 300+, check Instagram Account status read-only and log it.

11. **Improve without asking (Motaz, 2026-11-03):** any suggestion from the analysis goes straight into the next video; report it, don't ask for permission. Fixed rules still hold.

## What the data has shown so far

- 2026-10-19: Boston (new style, voice, 12:00) beat both older videos within 12 hours. It got 327 views across 4 apps, versus 209 for ASDH (2 days old) and 114 for INTERACT3.
- Wide, letterboxed INTERACT3: Instagram viewers stayed 2.2 s on average and only 15% stayed past 3 s. Lesson: vertical only.
- ASDH on Instagram: viewers stayed 6.7 s on average and 30% stayed past 3 s. Most people leave very early, so the hook matters most.
- TikTok gave 0 views to ASDH and INTERACT3, but 89 views to Boston.
- Facebook reels reach non-followers: Boston got 124 views with a 0-follower Page. ASDH, posted at 11:31 PM, got only 1 view.
- YouTube Shorts: about 9 views in total so far. The channel is new, and YouTube counts views late.
- Engagement is almost zero (about 5 likes, 1 save, 0 comments). The videos need a call to action.
- 2026-10-23: SELECT2 (posted 22:25, 62 s, own voice) is the top video: 740 views in 2.5 days (TikTok 386, Facebook 219). Early sign that the topic/hook matters more than the hour on TikTok. Still 0 real viewer comments; Instagram viewers leave after ~5–6 s.
- 2026-10-27: AneurysmAI (v3, noon) 530 views in 2 days vs SELECT2 740 at the same age; its TikTok carousel (345) beat the video on TikTok (170). Early signs only.
- 2026-10-28: TikTok carousels keep growing, videos do not: AneurysmAI carousel 345 → 473 in a day (video 170 → 174); Donanemab carousel 126 in 14 h vs its video 101 in 20 h. Second time the carousel wins on TikTok (early sign). Facebook gave Donanemab only 30 views in 20 h (AneurysmAI 205). Instagram watch time: Donanemab 6.4 s, AneurysmAI 8.2 s (best so far).
- 2026-10-29/31: carousel beat the video on TikTok 5 times in a row (latest Eptinezumab 222 vs 168 at 2 days; Donanemab 215 vs 113). Carousels and videos both stop after ~3 days. Facebook stays low for the last 2 videos (35 and 39 vs 160–228 before) — early sign, watch it. Still 0 real viewer comments after 7 videos + 4 carousels.
- 2026-10-24/11-01: videos stop growing after ~3 days (only TikTok carousels keep a slow trickle); posts older than 2 days add almost no views.
- 2026-11-02: OSCIS (two-option hook, neurosurgery) ~440 views in under 1 day, best first day so far; Instagram 28.9% past 3 s / 7.7 s (2nd best, after ASDH — both two-option hooks); Facebook 171 vs 33–37 for the last 2 non-surgical videos. Early signs.
- 2026-11-04: ENRICH (48 s, two-option hook, neurosurgery) 384 video views in ~20 h (FB 159, IG 122, TikTok 99, YouTube 4; OSCIS had 440 at the same age) + TikTok carousel 125. Instagram 28.3% past 3 s — now 3 of 3 two-option hooks at 28%+ vs 21.7–27.2% for the rest. But watch time 6.1 s (OSCIS 55 s: 7.7 s): shorter alone did not keep people longer. Still 0 real comments and 0 shares.
- 2026-11-06: EMMA-Can (Thu 14:16, two-option hook + 28% vs 4.3% on screen in the first second + question card at ~8 s) 462 views in ~22 h (FB 173, TikTok 172, IG 117, YouTube 0). Instagram 39.1% past 3 s (best ever; earlier best 31.6%) but avg watch 5.7 s (no gain). TikTok: video 172 beat its carousel 163 for the first time. Still 0 real comments, even with the on-screen question + auto first comment. Early signs.
- 2026-11-08: TikTok carousels keep growing after videos stop: Tremor carousel 185 → 273 in a day, video 187 → 210.
- 2026-11-07: Tremor (Fri 12:04, two-option + number in the first second + cover-first) 600 video views in ~25 h — best first day ever (EMMA 462, OSCIS 440); Facebook 296 (best ever), TikTok video 187 = carousel 185, IG 114. IG 35.2% past 3 s (2 of 2 first-second-number videos at 35%+) but watch time 6.2 s (still ~6 s). 0 real comments after 11 videos.

- 2026-11-10: H.M. (Brain Story #1) 1,013 views in ~2 days without YouTube — first past 1,000 (IG 616, 12.3 s avg, 6 saves; FB 260; TikTok only 137). Still 0 real comments.
- 2026-11-11: Rosemary Kennedy (Brain Story #2) ~26 h: 326 video views (FB 179, TikTok 138, IG only 8, YouTube 1) vs H.M. 1,018 at 3 days; IG 8 is far below every reel so far (cause unknown, check Account status). FB watch 7 s (H.M. 2 s). Still 0 real comments.

## Series counter

- Next NEURO PAPER number: 12 (#10 = EMMA-Can Thu 11-05, #11 = tremor Fri 11-06; increase by 1 after every published paper video). #11 is already used by the Friday 2026-11-06 video (made early) — so after Thursday's #10, the next free number is 12.

## Ideas to test next

- Interaction kit (item 17) from Thu 11-12: count real comments per 1,000 views per app and replies inside our own question thread; compare with H.M. and Rosemary (both 0).

- Opinion question vs quiz question for comments (Thu 11-12 opinion; compare real comments per 1,000 views with H.M. and Rosemary Kennedy).

- **Format test (Motaz approved 2026-10-30):** starting Thursday 2026-11-05 (Sun 11-01 and Tue 11-03 are both format A), over ~2 weeks, use one format per video and compare Instagram 3-second rate + watch time, then keep the 1–2 winners. Formats: A two-option decision question · B carousel-first · C "Too late?" / myth vs evidence · D case puzzle ("What would you do?") · E one shocking number · F "This is on your exam". Start with stroke/thrombectomy and neurosurgery/bleed papers (best topics so far). Log which format each video used in analytics/log.md.

- A/B the hook: a question hook vs a number hook. Compare the share of viewers who stay past 3 s and the average watch time on Instagram.
- Try about 35 s versus about 50 s.
- Carousel vs video on TikTok: carousel has won 7 times (latest ENRICH 125 vs 99, both posted the same afternoon). The noon-carousel / 18:00-video order was only tested once (Paper #8) — repeat it for Thursday's EMMA-Can if the run is on time.
- Watch time (next small test, Sunday 11-08): the first-second number fix works for the 3-s rate, but people still leave at ~6 s. Test an open loop at 3–5 s ("the answer surprised the surgeons — stay to the end") and change the picture every 1.5–2 s in the first 10 s; judge on Instagram avg watch vs EMMA 5.7 s and Tremor (Fri 11-06).
- Comments: still 0 real comments after the on-screen question card. Next idea after the watch-time test: ask an easier, one-tap question ("1 or 2?") with a playful reason to answer.
