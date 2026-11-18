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
// voice: take 1 (2026-11-18 night), 59.2 s. Times = ElevenLabs Scribe word timestamps.
const scenes = [
  {id:'explode', a:0, b:12.5},{id:'layers', a:12.5, b:19.6},{id:'hero', a:19.6, b:26.1},{id:'patient', a:26.1, b:33.8},{id:'surgeon', a:33.8, b:41.95},{id:'back', a:41.95, b:49.25},{id:'ask', a:49.25, b:52.9},{id:'end', a:52.9, b:59.6},
];
export const TOTAL = COVER + Math.round(59.6*S);
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

// ---------- Gemini exploded-view clips (white studio)
const LEN:Record<string,number>={'c1.mp4':10.4,'c2.mp4':10.0,'c3.mp4':10.0};
const Clip: React.FC<{src:string; dur:number}> = ({src,dur}) =>
  <AbsoluteFill><OffthreadVideo muted src={staticFile(src)} playbackRate={(LEN[src]-0.15)/dur} style={{width:1080,height:1920,objectFit:'cover'}}/></AbsoluteFill>;
const Still: React.FC<{src:string; z0?:number; z1?:number; dur:number}> = ({src,z0=1,z1=1.04,dur}) => {
  const f=useCurrentFrame(); const z=interpolate(f,[0,dur],[z0,z1],cl);
  return <AbsoluteFill><Img src={staticFile(src)} style={{width:1080,height:1920,objectFit:'cover',transform:`scale(${z})`}}/></AbsoluteFill>;
};
const WShade = () => <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(26,27,32,.18) 0%, rgba(26,27,32,0) 12%, rgba(26,27,32,0) 70%, rgba(26,27,32,.22) 100%)'}}/>;
const Fade: React.FC<{a:number; b:number; children:React.ReactNode; style?:React.CSSProperties}> = ({a,b,children,style}) => {
  const f=useCurrentFrame(); if(f<a||f>b) return null;
  return <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:ease(f,a,a+6)*(1-ease(f,b-6,b)),...style}}>{children}</AbsoluteFill>;
};
const DarkTitle: React.FC<{children:React.ReactNode; size?:number; delay?:number}> = ({children,size=120,delay=0}) => {
  const f=useCurrentFrame(); const p=delay<=0?1:ease(f,delay,delay+10);
  return <div style={{fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:0.92,color:C.bg,textTransform:'uppercase',textAlign:'center',opacity:p,
    transform:`perspective(1400px) translateY(${(1-p)*40}px) rotateX(${(1-p)*60}deg)`,textShadow:'0 0 18px #fff, 0 0 30px #fff'}}>{children}</div>;
};
// tech parts list (like an /explodedview sheet). shown = how many items are visible, hero = index in yellow
const PARTS = ['Scalp','Skull','Dura mater','Arachnoid','Pia mater','Brain'];
const PartsList: React.FC<{times:number[]; hero?:number; heroAt?:number; extra?:{at:number; txt:string}}> = ({times,hero=2,heroAt=9999,extra}) => {
  const f=useCurrentFrame();
  return (<div style={{position:'absolute',left:44,top:930,width:300,background:'rgba(255,255,255,.88)',border:'2px solid #9C9EA8',borderRadius:10,padding:'12px 18px',fontFamily:BODY,fontWeight:600,color:'#2D2F37'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:30,letterSpacing:2,color:'#555',borderBottom:'2px solid #bbb',paddingBottom:4,marginBottom:6}}>PARTS LIST</div>
    {PARTS.map((p,i)=>{const o=ease(f,times[i],times[i]+6); const h=i===hero&&f>=heroAt; return (
      <div key={p} style={{opacity:o,fontSize:30,lineHeight:1.32,display:'flex',gap:12,alignItems:'center'}}>
        <span style={{display:'inline-block',width:36,height:36,borderRadius:18,background:h?C.yellow:'#2D2F37',color:h?'#1A1B20':'#fff',textAlign:'center',fontFamily:HEAD,fontWeight:900,fontSize:28,lineHeight:'36px'}}>{i+1}</span>
        <span style={{fontWeight:h?900:600,color:h?'#000':'#2D2F37'}}>{p}</span></div>);})}
    {extra && <div style={{opacity:ease(f,extra.at,extra.at+6),fontSize:26,marginTop:6,color:'#1d4fa3',fontWeight:900}}>{extra.txt}</div>}
  </div>);
};
// leader lines + numbers on the fully exploded frame (K3). y = layer centre, x = right edge of layer (1080x1920 frame)
const LAYERS = [{y:265,x:760},{y:505,x:740},{y:745,x:735},{y:900,x:735},{y:1030,x:715},{y:1150,x:720}];
const Leaders: React.FC<{at:number; hero?:number}> = ({at,hero=2}) => {
  const f=useCurrentFrame();
  return (<AbsoluteFill>
    <svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}>
      {LAYERS.map((l,i)=>{const p=ease(f,at+i*3,at+i*3+8); const x2=l.x+(930-l.x)*p; return <line key={i} x1={l.x} y1={l.y} x2={x2} y2={l.y} stroke="#3A3C45" strokeWidth={3}/>;})}
    </svg>
    {LAYERS.map((l,i)=>{const p=ease(f,at+i*3+6,at+i*3+12); return (
      <div key={i} style={{position:'absolute',left:936,top:l.y-27,width:54,height:54,borderRadius:27,background:i===hero?C.yellow:'#2D2F37',color:i===hero?'#000':'#fff',fontFamily:HEAD,fontWeight:900,fontSize:38,textAlign:'center',lineHeight:'54px',transform:`scale(${p})`}}>{i+1}</div>);})}
  </AbsoluteFill>);
};
const Spec: React.FC<{at:number}> = ({at}) => {const f=useCurrentFrame(); return (
  <div style={{position:'absolute',left:44,top:660,width:250,opacity:ease(f,at,at+8),background:'rgba(255,255,255,.88)',border:'2px solid #9C9EA8',borderRadius:10,padding:'10px 16px',fontFamily:BODY,fontWeight:600,fontSize:24,color:'#2D2F37',lineHeight:1.3}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:28,letterSpacing:2,color:'#555'}}>SPEC</div>
    <div>Tumor: meningioma</div><div>Grows from: the meninges</div><div>Presses: from outside</div>
  </div>);};

// ---------- scene 1: hook + question, head opens (c1), scalp/skull named
const Explode = () => {
  const X='explode';
  return (<AbsoluteFill style={{background:'#fff'}}>
    <Clip src="c1.mp4" dur={12.5}/><WShade/>
    <Fade a={0} b={at(X,4.2)} style={{paddingTop:200,gap:6}}>
      <DarkTitle size={112}>this tumor was <span style={{color:C.red}}>NOT</span> in his brain…</DarkTitle>
      {useCurrentFrame()>=at(X,2.7) && <DarkTitle size={130} delay={at(X,2.72)}>it was <span style={{color:C.orange}}>ON</span> it.</DarkTitle>}
    </Fade>
    <Fade a={at(X,4.25)} b={at(X,9.2)} style={{paddingTop:1060}}>
      <QCard at={at(X,4.3)} q="Ever hit your head really hard?" o1="1 = YES" o2="2 = NEVER" sub="answer at the end"/>
    </Fade>
    {useCurrentFrame()>=at(X,10.8) && <PartsList times={[at(X,10.86),at(X,11.78),99999,99999,99999,99999]}/>}
  </AbsoluteFill>);
};
// ---------- scene 2: full exploded view (c2 then K3 hold with leader lines)
const Layers = () => {
  const L='layers'; const f=useCurrentFrame(); const cut=at(L,17.4);
  return (<AbsoluteFill style={{background:'#fff'}}>
    {f<cut ? <Clip src="c2.mp4" dur={17.4-12.5}/> : <Still src="k3.jpg" dur={at(L,19.6)-cut} z0={1} z1={1.02}/>}
    <WShade/>
    {f>=cut && <Leaders at={cut} hero={2}/>}
    <PartsList times={[0,0,at(L,12.98),at(L,15.4),at(L,15.6),at(L,15.8)]} heroAt={at(L,12.98)}/>
    <Spec at={at(L,16.4)}/>
    <Fade a={at(L,15.16)} b={at(L,19.6)+4} style={{paddingTop:1270}}>
      <Pill at={at(L,16.4)} bg={C.orange} color="#fff" size={58}>MENINGIOMA = pressing from OUTSIDE</Pill>
    </Fade>
  </AbsoluteFill>);
};
// ---------- scene 3: hero close-up, tumor on the dura by the sinus (c3)
const Hero = () => {
  const H='hero'; const f=useCurrentFrame();
  return (<AbsoluteFill style={{background:'#fff'}}>
    <Clip src="c3.mp4" dur={26.1-19.6}/><WShade/>
    <PartsList times={[0,0,0,0,0,0]} hero={2} heroAt={0} extra={{at:at(H,20.36),txt:'+ sup. sagittal sinus (biggest vein channel)'}}/>
    <Fade a={at(H,20.3)} b={at(H,24.8)} style={{paddingTop:200}}>
      <Pill at={at(H,20.36)} bg={C.blue} color="#fff" size={56}>BIGGEST VEIN CHANNEL</Pill>
      {f>=at(H,23.4) && <Stamp at={at(H,23.42)} c={C.red} size={96}>BLEEDS A LOT</Stamp>}
    </Fade>
    {f>=at(H,23.9) && <div style={{position:'absolute',left:566-75,top:1100-75,width:150,height:150,borderRadius:75,border:`8px solid ${C.yellow}`,opacity:ease(f,at(H,23.9),at(H,23.9)+8),transform:`scale(${1.4-0.4*ease(f,at(H,23.9),at(H,23.9)+10)})`,boxShadow:'0 0 0 4px #1A1B20'}}/>}
    {f>=at(H,23.9) && <div style={{position:'absolute',left:690,top:1060,opacity:ease(f,at(H,24),at(H,24)+8)}}><Pill at={at(H,24)} bg={C.yellow} size={44}>MENINGIOMA</Pill></div>}
    <Fade a={at(H,24.9)} b={at(H,26.1)+6} style={{paddingTop:200}}>
      <Pill at={at(H,24.92)} bg={C.yellow} size={46}>SAVE: MENINGIOMA = OUTSIDE THE BRAIN, ON THE DURA</Pill>
    </Fade>
  </AbsoluteFill>);
};
// ---------- scene 4: the patient
const Patient = () => {
  const P='patient'; const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[20,1,50,45],[at(P,30.9),1.05,50,45],[at(P,31.1),1,50,45],[at(P,33.8),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:26}}>
      <Pill at={2} bg={C.orange} color="#fff" size={50}>THE PATIENT</Pill>
      <Photo src="wood.jpg" w={600} h={700} at={at(P,27.2)} rot={-2} label="Gen. Leonard Wood" credit="Moffett, Chicago · public domain" pos="50% 25%"/>
    </AbsoluteFill>
    {f>=at(P,28.88) && f<at(P,31.9) && <AbsoluteFill style={{alignItems:'center',paddingTop:1170}}><Pill at={at(P,28.9)} bg={C.yellow} size={56} rot={-3}>CUBA: head vs chandelier</Pill></AbsoluteFill>}
    {f>=at(P,31.9) && <AbsoluteFill style={{alignItems:'center',paddingTop:1120}}><Stamp at={at(P,32.5)} c={C.red} size={96}>NOT PROVEN</Stamp></AbsoluteFill>}
  </Cam>);
};
// ---------- scene 5: Cushing 1910, the paper card, 17 more years
const Surgeon = () => {
  const K='surgeon'; const f=useCurrentFrame();
  return (<Cam keys={[[0,1.1,50,45],[14,1,50,45],[at(K,39.6),1.04,50,45],[at(K,39.8),1,50,45],[at(K,41.9),1.04,50,45]]}>
    <Fade a={0} b={at(K,37.9)} style={{paddingTop:200,gap:20}}>
      <Title size={170} color={C.orange}>1910</Title>
      <Photo src="cushing1908.jpg" w={760} h={520} at={at(K,35.2)} rot={1.5} label="Dr. Harvey Cushing" credit="E. C. Tarbell, 1908 · public domain" pos="60% 30%"/>
      <Pill at={at(K,36.86)} bg={C.red} color="#fff" size={52}>stopped for the bleeding</Pill>
    </Fade>
    <Fade a={at(K,37.95)} b={at(K,41.95)+6} style={{paddingTop:210,gap:26}}>
      <div style={{opacity:ease(f,at(K,38),at(K,38)+12),transform:`perspective(1400px) rotateX(${(1-ease(f,at(K,38),at(K,38)+14))*50}deg) rotate(-1.5deg)`,width:880,background:'#f4f1ea',borderRadius:8,padding:'24px 36px 20px',boxShadow:'0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>J NEUROSURG · 2011 · 115(6) · 1067–1071</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>A meningioma and its consequences for American history and the rise of neurosurgery</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:'#333',marginTop:10}}>Ansari SF, Gianaris NG, Cohen-Gadol AA</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:'#6b6b6b',marginTop:6}}>doi:10.3171/2011.7.JNS102067</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14,width:880}}>
        <Row at={at(K,38.06)} c={C.green} size={56}>✓ finished days later</Row>
      </div>
      {f>=at(K,39.6) && <NumCard at={at(K,39.62)} num="17 MORE YEARS" unit="1910 → 1927" c={C.orange}/>}
    </Fade>
  </Cam>);
};
// ---------- scene 6: 1927
const Back = () => {
  const B='back'; const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[16,1,50,45],[at(B,46.9),1.06,50,45],[at(B,47.1),1,50,45],[at(B,49.2),1.04,50,45]]}>
    <Fade a={0} b={at(B,47.6)} style={{paddingTop:220,gap:30}}>
      <Title size={190} color={C.red}>1927</Title>
      <Row at={at(B,43.56)} c={C.orange} size={64}>the tumor came back</Row>
      <Row at={at(B,44.66)} c={C.red} size={64}>heavy bleeding again</Row>
      {f>=at(B,46.8) && <Stamp at={at(B,46.9)} c={C.red} size={110}>HE DIED</Stamp>}
    </Fade>
    <Fade a={at(B,47.65)} b={at(B,49.25)+6} style={{paddingTop:220,gap:20}}>
      <Photo src="cushing1938.jpg" w={560} h={640} at={at(B,47.66)} rot={-2} label="Cushing blamed himself" credit="Harvey Cushing, 1938 · Wellcome Collection · CC BY 4.0" pos="50% 25%"/>
    </Fade>
  </Cam>);
};
// ---------- scene 7: share + question
const Ask = () => {
  const A='ask';
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[at(A,52.9),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:36}}>
      <Pill at={2} bg={C.green} color="#fff" size={50}>SEND THIS TO YOUR CLUMSIEST FRIEND</Pill>
      <QCard at={at(A,49.5)} q="Ever hit your head really hard?" o1="1 = YES" o2="2 = NEVER" sub="comment 1 or 2"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={at(A,49.8)}/><StickDoc pose="think" mood="flat" size={280} delay={at(A,49.6)}/></div>
    </AbsoluteFill>
  </Cam>);
};
// ---------- scene 8: end card
const End = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[24,1,50,45],[190,1.06,50,42]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Flip at={2}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={74} color={C.orange} delay={8}>one brain story at a time</Label>
      <Title size={92} color={C.yellow} delay={at('end',57.44)}>ever hit your head really hard?</Title>
      <StickDoc pose="wave" mood="smile" size={280} delay={10}/>
      <div style={{textAlign:'center',padding:'0 70px',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.text}}>Sources: Ansari SF, Gianaris NG, Cohen-Gadol AA. J Neurosurg 2011;115(6):1067–71 · doi:10.3171/2011.7.JNS102067 · Ljunggren B. The case of General Wood. J Neurosurg 1982;56(4):471 · Federal Practitioner 2017 (Leonard Wood history)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:19,color:C.mute,marginTop:6}}>Images: Leonard Wood, Moffett Chicago, public domain · Cushing by E. C. Tarbell 1908, public domain · Cushing 1938, Wellcome Collection, CC BY 4.0 (Wikimedia Commons) · exploded view made with Google Gemini</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {explode:Explode, layers:Layers, hero:Hero, patient:Patient, surgeon:Surgeon, back:Back, ask:Ask, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; soft?:boolean; children:React.ReactNode}> = ({dur, first, last, soft, children}) => {
  const f=useCurrentFrame();
  if(soft) return <AbsoluteFill>{children}</AbsoluteFill>;
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.14,2.26,'This tumor was *NOT* in his brain…'],[2.72,3.64,'it was *ON* it.'],[4.32,5.86,'Ever hit your head *really hard*?'],[6.38,8.8,'*1*, yes… *2*, never.'],
  [9.26,10.32,'Let’s take his head *APART*.'],[10.86,12.18,'*Scalp*… *skull*…'],[12.6,14.62,'then the *DURA*, the brain’s tough cover.'],[15.16,17.22,'That’s where it grew: a *MENINGIOMA*,'],[17.48,18.8,'pressing from *OUTSIDE*.'],
  [19.16,21.4,'It sat on the brain’s *BIGGEST* vein channel,'],[21.58,22.74,'like parking on a *highway*…'],[23.12,24.42,'so it *bleeds* a lot.'],[24.92,25.92,'*Save this* for your exam.'],
  [26.3,28.4,'The patient? General *Leonard Wood*.'],[28.88,31.52,'Once, in *Cuba*, he hit his head on a *chandelier*.'],[31.92,33.56,'Nobody can *PROVE* that caused it.'],
  [33.9,36.58,'*1910*. Harvey *Cushing* operated,'],[36.86,39.1,'stopped for the *bleeding*, and finished days later.'],[39.62,41.66,'Wood worked *17 more years*.'],
  [42.06,44.24,'*1927*. It came back.'],[44.66,45.68,'Heavy *bleeding* again…'],[46.06,47.26,'and this time he *DIED*.'],[47.7,48.88,'Cushing blamed *HIMSELF*.'],
  [49.3,50.9,'Send this to your *clumsiest* friend.'],[51.38,52.54,'So… *1 or 2*?'],[52.94,55.28,'*Dr. Mot*, one brain story at a time…'],[55.62,56.96,'because the real question is…'],[57.44,58.96,'ever hit your head *really hard*?'],
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
  const white=t<26.1; const mute=white?'#55575f':C.mute;
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <Sequence from={0} durationInFrames={COVER}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></Sequence>
    <Sequence from={COVER}>
      <Audio src={staticFile('voice.mp3')}/>
      <Audio src={staticFile('sfx.wav')} volume={0.35}/>
      {!white && <Particles/>}
      {scenes.map((s,i)=>{const from=Math.round(s.a*S), dur=Math.round((s.b-s.a)*S); const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1} soft={i<2}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,background:white?'rgba(255,255,255,.8)':'transparent',fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #8</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1910</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
