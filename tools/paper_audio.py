#!/usr/bin/env python3
"""Turn one Neuro Papers summary (JSON from the app's "summaries" collection)
into a spoken MP3 + chapter list, with the free offline Kokoro voice.

Usage:
  python3 paper_audio.py SUMMARY.json OUT_DIR [--voice af_heart] [--models DIR]

Needs: pip install kokoro-onnx soundfile ; ffmpeg ; model files in --models DIR:
  kokoro.onnx  <- github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  voices.bin   <- github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
Writes OUT_DIR/<date>.mp4 (AAC audio only, plays in any <audio>) and OUT_DIR/<date>-chapters.json
"""
import json, os, re, subprocess, sys, argparse
import numpy as np

SECTIONS = [
    ("story", "The story"),
    ("core_thesis", "Core thesis"),
    ("mechanisms", "Key mechanisms and rationale"),
    ("methods", "Methods"),
    ("results", "Results"),
    ("interpretation", "Interpretation"),
    ("limitations", "Limitations"),
    ("implications", "Clinical and practical implications"),
]

# acronyms read as words (not spelled out)
WORDS = {"STARD", "PRISMA", "CONSORT", "NIHSS", "NASCET", "CHEST", "RESCUE", "ENRICH",
         "MISTIE", "STICH", "INTERACT", "ATACH", "ESCAPE", "DEFUSE", "DAWN", "SWIFT",
         "AIDS", "COVID", "NICE", "WHO", "UK", "USA", "FLAIR", "NIH", "ARUBA", "TIA", "MOCA"}
EXPAND = {
    "IQR": "interquartile range", "CI": "confidence interval", "CrI": "credible interval",
    "OR": "odds ratio", "aOR": "adjusted odds ratio", "HR": "hazard ratio", "aHR": "adjusted hazard ratio",
    "RR": "relative risk", "SD": "standard deviation", "SE": "standard error", "AUC": "area under the curve",
    "mRS": "modified Rankin Scale", "GCS": "Glasgow Coma Scale", "vs": "versus", "approx": "approximately",
}
GREEK = {"α": " alpha ", "β": " beta ", "ε": " epsilon ", "κ": " kappa ", "χ": " chi ", "μ": " micro ", "µ": " micro ",
         "δ": " delta ", "Δ": " delta ", "γ": " gamma ", "τ": " tau ", "θ": " theta "}


def speakable(md: str) -> list:
    """Markdown -> list of paragraphs of plain spoken English."""
    out = []
    for line in md.replace("\r", "").split("\n"):
        raw = line.strip()
        if not raw:
            continue
        if re.fullmatch(r"\|?[\s:\-|]+\|?", raw):  # table rule line
            continue
        t = raw
        t = re.sub(r"^#{1,6}\s*", "", t)
        t = re.sub(r"^[-*+]\s+", "", t)
        t = re.sub(r"^\d+[.)]\s+", "", t)
        if t.startswith("|"):
            t = ", ".join(c.strip() for c in t.strip("|").split("|") if c.strip())
        t = t.replace("**", "").replace("`", "")
        t = re.sub(r"(?<!\w)\*(\S[^*]*?)\*(?!\w)", r"\1", t)
        t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)          # links
        t = re.sub(r"https?://\S+", "", t)
        t = speak_symbols(t)
        t = re.sub(r"\s+", " ", t).strip()
        if not t:
            continue
        if t[-1] not in ".!?:;":
            t += "."
        out.append(t)
    return out


def spell(tok):
    return " ".join(tok)


def speak_symbols(t: str) -> str:
    t = re.sub(r"(\d)·(\d)", r"\1.\2", t)                  # Lancet decimal point
    t = t.replace("·", ", ").replace("…", "...")
    t = re.sub(r"(\d)\s*[–—-]\s*(\d)", r"\1 to \2", t)     # ranges
    t = t.replace("—", ", ").replace("–", ", ")
    t = re.sub(r"(^|[\s(=])[−-](\d)", r"\1minus \2", t)
    t = t.replace("−", " minus ")
    t = t.replace("≥", " at least ").replace("≤", " at most ").replace("≈", " about ")
    t = t.replace("±", " plus or minus ").replace("×", " times ").replace("→", " to ")
    t = t.replace("∞", " infinity ").replace("°", " degrees ").replace("²", " squared ")
    t = t.replace("⁻⁶", " to the minus 6").replace("⁻", " minus ").replace("⁶", "6")
    for g, w in GREEK.items():
        t = t.replace(g, w)
    t = re.sub(r"\bp\s*<\s*", "p less than ", t)
    t = re.sub(r"\bp\s*>\s*", "p greater than ", t)
    t = re.sub(r"\bp\s*=\s*", "p equals ", t)
    t = re.sub(r"\bn\s*=\s*", "n equals ", t)
    t = re.sub(r"\s*<\s*", " less than ", t)
    t = re.sub(r"\s*>\s*", " greater than ", t)
    t = re.sub(r"\s*=\s*", " equals ", t)
    t = re.sub(r"(\d)\s*%", r"\1 percent", t)
    t = re.sub(r"\bv(\d)", r"version \1", t)
    t = re.sub(r"\b(\d(?:\.\d)?)\s?T\b", r"\1 Tesla", t)
    t = re.sub(r"\be\.g\.", "for example", t)
    t = re.sub(r"\bi\.e\.", "that is", t)
    t = re.sub(r"\bet al\.?", "and colleagues", t)
    t = re.sub(r"\bvs\.?", "versus", t)
    t = t.replace(" / ", ", ").replace("/", " or ")
    t = t.replace("*", " star ").replace("&", " and ").replace("~", " about ")
    t = t.replace("(", ", ").replace(")", ", ").replace("[", ", ").replace("]", ", ")
    t = t.replace("+", " plus ")
    t = re.sub(r"\s+,", ",", t)
    t = re.sub(r"\s*,\s*([,.;:?])", r"\1", t)
    t = re.sub(r"(,\s*)+", ", ", t)

    def acr(m):
        w = m.group(0)
        if w in EXPAND:
            return EXPAND[w]
        base = re.sub(r"s$", "", w)
        if w in WORDS or base in WORDS:
            return w
        caps = sum(c.isupper() for c in w)
        if caps >= 2 and len(w) <= 7:
            if w.endswith("s") and base.isupper():
                return spell(base) + "s"
            return spell(w)
        return w
    t = re.sub(r"\b[A-Za-z]*[A-Z][A-Za-z]*\b", acr, t)
    return t


def chunks(paras, limit=300):
    """split paragraphs into sentence groups small enough for the model."""
    for p in paras:
        sents = re.split(r"(?<=[.!?;:])\s+", p)
        buf = ""
        for s in sents:
            while len(s) > limit:                       # very long sentence: split at commas
                cut = s.rfind(", ", 0, limit)
                cut = cut if cut > 50 else limit
                if buf:
                    yield buf, False; buf = ""
                yield s[:cut + 1], False
                s = s[cut + 1:].strip()
            if len(buf) + len(s) > limit and buf:
                yield buf, False
                buf = s
            else:
                buf = (buf + " " + s).strip()
        if buf:
            yield buf, True                             # end of paragraph


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("summary"); ap.add_argument("out")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--models", default=os.path.dirname(os.path.abspath(__file__)))
    a = ap.parse_args()
    from kokoro_onnx import Kokoro
    d = json.load(open(a.summary)); d = d.get("data", d)
    date = d.get("date") or os.path.basename(a.summary).split(".")[0]
    k = Kokoro(os.path.join(a.models, "kokoro.onnx"), os.path.join(a.models, "voices.bin"))
    sr = 24000
    pieces, chapters, t = [], [], 0.0

    def say(text, pause):
        nonlocal t
        try:
            audio, r = k.create(text, voice=a.voice, speed=a.speed, lang="en-us")
        except Exception as e:  # skip a broken sentence instead of failing the whole file
            print("skip:", text[:80], e, file=sys.stderr); return
        audio = np.asarray(audio, dtype=np.float32)
        pieces.append(audio); pieces.append(np.zeros(int(sr * pause), np.float32))
        t += len(audio) / sr + pause

    intro = f"Neuro Papers. {d.get('title', '')}. Published in {d.get('journal', '')}, {d.get('year', '')}."
    chapters.append({"title": "Introduction", "start": 0})
    for c, end in chunks([speak_symbols(intro)]):
        say(c, 0.9 if end else 0.25)
    for key, name in SECTIONS:
        body = str(d.get(key) or "").strip()
        if not body:
            continue
        if key == "story":
            body = body.replace("**In one breath**", "In one breath.")
        chapters.append({"title": name, "start": round(t, 1)})
        say(name + ".", 0.6)
        for c, end in chunks(speakable(body)):
            say(c, 0.55 if end else 0.2)
        pieces.append(np.zeros(int(sr * 0.6), np.float32)); t += 0.6
    say("End of today's paper. For education, not medical advice.", 0.5)

    os.makedirs(a.out, exist_ok=True)
    wav = os.path.join(a.out, f"{date}.wav")
    import soundfile as sf
    sf.write(wav, np.concatenate(pieces), sr)
    m4a = os.path.join(a.out, f"{date}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-c:a", "aac", "-b:a", "56k",
                    "-movflags", "+faststart", m4a], check=True)
    os.remove(wav)
    json.dump({"date": date, "voice": a.voice, "duration": round(t, 1), "chapters": chapters},
              open(os.path.join(a.out, f"{date}-chapters.json"), "w"), indent=1)
    print(m4a, round(t / 60, 1), "min")


if __name__ == "__main__":
    main()
