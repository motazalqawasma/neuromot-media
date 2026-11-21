import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12;
// voice: take 2 (2026-11-20 STEP 1), 49.3 s. Times = ElevenLabs Scribe word timestamps.
const scenes = [
  {id:'hook', a:0, b:13.3},{id:'signs', a:13.3, b:20.05},{id:'motor', a:20.05, b:25.95},{id:'godlee', a:25.95, b:29.85},{id:'walnut', a:29.85, b:33.35},{id:'twist', a:33.35, b:38.6},{id:'ask', a:38.6, b:43.3},{id:'end', a:43.3, b:49.5},
];
export const TOTAL = COVER + Math.round(49.5*S);
const cl = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const ease = (f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...cl, easing:Easing.out(Easing.cubic)});
const useSpring = (delay:number)=>{const f=useCurrentFrame(); const {fps}=useVideoConfig(); return spring({frame:f-delay,fps,config:{damping:12,mass:0.6}});};
// frame inside a scene for an absolute voice time
const at = (scene:string, sec:number)=>{const s=scenes.find(x=>x.id===scene)!; return Math.round((sec-s.a)*S);};

const depth = (c:string)=>Array.from({length:9},(_,i)=>`${i+1}px ${i+1}px 0 ${c}`).join(',')+', 14px 18px 24px rgba(0,0,0,.55)';
const Title: React.FC<{children:React.ReactNode; color?:string; delay?:number; size?:number}> = ({children,color=C.text,delay=0,size=120}) => {
  const f=useCurrentFrame(); const p=delay<=0?1:ease(f,delay,delay+12);
  return <div style={{fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:0.95,color,textTransform:'uppercase',textAlign:'center',opacity:p,
    transform:`perspective(1400px) translateY(${(1-p)*40}px) rotateX(${(1-p)*70}deg)`,textShadow:depth('#0B0B0E')}}>{children}</div>;
};
const Label: React.FC<{children:React.ReactNode; color?:string; delay?:number; size?:number}> = ({children,color=C.mute,delay=0,size=46}) => {
  const f=useCurrentFrame(); const p=ease(f,delay,delay+10);
  return <div style={{fontFamily:HEAD,fontWeight:800,fontSize:size,color,textAlign:'center',opacity:p,letterSpacing:1}}>{children}</div>;
};
const Flip: React.FC<{at:number; children:React.ReactNode; axis?:'X'|'Y'}> = ({at,children,axis='X'}) => {
  const s=useSpring(at); return <div style={{transform:`perspective(1200px) rotate${axis}(${(1-s)*90}deg) scale(${0.6+0.4*s})`,opacity:s>0.02?1:0}}>{children}</div>;
};
const Particles: React.FC = () => {
  const f=useCurrentFrame();
  return (<AbsoluteFill style={{overflow:'hidden'}}>
    {Array.from({length:46},(_,i)=>{const z=random('z'+i); const sp=0.4+z*2.2; const x=random('x'+i)*1080+Math.sin(f/60+i)*20*z;
      const y=((random('y'+i)*2100 - f*sp)%2100+2100)%2100-90; const r=2+z*7;
      return <div key={i} style={{position:'absolute',left:x,top:y,width:r*2,height:r*2,borderRadius:r,background:i%7===0?C.orange:'#C9CDD6',opacity:0.06+z*0.16,filter:`blur(${(1-z)*3}px)`}}/>;})}
  </AbsoluteFill>);
};
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Pill: React.FC<{at:number; children:React.ReactNode; bg?:string; color?:string; size?:number; rot?:number}> = ({at,children,bg=C.yellow,color=C.bg,size=52,rot=0}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{opacity:p,transform:`scale(${0.6+0.4*p}) rotate(${rot}deg)`,background:bg,color,fontFamily:HEAD,fontWeight:900,fontSize:size,padding:'6px 26px',borderRadius:14,display:'inline-block',boxShadow:'0 8px 0 #0B0B0E',whiteSpace:'nowrap'}}>{children}</div>);};
const Stamp: React.FC<{at:number; c?:string; size?:number; children:React.ReactNode}> = ({at,c=C.red,size=120,children}) => {const f=useCurrentFrame(); return (
  <div style={{opacity:ease(f,at,at+6),transform:`scale(${1.5-0.5*ease(f,at,at+8)}) rotate(-5deg)`,border:`10px solid ${c}`,color:c,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'10px 40px',borderRadius:20,background:'rgba(26,27,32,.88)',textAlign:'center'}}>{children}</div>);};
const Row: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=60}) => {const s=useSpring(at); return (
  <div style={{transform:`translateX(${(1-s)*-60}px)`,opacity:s>0.02?1:0,background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'12px 28px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};
// big number card
const NumCard: React.FC<{at:number; num:string; unit:string; c:string}> = ({at,num,unit,c}) => (
  <Flip at={at}><div style={{background:'rgba(26,27,32,.82)',border:`5px solid ${c}`,borderRadius:28,padding:'14px 44px 18px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,lineHeight:0.95,color:c,textShadow:depth('#0B0B0E')}}>{num}</div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',textTransform:'uppercase'}}>{unit}</div>
  </div></Flip>);
// real photo as a tilted print with slow zoom + credit line
const Photo: React.FC<{src:string; w:number; h:number; at:number; rot?:number; label?:string; credit?:string; pos?:string; fit?:'cover'|'contain'}> = ({src,w,h,at,rot=0,label,credit,pos='center',fit='cover'}) => {
  const f=useCurrentFrame(); const p=ease(f,at,at+12); const z=1.02+0.06*ease(f,at,at+150);
  return (<div style={{opacity:p,transform:`perspective(1400px) translateY(${(1-p)*120}px) rotateX(${(1-p)*40}deg) rotate(${rot*p}deg)`,background:'#f4f1ea',padding:'16px 16px 0',borderRadius:6,boxShadow:'0 30px 70px rgba(0,0,0,.6)',width:w}}>
    <div style={{width:w-32,height:h,overflow:'hidden',borderRadius:3,background:fit==='contain'?'#fff':'#111'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:fit,objectPosition:pos,transform:`scale(${z})`}}/></div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:44,color:'#1A1B20',textAlign:'center',padding:'8px 0 0'}}>{label}</div>
    <div style={{fontFamily:BODY,fontWeight:600,fontSize:18,color:'#6b6b6b',textAlign:'center',paddingBottom:10}}>{credit}</div>
  </div>);
};
const QCard: React.FC<{at:number; q:string; o1?:string; o2?:string; sub?:string}> = ({at,q,o1='1 = YES',o2='2 = NOT SURE',sub='comment below'}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 44px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:C.yellow}}>{q}</div>
    <div style={{display:'flex',gap:22,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff',background:C.green,padding:'6px 34px',borderRadius:14}}>{o1}</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff',background:C.red,padding:'6px 34px',borderRadius:14}}>{o2}</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:C.text,marginTop:14}}>{sub}</div>
  </div></Flip>);


// ---------- Gemini 3D zoom clips (dark style)
const LEN:Record<string,number>={'c1.mp4':10.07,'c2.mp4':10.58,'c3.mp4':10.45,'c4.mp4':10.95,'c5.mp4':10.7,'c6.mp4':10.5};
const HAS5 = true; const HAS6 = true;
const Clip: React.FC<{src:string; dur:number; start?:number; dark?:number}> = ({src,dur,start=0,dark=0}) =>
  <AbsoluteFill><OffthreadVideo muted src={staticFile(src)} startFrom={Math.round(start*S)} playbackRate={(LEN[src]-start-0.15)/dur} style={{width:1080,height:1920,objectFit:'cover'}}/>
  {dark>0 && <AbsoluteFill style={{background:`rgba(16,17,21,${dark})`}}/>}</AbsoluteFill>;
const Still: React.FC<{src:string; z0?:number; z1?:number; dur:number; dark?:number}> = ({src,z0=1,z1=1.06,dur,dark=0}) => {
  const f=useCurrentFrame(); const z=interpolate(f,[0,dur],[z0,z1],cl);
  return <AbsoluteFill><Img src={staticFile(src)} style={{width:1080,height:1920,objectFit:'cover',transform:`scale(${z})`}}/>{dark>0 && <AbsoluteFill style={{background:`rgba(16,17,21,${dark})`}}/>}</AbsoluteFill>;
};
const Shade = () => <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(16,17,21,.55) 0%, rgba(16,17,21,0) 26%, rgba(16,17,21,0) 62%, rgba(16,17,21,.55) 100%)'}}/>;
const Fade: React.FC<{a:number; b:number; children:React.ReactNode; style?:React.CSSProperties}> = ({a,b,children,style}) => {
  const f=useCurrentFrame(); if(f<a||f>b) return null;
  return <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:ease(f,a,a+6)*(1-ease(f,b-6,b)),...style}}>{children}</AbsoluteFill>;
};

// ---------- scene 1: 1884, no scans, the question (c1: back of the head, slow push)
const Hook = () => {
  const X='hook'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c1.mp4" dur={13.3}/><Shade/>
    <Fade a={0} b={at(X,8.4)} style={{paddingTop:220,gap:10}}>
      <Title size={210} color={C.text}>1884.</Title>
      {f>=at(X,1.78) && <Title size={130} color={C.orange} delay={at(X,1.78)}>NO SCANS.</Title>}
      {f>=at(X,2.82) && <Title size={130} color={C.orange} delay={at(X,2.82)}>NO X-RAYS.</Title>}
      {f>=at(X,6.9) && <div style={{marginTop:30}}><Stamp at={at(X,6.9)} c={C.red} size={96}>"THE TUMOUR IS HERE"</Stamp></div>}
    </Fade>
    <Fade a={at(X,8.5)} b={at(X,13.3)+4} style={{paddingTop:330}}>
      <QCard at={at(X,8.55)} q="Who do you trust more?" o1="1 = EYES" o2="2 = MACHINE" sub="a doctor's eyes… or the machine?"/>
    </Fade>
  </AbsoluteFill>);
};
// ---------- scene 2: the signs (c2: through the skull to the motor strip)
const Signs = () => {
  const G='signs'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c2.mp4" dur={20.05-13.3}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:22}}>
      <Pill at={at(G,14.84)} bg={C.yellow} size={60} rot={-2}>FACE TWITCHING</Pill>
      <Pill at={at(G,16.24)} bg={C.orange} color="#fff" size={60} rot={2}>HAND SHAKING</Pill>
      <Pill at={at(G,17.0)} bg={C.red} color="#fff" size={60} rot={-1}>ONE SIDE ONLY</Pill>
    </AbsoluteFill>
    {f>=at(G,18.2) && <AbsoluteFill style={{alignItems:'center',paddingTop:1080}}>
      <Flip at={at(G,18.2)}><div style={{background:'#f4f1ea',borderRadius:10,padding:'14px 34px',boxShadow:'0 20px 50px rgba(0,0,0,.6)',textAlign:'center'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:'#8a1c25',letterSpacing:2}}>NEUROLOGIST · LONDON</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:'#1A1B20',lineHeight:1}}>A. HUGHES BENNETT</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:'#555'}}>found it from the signs alone</div>
      </div></Flip></AbsoluteFill>}
  </AbsoluteFill>);
};
// ---------- scene 3: motor cortex, opposite side (c3: push-in to the lump)
const Motor = () => {
  const M='motor'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c3.mp4" dur={25.95-20.05}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:22}}>
      <Pill at={at(M,20.38)} bg={C.orange} color="#fff" size={58}>THE STRIP THAT MOVES YOUR HAND</Pill>
      {f>=at(M,21.82) && <Title size={130} color={C.yellow} delay={at(M,21.82)}>MOTOR CORTEX</Title>}
      {f>=at(M,22.84) && f<at(M,24.6) && <Row at={at(M,22.84)} c={C.red} size={60}>controls the OPPOSITE side</Row>}
      {f>=at(M,24.6) && <Pill at={at(M,24.62)} bg={C.yellow} size={50}>SAVE: right brain ↔ left hand</Pill>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 4: Godlee, Lister's nephew (real photos)
const Godlee = () => {
  const K='godlee'; const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[16,1,50,45],[at(K,29.8),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:18}}>
      <Title size={150} color={C.orange}>25 NOV 1884</Title>
      <div style={{position:'relative',width:1000,height:900}}>
        <div style={{position:'absolute',left:60,top:10}}><Photo src="godlee_photo.jpg" w={540} h={640} at={at(K,26.2)} rot={-3} label="Rickman Godlee" credit="surgeon · Wellcome Collection · CC BY 4.0" pos="50% 20%"/></div>
        {f>=at(K,28.84) && <div style={{position:'absolute',left:600,top:200}}><Photo src="lister1902.jpg" w={340} h={380} at={at(K,28.84)} rot={4} label="his uncle: Lister" credit="Joseph Lister, 1902 · public domain" pos="50% 25%"/></div>}
      </div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 5: opened right there, walnut-sized glioma (c4 second half)
const Walnut = () => {
  const W='walnut'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c4.mp4" dur={33.35-29.85} start={5.2}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:20}}>
      <Pill at={at(W,29.98)} bg={C.red} color="#fff" size={58}>HE OPENED RIGHT THERE</Pill>
      {f>=at(W,31.4) && <Title size={150} color={C.yellow} delay={at(W,31.4)}>GLIOMA</Title>}
      {f>=at(W,32.6) && <Pill at={at(W,32.62)} bg={C.text} size={58} rot={-2}>SIZE OF A WALNUT</Pill>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 6: worked… 28 days later, infection (paper card, then c5)
const Twist = () => {
  const T='twist'; const f=useCurrentFrame(); const cut=at(T,34.9);
  return (<AbsoluteFill>
    {f>=cut && (HAS5 ? <Sequence from={cut}><Clip src="c5.mp4" dur={38.6-34.9} start={3} dark={0.25}/></Sequence> : <Sequence from={cut}><Still src="kf7.jpg" dur={120} dark={0.25}/></Sequence>)}
    {f<cut && <Particles/>}
    <Fade a={0} b={cut+3} style={{paddingTop:220,gap:26}}>
      <div style={{opacity:ease(f,0,12),transform:`perspective(1400px) rotateX(${(1-ease(f,0,14))*50}deg) rotate(-1.5deg)`,width:880,background:'#f4f1ea',borderRadius:8,padding:'24px 36px 20px',boxShadow:'0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>J NEUROSURG · 1984 · 61(5) · 809–813</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>The first primary brain-tumor operation</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:'#333',marginTop:10}}>Kirkpatrick DB</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:'#6b6b6b',marginTop:6}}>doi:10.3171/jns.1984.61.5.0809</div>
      </div>
      <Row at={at(T,34.06)} c={C.green} size={60}>✓ the surgery worked</Row>
    </Fade>
    {f>=at(T,35.0) && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:40}}>
      <NumCard at={at(T,35.04)} num="28 DAYS" unit="later" c={C.orange}/>
      {f>=at(T,36.7) && <Stamp at={at(T,36.72)} c={C.red} size={92}>INFECTION</Stamp>}
      {f>=at(T,37.6) && <Pill at={at(T,37.62)} bg={C.text} size={54}>MENINGITIS</Pill>}
    </AbsoluteFill>}
  </AbsoluteFill>);
};
// ---------- scene 7: share + question
const Ask = () => {
  const A='ask';
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[at(A,43.3),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:36}}>
      <Pill at={2} bg={C.green} color="#fff" size={46}>SEND TO THE FRIEND WHO TRUSTS GOOGLE</Pill>
      <QCard at={at(A,38.9)} q="Who do you trust more?" o1="1 = EYES" o2="2 = MACHINE" sub="comment 1 or 2"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={at(A,39.2)}/><StickDoc pose="think" mood="flat" size={280} delay={at(A,39.1)}/></div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 8: end card over c6 (pull back to the head = loop)
const End = () => {
  const f=useCurrentFrame(); const E='end';
  return (<AbsoluteFill>
    {HAS6 ? <Clip src="c6.mp4" dur={49.5-43.3} dark={0.55}/> : <Still src="kf1b.jpg" dur={190} dark={0.55}/>}
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Flip at={2}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={74} color={C.orange} delay={8}>one brain story at a time</Label>
      <Title size={110} color={C.yellow} delay={at(E,47.82)}>eyes… or machine?</Title>
      <StickDoc pose="wave" mood="smile" size={240} delay={10}/>
      <div style={{textAlign:'center',padding:'0 70px',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.text}}>Sources: Kirkpatrick DB. The first primary brain-tumor operation. J Neurosurg 1984;61(5):809–13 · doi:10.3171/jns.1984.61.5.0809 · Wellcome Collection, “The mystery of the malignant brain” (T. Morris, 2019)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:19,color:C.mute,marginTop:6}}>Images: Rickman Godlee, Wellcome Collection, CC BY 4.0 · Joseph Lister 1902, public domain (Wikimedia Commons) · 3D zoom made with Google Gemini</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>);
};
const MAP: Record<string, React.FC> = {hook:Hook, signs:Signs, motor:Motor, godlee:Godlee, walnut:Walnut, twist:Twist, ask:Ask, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; soft?:boolean; children:React.ReactNode}> = ({dur, first, last, soft, children}) => {
  const f=useCurrentFrame();
  if(soft) return <AbsoluteFill>{children}</AbsoluteFill>;
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.06,1.2,'*1884*.'],[1.78,3.6,'No *scans*. No *X-rays*.'],[4.1,6.2,'Yet one doctor pointed at a *skull*'],[6.22,7.9,'and said… the tumour is *HERE*.'],
  [8.56,9.44,'Who do you trust *more*?'],[9.94,11.36,'*1*, a doctor’s *EYES*…'],[11.84,13.06,'*2*, the *machine*?'],
  [13.52,15.34,'A young man’s face kept *TWITCHING*…'],[15.64,16.54,'his hand *SHOOK*.'],[17.0,17.78,'One side *only*.'],[18.2,19.9,'Neurologist *Hughes Bennett* knew.'],
  [20.18,21.52,'The strip that moves your *hand*,'],[21.7,22.58,'the *MOTOR* cortex,'],[22.84,24.32,'controls the *OPPOSITE* side.'],[24.7,25.66,'*Save that* for your exam.'],
  [26.08,27.12,'*25 November*.'],[27.48,28.68,'Surgeon *Rickman Godlee*,'],[28.84,29.6,'*Lister’s* nephew,'],[29.98,30.92,'opened right *THERE*.'],[31.3,33.14,'A *glioma*, the size of a *WALNUT*.'],
  [33.48,34.38,'The surgery *worked*.'],[34.74,35.92,'But *28 days* later…'],[36.26,37.3,'he died of *INFECTION*.'],[37.62,38.32,'*Meningitis*.'],
  [38.8,41.3,'Send this to the friend who trusts *Google* over doctors.'],[41.72,43.06,'So… *1 or 2*?'],[43.44,45.7,'*Dr. Mot*, one brain story at a time…'],[46.0,47.28,'because the real question is…'],[47.82,49.06,'*eyes*, or *machine*?'],
];
const Captions: React.FC = () => {
  const f=useCurrentFrame(); const t=f/S; const {fps}=useVideoConfig();
  const i=CAPS.findIndex(([a,b])=>t>=a-0.05&&t<=b+0.2); if(i<0) return null;
  const [a,b,txt]=CAPS[i]; const words=txt.split(' ');
  const shown=Math.max(1,Math.ceil(words.length*Math.min(1,(t-a)/Math.max(0.3,(b-a)*0.85))));
  const pop=spring({frame:f-Math.round(a*S),fps,config:{damping:11,mass:0.5}});
  return (<div style={{position:'absolute',left:60,right:60,top:1420,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 18px',transform:`scale(${0.85+0.15*pop})`}}>
    {(()=>{let on=false; return words.map((w,j)=>{const st=w.replace(/^[“"]/,'').startsWith('*'); if(st) on=true; const key=on; if(w.replace(/[.,…?!:”"]+$/,'').endsWith('*')) on=false; const clean=w.replace(/\*/g,''); return (
      <span key={j} style={{fontFamily:HEAD,fontWeight:900,fontSize:74,lineHeight:1.08,textTransform:'uppercase',color:key?C.yellow:'#fff',
        WebkitTextStroke:'12px #000',paintOrder:'stroke fill',opacity:j<shown?1:0,transform:`translateY(${j===shown-1?-4:0}px)`}}>{clean}</span>);});})()}
  </div>);
};
export const Video: React.FC = () => {
  const f=useCurrentFrame(); const t=(f-COVER)/S;
  const loop=interpolate(f,[TOTAL-9,TOTAL-2],[0,1],cl);
  const capO=1-interpolate(f,[TOTAL-14,TOTAL-9],[0,1],cl);
  const white=false; const mute=C.mute;
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <Sequence from={0} durationInFrames={COVER}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></Sequence>
    <Sequence from={COVER}>
      <Audio src={staticFile('voice.mp3')}/>
      <Audio src={staticFile('sfx.wav')} volume={0.35}/>
      {(t>=25.95&&t<29.85)||(t>=38.6&&t<43.3) ? <Particles/> : null}
      {scenes.map((s,i)=>{const from=Math.round(s.a*S), dur=Math.round((s.b-s.a)*S); const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1} soft={i<3}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,background:white?'rgba(255,255,255,.8)':'transparent',fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #9</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1884</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
