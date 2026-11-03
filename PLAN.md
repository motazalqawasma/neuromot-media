# NeuroMot video plan

This file is the living plan for the daily #NeuroMot video. The daily task reads it **before** writing the script and building the video, and **updates it after** each day's analysis of past videos.

Last updated: 2026-11-03 (weak-point review: 0 real comments, short watch time, low likes → 3 fixes for Thursday); previously 2026-11-02 (daily analysis: OSCIS 2nd-best Instagram 3-s rate with a two-option hook; Facebook rebound on neurosurgery; TikTok carousel-noon / video-18:00 test repeats for Paper #9)

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
7. **Pinned pick (Motaz, 2026-10-30):** on **Tuesday 2026-11-03** the video paper is **ENRICH** (summary doc_id 2026-11-03), not another candidate. Hook = format A, a two-option decision question: **"Suck the clot out, or leave it?"**, spoken first and big on screen. Comment question: "Would you operate? 1 = remove it, 2 = leave it". Paywalled paper (NEJM) → title/authors block only, no page screenshots. Remove this line after that video is published.
8. **Hook = two-option decision question, always (Motaz, 2026-11-01).** It is the only pattern that clearly helped the first 3 seconds: "Operate now, or wait?" (ASDH) 32% stayed past 3 s, vs 21–26% for yes/no or "Can X do Y?" hooks (Eptinezumab 25.5%). The hook lab still runs, but the chosen hook must be a two-option choice ("A, or B?").

10. **Topic priority (Motaz, 2026-11-01):** prefer stroke and neurosurgery decision papers (thrombectomy, bleeds, surgery timing) — SELECT2 802 and AneurysmAI 545 views beat headache (~325) and Alzheimer's (288). Other topics only when nothing strong fits.

9. **Growth prompts (Motaz, 2026-10-31, see strategy/playbook.md):** every video gets a hook lab (15 hooks in 5 groups → best 5 → use #1) and a retention pass on the script; carousels end with a save reason + a share reason. Pinned hooks still win over the hook lab.

10. **3D anatomy segment (Motaz, 2026-11-03):** if the paper has a clear body place (spine, nerve, brain region, bleed, vessel), add a 5–10 s x-ray-body anatomy scene (template/src/Anatomy.tsx) right after the hook. Skip it when it doesn't help.

12. **Fixes from 2026-11-03 (weak-point review, see analytics/lessons.md):** (a) show the 1/2 comment question on screen at ~8–10 s as well as the end, and set Metricool firstCommentText = the question for Instagram + Facebook; (b) the most shocking true number on screen in the first 2 s next to the hook, 35–40 s total; (c) decision videos are a series "OPERATE OR WAIT? · case N" ending "Follow for case N+1".

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
- 2026-10-24/25: videos stop growing after ~3 days (all 4 old videos +65 then +19 views per day); only TikTok keeps a slow trickle (SELECT2 386 → 432). Still 0 real viewer comments after 5 videos.

- 2026-11-01: all posts older than 2 days were flat for a full day (no views added); ASDH two-option hook still best Instagram 3-s rate (32%).
- 2026-11-02: OSCIS (two-option hook, neurosurgery) ~440 views in under 1 day, best first day so far; Instagram 28.9% past 3 s / 7.7 s (2nd best, after ASDH — both two-option hooks); Facebook 171 vs 33–37 for the last 2 non-surgical videos. Early signs.

## Series counter

- Next NEURO PAPER number: 10 (increase by 1 after every published paper video).

## Ideas to test next

- **Format test (Motaz approved 2026-10-30):** starting Thursday 2026-11-05 (Sun 11-01 and Tue 11-03 are both format A), over ~2 weeks, use one format per video and compare Instagram 3-second rate + watch time, then keep the 1–2 winners. Formats: A two-option decision question · B carousel-first · C "Too late?" / myth vs evidence · D case puzzle ("What would you do?") · E one shocking number · F "This is on your exam". Start with stroke/thrombectomy and neurosurgery/bleed papers (best topics so far). Log which format each video used in analytics/log.md.

- A/B the hook: a question hook vs a number hook. Compare the share of viewers who stay past 3 s and the average watch time on Instagram.
- Try about 35 s versus about 50 s.
- Carousel vs video on TikTok: carousel has won 6 times (latest OSCIS 213 vs 134). Paper #8 test (carousel at noon, video at 18:00): the 18:00 video did slightly better than the noon Eptinezumab video at the same age (134 vs 123). Repeat the same order once for Paper #9 (ENRICH) before deciding.
