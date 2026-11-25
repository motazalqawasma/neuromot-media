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
// voice: take 1 (2026-11-24 STEP 1), 49.3 s. Times = ElevenLabs Scribe word timestamps (2026-11-23).
const scenes = [
  {id:'hook', a:0, b:9.9},{id:'moniz', a:9.9, b:14.55},{id:'neck', a:14.55, b:17.75},{id:'fail', a:17.75, b:20.6},{id:'white', a:20.6, b:26.5},{id:'tumor', a:26.5, b:32.25},{id:'nomin', a:32.25, b:35.6},{id:'twist', a:35.6, b:39.45},{id:'ask', a:39.45, b:46.45},{id:'end', a:46.45, b:49.4},
];
export const TOTAL = COVER + Math.round(49.4*S);
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
const LEN:Record<string,number>={'c1.mp4':10.29,'c2.mp4':11.2,'c3.mp4':10.16};
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


// ---------- scene 1: 1927, dye in the brain, Nobel tease. Picture change every ~2 s.
const Hook = () => {
  const X='hook'; const f=useCurrentFrame();
  const p1=at(X,2.0), p2=at(X,3.86), p3=at(X,6.2);
  return (<AbsoluteFill>
    {f<p1 && <Clip src="c1.mp4" dur={2.0}/>}
    {f>=p1&&f<p2 && <Sequence from={p1}><Clip src="c2.mp4" dur={1.86} start={6.5}/></Sequence>}
    {f>=p2&&f<p3 && <Sequence from={p2}><Clip src="c1.mp4" dur={2.34} start={5.5}/></Sequence>}
    {f>=p3 && <Sequence from={p3}><Still src="kf7.jpg" dur={120} z0={1.12} z1={1.0}/></Sequence>}
    <Shade/>
    <Fade a={0} b={p3+3} style={{paddingTop:220,gap:10}}>
      <Title size={200} color={C.text}>1927.</Title>
      <Title size={150} color={C.orange} delay={4}>DYE.</Title>
      <Title size={120} color={C.orange} delay={8}>IN THE BRAIN.</Title>
      {f>=at(X,2.0) && <Pill at={at(X,2.0)} bg={C.text} size={54} rot={-2}>to see the arteries</Pill>}
    </Fade>
    {f>=p3 && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24}}>
      <Title size={140} color={C.yellow} delay={p3}>A NOBEL…</Title>
      {f>=at(X,7.9) && <Title size={110} color={C.text} delay={at(X,7.9)}>FOR SOMETHING ELSE</Title>}
      {f>=at(X,8.98) && <div style={{marginTop:30}}><Pill at={at(X,8.98)} bg={C.red} color="#fff" size={64} rot={-3}>WAIT FOR IT</Pill></div>}
    </AbsoluteFill>}
  </AbsoluteFill>);
};
// ---------- scene 2: Egas Moniz, Lisbon (real photo). Vessels invisible on X-ray
const Moniz = () => {
  const K='moniz'; const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[16,1,50,45],[at(K,14.5),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:18}}>
      {f<at(K,11.9) ? <Title size={130} color={C.orange}>EGAS MONIZ</Title> : <Title size={120} color={C.mute} delay={at(K,11.9)}>VESSELS = INVISIBLE</Title>}
      <div style={{position:'relative',width:1000,height:900}}>
        <div style={{position:'absolute',left:170,top:10}}><Photo src="moniz_office_1918.png" w={660} h={640} at={4} rot={-2} label="Lisbon, 1918" credit="Egas Moniz in his office · public domain (Wikimedia Commons)" pos="50% 30%"/></div>
        {f>=at(K,12.4) && <AbsoluteFill style={{background:`rgba(150,152,160,${0.5*ease(f,at(K,12.4),at(K,13.6))})`,filter:'blur(30px)'}}/>}
        {f>=at(K,13.66) && <div style={{position:'absolute',left:0,right:0,top:330,display:'flex',justifyContent:'center'}}><Stamp at={at(K,13.66)} c={C.red} size={100}>ON AN X-RAY</Stamp></div>}
      </div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 3: the big artery in the neck (c1 tail: dye rises in the neck)
const Neck = () => {
  const G='neck'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c1.mp4" dur={17.75-14.55} start={3.2}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:22}}>
      <Pill at={at(G,15.5)} bg={C.text} size={60} rot={-2}>THE BIG ARTERY IN THE NECK</Pill>
      {f>=at(G,16.96) && <Title size={150} color={C.yellow} delay={at(G,16.96)}>CAROTID</Title>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 4: first tries failed, one patient died (kf5: empty 1920s X-ray room)
const Fail = () => {
  const T='fail'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Still src="kf5.jpg" dur={90} z0={1} z1={1.1} dark={0.35}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:40}}>
      <Title size={130} color={C.text} delay={at(T,17.86)}>FIRST TRIES</Title>
      {f>=at(T,18.52) && <Title size={150} color={C.orange} delay={at(T,18.52)}>FAILED</Title>}
      {f>=at(T,19.88) && <div style={{marginTop:30}}><Stamp at={at(T,19.88)} c={C.red} size={96}>1 PATIENT DIED</Stamp></div>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 5: sodium iodide, arteries light up white (c2)
const White = () => {
  const W='white'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Clip src="c2.mp4" dur={26.5-20.6}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:22}}>
      <Pill at={at(W,21.6)} bg={C.blue} color="#fff" size={64} rot={-2}>SODIUM IODIDE</Pill>
      {f>=at(W,23.68) && <Title size={140} color={C.text} delay={at(W,23.68)}>LIT UP WHITE</Title>}
      {f>=at(W,25.04) && <Pill at={at(W,25.04)} bg={C.yellow} size={60} rot={2}>A ROADMAP OF THE BRAIN</Pill>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 6: a tumour pushes a vessel aside (c3) -> real angiogram, save: angiography
const Tumor = () => {
  const M='tumor'; const f=useCurrentFrame(); const cut=at(M,30.2);
  return (<AbsoluteFill>
    {f<cut ? <><Clip src="c3.mp4" dur={30.2-26.5}/><Shade/></> : <Particles/>}
    {f<cut && <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:22}}>
      <Row at={at(M,26.7)} c={C.red} size={62}>a TUMOUR pushing a vessel aside?</Row>
      {f>=at(M,28.8) && <Title size={130} color={C.yellow} delay={at(M,28.8)}>NOW YOU SEE IT</Title>}
    </AbsoluteFill>}
    {f>=cut && <AbsoluteFill style={{alignItems:'center',paddingTop:210,gap:26}}>
      <Pill at={cut} bg={C.yellow} size={62}>SAVE: ANGIOGRAPHY</Pill>
      <Photo src="angio_crop.jpg" w={760} h={700} at={cut+3} rot={2} label="a modern angiogram" credit="Right carotid angiogram · U2em, CC BY-SA 3.0 (Wikimedia Commons)" fit="cover"/>
    </AbsoluteFill>}
  </AbsoluteFill>);
};
// ---------- scene 7: nominated for a Nobel... passed over (paper card + Malhoa portrait)
const Nomin = () => {
  const T='nomin'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Particles/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:26}}>
      <div style={{opacity:ease(f,0,12),transform:`perspective(1400px) rotateX(${(1-ease(f,0,14))*50}deg) rotate(-1.5deg)`,width:900,background:'#f4f1ea',borderRadius:8,padding:'22px 36px 18px',boxShadow:'0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>REVUE NEUROLOGIQUE · PARIS · JULY 1927</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>L’encéphalographie artérielle, son importance dans la localisation des tumeurs cérébrales</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:'#333',marginTop:8}}>Moniz E</div>
      </div>
      <div style={{display:'flex',gap:30,alignItems:'center'}}>
        <Photo src="moniz_portrait.jpg" w={360} h={420} at={6} rot={-3} label="Egas Moniz" credit="public domain (Commons)" pos="50% 25%"/>
        <div style={{display:'flex',flexDirection:'column',gap:30,alignItems:'center'}}>
          {f>=at(T,32.66) && <Pill at={at(T,32.66)} bg={C.yellow} size={60}>NOMINATED: NOBEL</Pill>}
          {f>=at(T,34.68) && <Stamp at={at(T,34.68)} c={C.red} size={88}>PASSED<br/>OVER</Stamp>}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 8: 1949... the lobotomy (kf7: gold disc)
const Twist = () => {
  const T='twist'; const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Still src="kf7.jpg" dur={120} z0={1} z1={1.15} dark={0.25}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:30}}>
      <NumCard at={at(T,36.16)} num="1949" unit="NOBEL PRIZE" c={C.yellow}/>
      {f>=at(T,38.3) && <div style={{marginTop:40}}><Stamp at={at(T,38.3)} c={C.red} size={110}>FOR THE<br/>LOBOTOMY</Stamp></div>}
    </AbsoluteFill>
  </AbsoluteFill>);
};
// ---------- scene 9: share + question
const Ask = () => {
  const A='ask';
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[at(A,46.4),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:36}}>
      <Pill at={2} bg={C.green} color="#fff" size={46}>SEND TO THE FRIEND WHO LOVES A PLOT TWIST</Pill>
      <QCard at={at(A,42.04)} q="Take a Nobel back?" o1="1 = YES" o2="2 = NO" sub="comment 1 or 2"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={at(A,42.4)}/><StickDoc pose="think" mood="flat" size={280} delay={at(A,42.2)}/></div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 10: end card over kf6 (glass plate with white arteries) -> loop
const End = () => {
  const f=useCurrentFrame();
  return (<AbsoluteFill>
    <Still src="kf6.jpg" dur={100} z0={1} z1={1.08} dark={0.6}/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Flip at={2}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={74} color={C.orange} delay={8}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={240} delay={10}/>
      <div style={{textAlign:'center',padding:'0 70px',opacity:ease(f,12,22)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.text}}>Sources: Moniz E. L’encéphalographie artérielle… Rev Neurol (Paris) 1927 · Artico M et al. Egas Moniz: 90 years (1927–2017) from cerebral angiography. Front Neuroanat 2017;11:81 · doi:10.3389/fnana.2017.00081 · Ligon BL. Neurosurgery 1998;43(3):602–11 · nobelprize.org (1949)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:19,color:C.mute,marginTop:6}}>Images: Egas Moniz photos, public domain · angiogram U2em, CC BY-SA 3.0 (Wikimedia Commons) · 3D zoom made with Google Gemini</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>);
};
const MAP: Record<string, React.FC> = {hook:Hook, moniz:Moniz, neck:Neck, fail:Fail, white:White, tumor:Tumor, nomin:Nomin, twist:Twist, ask:Ask, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; soft?:boolean; children:React.ReactNode}> = ({dur, first, last, soft, children}) => {
  const f=useCurrentFrame();
  if(soft) return <AbsoluteFill>{children}</AbsoluteFill>;
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.12,1.42,'*1927*.'],[2.0,3.6,'To see the brain’s *arteries*…'],[3.86,5.9,'one doctor injected *DYE* into them.'],
  [6.22,7.6,'Later, he won a *Nobel*…'],[7.9,8.7,'for something *ELSE*.'],[8.98,9.6,'Wait for it.'],
  [9.96,11.5,'*Egas Moniz*, Lisbon.'],[11.9,14.3,'On an X-ray, brain vessels are *INVISIBLE*.'],
  [14.64,16.6,'So he went for the big artery in the *NECK*…'],[16.82,17.5,'the *carotid*.'],
  [17.86,18.9,'First tries *failed*.'],[19.24,20.3,'One patient *DIED*.'],[20.7,22.6,'Then he switched to *sodium iodide*…'],
  [22.86,24.6,'and the arteries lit up *WHITE*.'],[25.04,26.3,'A *roadmap* of the brain.'],[26.62,28.4,'A *tumour* pushing a vessel aside?'],
  [28.8,29.95,'Now you could *SEE* it.'],[30.3,32.1,'Save that word: *angiography*.'],
  [32.4,34.0,'He was *nominated* for a Nobel for it…'],[34.1,35.4,'and *passed over*.'],[35.72,37.2,'Then in *1949*…'],[37.4,39.2,'he won… for the *LOBOTOMY*.'],
  [39.56,41.7,'Send this to the friend who loves a *plot twist*.'],[42.04,43.9,'Should a Nobel ever be *taken back*?'],[44.34,45.2,'*1*, yes…'],[45.48,46.3,'*2*, no?'],
  [46.66,49.1,'*Dr. Mot*, one brain story at a time.'],
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
      {(t>=9.9&&t<14.55)||(t>=39.45&&t<46.45) ? <Particles/> : null}
      {scenes.map((s,i)=>{const from=Math.round(s.a*S), dur=Math.round((s.b-s.a)*S); const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1} soft={i===0||i===2||i===4||i===5}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,background:white?'rgba(255,255,255,.8)':'transparent',fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #11</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1927</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
