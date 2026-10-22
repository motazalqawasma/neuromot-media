# Instrument-free sound effects for #NeuroMot (no music): whoosh, pop, click, swipe.
# usage: python3 sfx.py out.wav total_seconds "type@seconds,type@seconds,..."
import sys, numpy as np, wave
SR=44100
rng=np.random.default_rng(7)
def env(n,a=0.02,r=0.6):
    t=np.linspace(0,1,n); e=np.minimum(t/a,1)*np.exp(-t/r*3); return e
def lowpass(x,alpha):
    y=np.zeros_like(x); acc=0.0
    for i,v in enumerate(x): acc+=alpha*(v-acc); y[i]=acc
    return y
def whoosh():
    n=int(0.45*SR); x=rng.standard_normal(n)
    # sweep: blend from low-passed to brighter noise
    lo=lowpass(x,0.03); hi=lowpass(x,0.25)
    t=np.linspace(0,1,n); y=lo*(1-t)+hi*t
    e=np.sin(np.pi*t)**2
    return y*e*2.2
def pop():
    n=int(0.12*SR); t=np.arange(n)/SR
    f=220*np.exp(-t*18)+90   # quick downward thump, percussive (not a note)
    y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*38)
    y+=rng.standard_normal(n)*np.exp(-t*120)*0.25
    return y*0.9
def click():
    n=int(0.03*SR); y=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*260)
    return lowpass(y,0.5)*0.8
def swipe():
    n=int(0.32*SR); x=lowpass(rng.standard_normal(n),0.35)
    t=np.linspace(0,1,n); return x*(np.sin(np.pi*t)**1.5)*1.4
F={'whoosh':whoosh,'pop':pop,'click':click,'swipe':swipe}
out,total,events=sys.argv[1],float(sys.argv[2]),sys.argv[3]
buf=np.zeros(int(total*SR)+SR)
for ev in events.split(','):
    k,at=ev.split('@'); s=F[k](); i=int(float(at)*SR); buf[i:i+len(s)]+=s[:len(buf)-i]
buf=buf/ (np.max(np.abs(buf))+1e-9)*0.9
pcm=(buf*32767).astype(np.int16)
with wave.open(out,'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok',out,len(pcm)/SR)
