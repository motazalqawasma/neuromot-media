# NeuroMot video template (Remotion)
- `src/Video.tsx` — 1080×1920 paper explainer (scene list + per-scene graphics). Voice file goes in `public/voice.mp3`.
- `src/Cover.tsx` — 9:16 cover (Instagram / TikTok / Facebook).
- `src/Banner.tsx` — 16:9 banner (YouTube thumbnail only).
Render: `npm i && npx remotion render src/index.ts NeuroMot out/video.mp4 --concurrency=2 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
Example built for: Boston criteria v2.0 (2026-10-19).
