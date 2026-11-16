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
// voice: take 1 (2026-11-16), 47.96 s. Times are voice seconds from silencedetect.
const scenes = [
  {id:'zoom', a:0, b:21.70},{id:'paper', a:21.70, b:29.68},{id:'catch', a:29.68, b:36.04},{id:'signs', a:36.04, b:44.26},{id:'end', a:44.26, b:48.40},
];
export const TOTAL = COVER + Math.round(48.40*S);
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
const QCard: React.FC<{at:number; q:string}> = ({at,q}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 44px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:C.yellow}}>{q}</div>
    <div style={{display:'flex',gap:22,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff',background:C.green,padding:'6px 34px',borderRadius:14}}>1 = YES</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff',background:C.red,padding:'6px 34px',borderRadius:14}}>2 = NOT SURE</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:C.text,marginTop:14}}>comment below</div>
  </div></Flip>);

// ---------- scene 1: the Gemini zoom, skull to synapse
const AiTag = () => <div style={{position:'absolute',right:40,top:1300,fontFamily:BODY,fontWeight:600,fontSize:22,color:'#fff',background:'rgba(0,0,0,.55)',padding:'2px 10px',borderRadius:6}}>AI animation</div>;
const Clip: React.FC<{src:string; dur:number}> = ({src,dur}) =>
  <AbsoluteFill><OffthreadVideo muted src={staticFile(src)} playbackRate={10.0/dur} style={{width:1080,height:1920,objectFit:'cover'}}/></AbsoluteFill>;
const Zoom = () => {
  const f=useCurrentFrame(); const Z='zoom';
  const t1=at(Z,7.24), t2=at(Z,13.79), t3=at(Z,19.26);
  const dark=ease(f,at(Z,19.9),at(Z,21.4));
  return (<AbsoluteFill>
    <Sequence from={0} durationInFrames={t1}><Clip src="c1.mp4" dur={7.24}/></Sequence>
    <Sequence from={t1} durationInFrames={t2-t1}><Clip src="c2.mp4" dur={13.79-7.24}/></Sequence>
    <Sequence from={t2} durationInFrames={t3-t2}><Clip src="c3.mp4" dur={19.26-13.79}/></Sequence>
    {f>=t3 && <AbsoluteFill><Img src={staticFile('c3_last.jpg')} style={{width:1080,height:1920,objectFit:'cover',filter:`brightness(${1-0.92*dark}) saturate(${1-dark})`,transform:`scale(${1+0.05*ease(f,t3,t3+70)})`}}/></AbsoluteFill>}
    <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,.6) 100%)'}}/>
    <AiTag/>
    {/* hook */}
    {f<at(Z,7.1) && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:22,opacity:1-ease(f,at(Z,6.9),at(Z,7.2))}}>
      <Pill at={6} bg={C.green} color="#fff" size={64}>HEALTHY BRAIN</Pill>
      <Pill at={at(Z,4.1)} bg={C.red} color="#fff" size={64} rot={-3}>ARTERY BLOCKED</Pill>
      <Label size={50} delay={at(Z,5.4)} color={C.text}>every minute without blood flow…</Label>
    </AbsoluteFill>}
    {/* neurons */}
    {f>=at(Z,7.6) && f<at(Z,13.7) && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:1-ease(f,at(Z,13.4),at(Z,13.7))}}>
      <NumCard at={at(Z,8.0)} num="1.9 MILLION" unit="neurons lost · per minute" c={C.orange}/>
      <Pill at={at(Z,10.85)} bg={C.yellow} size={56}>ONE MINUTE</Pill>
    </AbsoluteFill>}
    {f>=at(Z,11.95) && f<at(Z,13.7) && <div style={{position:'absolute',left:620,top:880,opacity:1-ease(f,at(Z,13.4),at(Z,13.7))}}>
      <div style={{position:'absolute',left:-250,top:-90,opacity:ease(f,at(Z,12.2),at(Z,12.5)),background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:50,padding:'10px 24px',borderRadius:24,whiteSpace:'nowrap',boxShadow:'0 8px 0 #0B0B0E'}}>my coffee takes longer</div>
      <StickDoc pose="hold" mood="smile" size={300} delay={at(Z,11.95)}/>
    </div>}
    {/* synapse */}
    {f>=at(Z,16.9) && f<at(Z,19.2) && <AbsoluteFill style={{alignItems:'center',paddingTop:250,opacity:1-ease(f,at(Z,18.9),at(Z,19.2))}}>
      <Pill at={at(Z,16.94)} bg={C.yellow} size={70}>SYNAPSE ↓</Pill>
    </AbsoluteFill>}
    {f>=at(Z,19.26) && <AbsoluteFill style={{alignItems:'center',paddingTop:230}}>
      <NumCard at={at(Z,19.4)} num="14 BILLION" unit="synapses lost · per minute" c={C.red}/>
    </AbsoluteFill>}
  </AbsoluteFill>);
};

// ---------- scene 2: the paper (recreated title card, journal is not open access)
const Paper = () => {
  const f=useCurrentFrame(); const P='paper';
  return (<Cam keys={[[0,1.08,50,45],[24,1,50,45],[at(P,24.68),1.03,50,48],[at(P,24.9),1,50,45],[at(P,29.6),1.05,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:30}}>
      <Pill at={2} bg={C.orange} color="#fff" size={54}>THE PAPER</Pill>
      <div style={{opacity:ease(f,4,16),transform:`perspective(1400px) rotateX(${(1-ease(f,4,18))*50}deg) rotate(-1.5deg)`,width:860,background:'#f4f1ea',borderRadius:8,padding:'34px 44px 30px',boxShadow:'0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:'#8a1c25',letterSpacing:2}}>STROKE · 2006 · VOL 37, ISSUE 1 · PAGES 263–266</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:96,lineHeight:0.95,color:'#1A1B20',marginTop:12}}>Time Is Brain —<br/>Quantified</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:36,color:'#333',marginTop:14}}>Jeffrey L. Saver, MD</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:'#6b6b6b',marginTop:4}}>UCLA Stroke Center, Los Angeles</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:'#6b6b6b',marginTop:10}}>doi:10.1161/01.STR.0000196957.55928.ab</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16,width:860,marginTop:6}}>
        <Row at={at(P,22.6)} c={C.orange}>1.9 million neurons · per minute</Row>
        <Row at={at(P,23.2)} c={C.red}>14 billion synapses · per minute</Row>
        <Row at={at(P,26.4)} c={C.yellow}>brain ages 3.6 years · per HOUR</Row>
      </div>
      <Label size={34} delay={at(P,24.7)}>typical large-artery stroke, no treatment</Label>
    </AbsoluteFill>
  </Cam>);
};

// ---------- scene 3: the catch, big vs small stroke (real scans)
const Catch = () => {
  const f=useCurrentFrame(); const K='catch';
  return (<Cam keys={[[0,1.1,50,45],[14,1,50,45],[at(K,32.7),1.04,50,45],[at(K,32.9),1,50,45],[at(K,36),1.05,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:26}}>
      <Title size={120} color={C.orange}>The catch</Title>
      <Pill at={at(K,30.9)} bg={C.yellow} size={56}>those numbers = an AVERAGE</Pill>
      <div style={{display:'flex',gap:26,alignItems:'flex-start',marginTop:10}}>
        <Photo src="ct_mca.jpg" w={480} h={560} at={at(K,30.6)} rot={-2} label="big-artery stroke" credit="CT · Lucien Monfils · CC BY-SA 4.0" pos="50% 50%"/>
        <Photo src="lacunar.jpg" w={480} h={560} at={at(K,32.7)} rot={2} label="small stroke" credit="MRI · Ptrump16 · CC BY-SA 4.0" pos="58% 44%"/>
      </div>
    </AbsoluteFill>
    {f>=at(K,32.7) && <div style={{position:'absolute',left:650,top:560,opacity:ease(f,at(K,33.1),at(K,33.4))}}><Pill at={at(K,33.1)} bg={C.green} color="#fff" size={44}>loses less</Pill></div>}
    {f>=at(K,34.3) && <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}><Stamp at={at(K,34.41)} c={C.red} size={96}>CLOCK STILL<br/>RUNNING</Stamp></AbsoluteFill>}
  </Cam>);
};

// ---------- scene 4: know the signs (FDA, public domain)
const Signs = () => {
  const f=useCurrentFrame(); const G='signs';
  const a=f<at(G,40.75), b=f>=at(G,40.6);
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[at(G,39.84),1.06,50,45],[at(G,40.1),1,50,45],[at(G,44.2),1.04,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:24,opacity:1-ease(f,at(G,40.5),at(G,40.75))}}>
      <Title size={104}>Know the <span style={{color:C.orange}}>signs</span></Title>
      <Photo src="fast.jpg" w={700} h={860} at={4} rot={-1.5} label="F.A.S.T." credit="U.S. FDA · public domain · call your local emergency number" pos="50% 50%" fit="contain"/>
    </AbsoluteFill>}
    {f>=at(G,39.7) && a && <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}><Stamp at={at(G,39.84)} size={150}>DON’T WAIT</Stamp></AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:40,opacity:ease(f,at(G,40.6),at(G,40.85))}}>
      <QCard at={at(G,40.84)} q="Would you know the signs?"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={at(G,41.2)}/><StickDoc pose="think" mood="flat" size={280} delay={at(G,41.0)}/></div>
    </AbsoluteFill>}
  </Cam>);
};

// ---------- scene 5: end card
const End = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[24,1,50,45],[120,1.06,50,42]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Flip at={2}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={78} color={C.orange} delay={8}>one paper a day</Label>
      <Title size={96} color={C.yellow} delay={at('end',46.4)}>time is brain</Title>
      <StickDoc pose="wave" mood="smile" size={300} delay={10}/>
      <div style={{textAlign:'center',padding:'0 70px',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:23,color:C.text}}>Source: Saver JL. Time is brain—quantified. Stroke 2006;37(1):263–266 · doi:10.1161/01.STR.0000196957.55928.ab</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.mute,marginTop:6}}>Images: Wikimedia Commons (CT: Lucien Monfils, CC BY-SA 4.0 · MRI: Ptrump16, CC BY-SA 4.0 · F.A.S.T.: U.S. FDA, public domain) · 3D zoom: AI animation</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {zoom:Zoom, paper:Paper, catch:Catch, signs:Signs, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.03,1.79,'This is a *HEALTHY* brain.'],[2.20,5.06,'Now imagine one of its arteries just got *BLOCKED*.'],
  [5.41,6.93,'Every minute without blood flow…'],[7.24,10.53,'this cortex loses *1.9 MILLION* neurons.'],[10.85,11.52,'*One minute*.'],[11.95,13.40,'That’s shorter than my morning *COFFEE*.'],
  [13.79,15.30,'And every neuron talks through'],[15.30,16.63,'tiny *junctions* like this one.'],[16.94,17.67,'*Synapses*.'],[18.09,18.92,'In that same minute…'],[19.26,21.37,'*14 BILLION* of them go *dark*.'],
  [21.70,24.24,'That’s from *Saver’s 2006* paper in *Stroke*.'],[24.68,27.86,'Without treatment, the brain ages about *3.6 years*…'],[28.09,29.26,'every single *HOUR*.'],
  [29.68,30.25,'The *catch*?'],[30.52,32.36,'It’s an *AVERAGE* for a big-artery stroke.'],[32.72,33.99,'Small strokes lose *less*.'],[34.41,35.69,'But the clock is still *running*.'],
  [36.04,38.53,'So if a face *droops*, or speech *slurs*…'],[38.80,39.42,'call for *help*.'],[39.84,40.43,'Don’t *WAIT*.'],[40.84,41.78,'Would you know the *signs*?'],[42.10,43.81,'*1* for yes, *2* for not sure.'],
  [44.26,45.99,'*Dr. Mot*, one paper a day…'],[46.34,47.67,'because *time is brain*.'],
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
  const f=useCurrentFrame();
  const loop=interpolate(f,[TOTAL-9,TOTAL-2],[0,1],cl);
  const capO=1-interpolate(f,[TOTAL-14,TOTAL-9],[0,1],cl);
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <Sequence from={0} durationInFrames={COVER}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></Sequence>
    <Sequence from={COVER}>
      <Audio src={staticFile('voice.mp3')}/>
      <Audio src={staticFile('sfx.wav')} volume={0.35}/>
      {f-COVER>=Math.round(21.7*S) && <Particles/>}
      {scenes.map((s,i)=>{const from=Math.round(s.a*S), dur=Math.round((s.b-s.a)*S); const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>STROKE · 2006</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
