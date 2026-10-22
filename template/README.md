# #NeuroMot video template (v3 style, approved by Motaz 2026-10-22)

Example: the aneurysm-AI video (Neuro Paper #5, Fujimura, JAMA Netw Open 2025) — `src/Video.tsx`.

- `src/Stick.tsx` — **Dr. Mot** (cartoon stick doctor = Motaz) with smooth eased poses (`stand point think shrug cheer facepalm thumbs hold wave`), moods, and `Cam` (eased zoom in/out keyframes `[frame, scale, x%, y%]`).
- `src/Vessel3D.tsx` — real 3D (Three.js via @remotion/three): artery tree + pulsing aneurysm, orbiting camera. Make a new 3D object per paper when it fits (brain, vessel, spine, electrode...).
- `src/Video.tsx` — cover frame first (0.4 s), scenes timed to the voice, 3D push transitions, parallax particles, 3D flip cards, extruded titles, real journal page screenshots (`Page` with red boxes + note pills), burned-in word-by-word captions (`CAPS`, `*key*` words yellow), `NEURO PAPER #N` badge, SFX track, loop ending (last line "because the real question is…" → crossfade to cover).
- Sound effects: `python3 ../tools/sfx.py public/sfx.wav <total_s> "whoosh@0.4,pop@2.1,click@3,swipe@5"` — whoosh/pop/click/swipe only. **No music, no instruments** (Motaz's rule).
- Render: `npx remotion render src/index.ts NeuroMot out/video.mp4 --concurrency=2 --gl=angle --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
