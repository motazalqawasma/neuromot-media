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
// voice: take 2 (2026-11-22 STEP 1), 49.5 s. Times = ElevenLabs Scribe word timestamps (2026-11-23).
const scenes = [
  {id:'hook', a:0, b:10.55},{id:'dandy', a:10.55, b:17.55},{id:'air', a:17.55, b:24.6},{id:'dark', a:24.6, b:30.7},{id:'proof', a:30.7, b:35.3},{id:'catch', a:35.3, b:41.0},{id:'ask', a:41.0, b:44.95},{id:'end', a:44.95, b:49.6},
];
export const TOTAL = COVER + Math.round(49.6*S);
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
const LEN:Record<string,number>={'c1.mp4':10.56,'c2.mp4':10.43,'c3.mp4':10.53,'c4.mp4':10.33,'c5.mp4':10.1,'c6.mp4':10.0};
const HAS6 = false;
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

// ---------- scene 1: 1918, air in the brain, the question (c1: glass head, ventricles light up)
const Hook = () => {
  const X='hook'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c1.mp4" dur={10.55}/><Shade/>
    <Fade a={0} b={at(X,6.15)} style={{paddingTop:220,gap:10}}>
      <Title size={210} color={C.text}>1918.</Title>
      {f>=at(X,1.86) && <Label size={60} color={C.text} delay={at(X,1.86)}>to see a brain on an X-ray…</Label>}
      {f>=at(X,4.7) && <Title size={150} color={C.orange} delay={at(X,4.7)}>AIR.</Title>}
      {f>=at(X,5.12) && <Title size={130} color={C.orange} delay={at(X,5.12)}>IN THE BRAIN.</Title>}
    </Fade>
    <Fade a={at(X,6.2)} b={at(X,10.55)+4} style={{paddingTop:330}}>
      <QCard at={at(X,6.24)} q="Which matters more?" o1="1 = X-RAY" o2="2 = MRI" sub="comment 1 or 2"/>
    </Fade>
  </AbsoluteFill>);
};
// ---------- scene 2: Walter Dandy (real photo), gray fog
const Dandy = () => {
  const K='dandy'; const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[16,1,50,45],[at(K,17.5),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:18}}>
      {f<at(K,13.9) ? <Title size={130} color={C.orange}>WALTER DANDY</Title> : <Title size={130} color={C.mute} delay={at(K,13.9)}>BRAIN = GRAY FOG</Title>}
      <div style={{position:'relative',width:1000,height:900}}>
        <div style={{position:'absolute',left:200,top:10}}><Photo src="dandy_portrait2_crop.jpg" w={600} h={680} at={at(K,10.74)} rot={-2} label="Johns Hopkins" credit="Walter E. Dandy · Ericneuro, CC BY-SA 4.0 (Wikimedia Commons)" pos="50% 25%"/></div>
        {f>=at(K,14.2) && <AbsoluteFill style={{background:`rgba(150,152,160,${0.55*ease(f,at(K,14.2),at(K,15.6))})`,filter:'blur(30px)'}}/>}
        {f>=at(K,16.64) && <div style={{position:'absolute',left:0,right:0,top:330,display:'flex',justifyContent:'center'}}><Stamp at={at(K,16.64)} c={C.red} size={110}>TUMOURS HID</Stamp></div>}
      </div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 3: free air -> drain the fluid, put air in (c2)
const Air = () => {
  const G='air'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c2.mp4" dur={24.6-17.55}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:22}}>
      <Pill at={at(G,18.48)} bg={C.text} size={58} rot={-2}>FREE AIR SHOWS CLEARLY</Pill>
      {f>=at(G,21.3) && <Pill at={at(G,21.3)} bg={C.blue} color="#fff" size={60} rot={2}>DRAIN THE FLUID</Pill>}
      {f>=at(G,22.64) && <Title size={110} color={C.yellow} delay={at(G,22.64)}>VENTRICLES</Title>}
      {f>=at(G,23.62) && <Pill at={at(G,23.62)} bg={C.orange} color="#fff" size={64} rot={-1}>PUT AIR IN</Pill>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 4: air shows dark, tumour bends them (c3), save: negative contrast
const Dark = () => {
  const M='dark'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c3.mp4" dur={30.7-24.6}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:22}}>
      <Title size={150} color={C.text} delay={at(M,24.78)}>AIR = DARK</Title>
      {f>=at(M,26.62) && <Row at={at(M,26.62)} c={C.red} size={60}>a tumour bends them → ADDRESS</Row>}
    </AbsoluteFill>
    {f>=at(M,28.68) && <AbsoluteFill style={{alignItems:'center',paddingTop:1150}}><Pill at={at(M,28.68)} bg={C.yellow} size={58}>SAVE: NEGATIVE CONTRAST</Pill></AbsoluteFill>}
  </AbsoluteFill>);
};
// ---------- scene 5: paper card + Dandy's own 1919 film, until CT 1970s (kf7)
const Proof = () => {
  const T='proof'; const f=useCurrentFrame(); const cut=at(T,33.4);
  return (<AbsoluteFill>
    {f>=cut && <Sequence from={cut}><Clip src="c5.mp4" dur={35.3-33.4} start={7.6} dark={0.3}/></Sequence>}
    {f<cut && <Particles/>}
    <Fade a={0} b={cut+3} style={{paddingTop:200,gap:22}}>
      <div style={{opacity:ease(f,0,12),transform:`perspective(1400px) rotateX(${(1-ease(f,0,14))*50}deg) rotate(-1.5deg)`,width:900,background:'#f4f1ea',borderRadius:8,padding:'22px 36px 18px',boxShadow:'0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>ANNALS OF SURGERY · 1918 · 68(1) · 5–11</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>Ventriculography following the injection of air into the cerebral ventricles</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:'#333',marginTop:8}}>Dandy WE</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:'#6b6b6b',marginTop:4}}>doi:10.1097/00000658-191807000-00002</div>
      </div>
      <Photo src="dandy1919_pneumoencephalogram.jpg" w={520} h={470} at={8} rot={2} label="his 1919 X-ray" credit="Dandy, Ann Surg 1919 · public domain" fit="cover"/>
    </Fade>
    {f>=cut && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30}}>
      <Label size={64} color={C.text} delay={cut}>the main way… until</Label>
      <NumCard at={cut+4} num="CT" unit="1970s" c={C.orange}/>
    </AbsoluteFill>}
  </AbsoluteFill>);
};
// ---------- scene 6: the catch (kf5: 1918 X-ray room)
const Catch = () => {
  const T='catch'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c4.mp4" dur={41.0-35.3} start={2} dark={0.35}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:28}}>
      <Title size={140} color={C.orange} delay={at(T,35.5)}>THE CATCH?</Title>
      {f>=at(T,36.32) && <Pill at={at(T,36.32)} bg={C.red} color="#fff" size={64} rot={-2}>AWFUL HEADACHES</Pill>}
      {f>=at(T,37.52) && <Pill at={at(T,37.52)} bg={C.text} size={64} rot={2}>VOMITING</Pill>}
      {f>=at(T,39.24) && <div style={{marginTop:20}}><Stamp at={at(T,39.24)} c={C.yellow} size={88}>UPSIDE DOWN<br/>IN A CHAIR</Stamp></div>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 7: share + question
const Ask = () => {
  const A='ask';
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[at(A,44.95),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:36}}>
      <Pill at={2} bg={C.green} color="#fff" size={46}>SEND TO THE FRIEND WHO HATES MRI NOISE</Pill>
      <QCard at={at(A,41.3)} q="Which matters more?" o1="1 = X-RAY" o2="2 = MRI" sub="comment 1 or 2"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={at(A,41.6)}/><StickDoc pose="think" mood="flat" size={280} delay={at(A,41.5)}/></div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 8: end card over kf6 (glass plate on the light box) -> loop
const End = () => {
  const f=useCurrentFrame(); const E='end';
  return (<AbsoluteFill>
    {HAS6 ? <Clip src="c6.mp4" dur={49.6-44.95} start={4} dark={0.6}/> : <Still src="kf6.jpg" dur={150} z0={1} z1={1.08} dark={0.6}/>}
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Flip at={2}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={74} color={C.orange} delay={8}>one brain story at a time</Label>
      <Title size={110} color={C.yellow} delay={at(E,48.1)}>X-ray… or MRI?</Title>
      <StickDoc pose="wave" mood="smile" size={240} delay={10}/>
      <div style={{textAlign:'center',padding:'0 70px',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.text}}>Sources: Dandy WE. Ventriculography following the injection of air into the cerebral ventricles. Ann Surg 1918;68(1):5–11 · doi:10.1097/00000658-191807000-00002 · Dandy WE. Röntgenography of the brain after the injection of air into the spinal canal. Ann Surg 1919;70(4):397–403</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:19,color:C.mute,marginTop:6}}>Images: Walter Dandy, Ericneuro, CC BY-SA 4.0 · Dandy 1919 X-ray, public domain (Wikimedia Commons) · 3D zoom made with Google Gemini</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>);
};
const MAP: Record<string, React.FC> = {hook:Hook, dandy:Dandy, air:Air, dark:Dark, proof:Proof, catch:Catch, ask:Ask, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; soft?:boolean; children:React.ReactNode}> = ({dur, first, last, soft, children}) => {
  const f=useCurrentFrame();
  if(soft) return <AbsoluteFill>{children}</AbsoluteFill>;
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.18,1.26,'*1918*.'],[1.86,3.52,'To see a brain on an *X-ray*…'],[4.06,5.78,'one surgeon pumped *AIR* into it.'],
  [6.24,7.06,'Which matters *more*?'],[7.54,8.62,'*1*, the *X-ray*…'],[9.1,10.28,'*2*, the *MRI*?'],
  [10.74,12.56,'*Walter Dandy*, Johns Hopkins.'],[12.94,13.5,'His *problem*?'],[13.9,16.26,'On an X-ray, the brain is gray *FOG*.'],[16.64,17.4,'Tumours *hid*.'],
  [17.7,20.64,'But he’d seen free *AIR* show up clearly on X-rays.'],[21.0,23.22,'So he drained the fluid from the *ventricles*…'],[23.46,24.32,'and put *air* in.'],
  [24.78,25.88,'Air shows *DARK*.'],[26.28,28.3,'Now a tumour bending them had an *ADDRESS*.'],[28.68,30.52,'Save that: *negative contrast*.'],
  [30.86,32.96,'It stayed the *main way* to find brain lesions…'],[33.14,35.14,'until *CT*, in the *1970s*.'],
  [35.46,35.92,'The *catch*?'],[36.32,37.98,'Awful *HEADACHES*, vomiting…'],[38.36,40.84,'and some patients were turned *UPSIDE DOWN* in a chair.'],
  [41.28,43.54,'Send this to the friend who hates *MRI noise*.'],[44.08,44.78,'*1 or 2*?'],[45.22,47.52,'*Dr. Mot*, one brain story at a time…'],[48.1,49.28,'*X-ray*, or *MRI*?'],
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
      {(t>=10.55&&t<17.55)||(t>=41.0&&t<44.95) ? <Particles/> : null}
      {scenes.map((s,i)=>{const from=Math.round(s.a*S), dur=Math.round((s.b-s.a)*S); const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1} soft={i===0||i===2||i===3}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,background:white?'rgba(255,255,255,.8)':'transparent',fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #10</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1918</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
