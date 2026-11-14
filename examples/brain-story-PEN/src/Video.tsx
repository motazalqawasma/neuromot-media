import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {projectFrontal} from './Frontal3D';
import {Pen3D, G_ORBIT, MOTOR, SENSORY, PROBE_PT} from './Pen3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-14, atempo 1.12 -> 52.5 s), word times from ElevenLabs Scribe / 1.12
const R = 1.12;
const scenes = [
  {id:'hook', d:8.0/R},{id:'montreal', d:(17.3-8.0)/R},{id:'probe', d:(25.3-17.3)/R},{id:'felt', d:(31.45-25.3)/R},{id:'map', d:(43.4-31.45)/R},{id:'end', d:(59.6-43.4)/R},
];
export const TOTAL = COVER + Math.round(scenes.reduce((a,s)=>a+s.d,0)*S);
const cl = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const ease = (f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...cl, easing:Easing.out(Easing.cubic)});
const win = (f:number,a:number,b:number,k=6)=>ease(f,a,a+k)*(1-ease(f,b-k,b));
const useSpring = (delay:number)=>{const f=useCurrentFrame(); const {fps}=useVideoConfig(); return spring({frame:f-delay,fps,config:{damping:12,mass:0.6}});};

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
const Abs: React.FC<{x:number;y:number;w?:number;children:React.ReactNode;show?:number;style?:React.CSSProperties}> = ({x,y,w,children,show=1,style}) =>
  <div style={{position:'absolute',left:x,top:y,width:w,opacity:show,...style}}>{children}</div>;
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

// ---------- scenes
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Chip: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=64}) => {const s=useSpring(at); return (
  <div style={{transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0,background:c,borderRadius:18,padding:'12px 34px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 10px 0 #0B0B0E',whiteSpace:'nowrap'}}>{children}</div>);};
const Pill: React.FC<{at:number; children:React.ReactNode; bg?:string; color?:string; size?:number; rot?:number}> = ({at,children,bg=C.yellow,color=C.bg,size=52,rot=0}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{opacity:p,transform:`scale(${0.6+0.4*p}) rotate(${rot}deg)`,background:bg,color,fontFamily:HEAD,fontWeight:900,fontSize:size,padding:'6px 26px',borderRadius:14,display:'inline-block',boxShadow:'0 8px 0 #0B0B0E',whiteSpace:'nowrap'}}>{children}</div>);};
const HTag: React.FC<{p:THREE.Vector3; ang:number; dist:number; w:number; h:number; ox:number; oy:number; text:string; o:number; lx:number; ly:number; color?:string}> = ({p,ang,dist,w,h,ox,oy,text,o,lx,ly,color='rgba(235,240,248,0.94)'}) => {
  if(o<=0) return null; const q=projectFrontal(p,ang,dist,w,h); const x=ox+q.x, y=oy+q.y;
  return (<>
    <svg style={{position:'absolute',left:0,top:0,opacity:o}} width={1080} height={1920}><line x1={x} y1={y} x2={lx+60} y2={ly+30} stroke="#e8edf5" strokeWidth={4}/><circle cx={x} cy={y} r={10} fill="#fff"/></svg>
    <div style={{position:'absolute',left:lx,top:ly,opacity:o,background:color,color:'#16171B',fontFamily:HEAD,fontWeight:900,fontSize:50,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',transform:`scale(${0.7+0.3*o})`,transformOrigin:'left top'}}>{text}</div>
  </>);
};
// a plain patient silhouette (no real photo)
const Patient: React.FC<{size?:number; at?:number; bubble?:string}> = ({size=300,at=0,bubble}) => {
  const f=useCurrentFrame(); const s=ease(f,at,at+10); const bob=Math.sin(f/12)*4;
  return (<div style={{position:'relative',width:size,height:size*1.25,opacity:s,transform:`translateY(${(1-s)*40+bob}px)`}}>
    <div style={{position:'absolute',left:0,top:size*0.12,width:size,background:'#f4f1ea',padding:'12px 12px 0',borderRadius:6,boxShadow:'0 24px 50px rgba(0,0,0,.6)',transform:'rotate(2deg)',boxSizing:'border-box'}}>
      <Img src={staticFile('henry.jpg')} style={{width:'100%',height:size*0.82,objectFit:'cover',objectPosition:'50% 30%',display:'block',filter:'grayscale(1) contrast(1.05)'}}/>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:Math.max(28,size*0.11),color:'#1A1B20',textAlign:'center',padding:'6px 0 0'}}>Henry, 1953</div>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:15,color:'#6b6b6b',textAlign:'center',paddingBottom:8}}>photo: Suzanne Corkin / MIT · used for education</div>
    </div>
    {bubble && <div style={{position:'absolute',right:size*0.35,top:-size*0.32,opacity:ease(f,at+8,at+16),transform:`scale(${0.6+0.4*ease(f,at+8,at+16)})`,transformOrigin:'right bottom',background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'12px 26px',borderRadius:26,whiteSpace:'nowrap',boxShadow:'0 8px 0 #0B0B0E'}}>{bubble}</div>}
  </div>);
};
// 5-point star path and a wobbly trace of it (wobble shrinks with skill 0..1)
const starPts = (cx:number,cy:number,R:number,r:number)=>Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5; const rr=i%2?r:R; return [cx+rr*Math.cos(a), cy+rr*Math.sin(a)];});
const StarTrace: React.FC<{size:number; skill:number; draw:number; seed:string; color?:string; outline?:boolean}> = ({size,skill,draw,seed,color=C.red,outline=true}) => {
  const pts=starPts(100,105,90,38); const path:string[]=[];
  const N=200; for(let i=0;i<=N;i++){const t=i/N*10; const k=Math.floor(t)%10, u=t-Math.floor(t); const [x1,y1]=pts[k], [x2,y2]=pts[(k+1)%10];
    const amp=(1-skill)*11; const wx=amp*Math.sin(i*1.7+random(seed)*9)+amp*0.6*Math.sin(i*0.53), wy=amp*Math.cos(i*1.3+random(seed+'y')*9);
    path.push(`${i?'L':'M'}${(x1+(x2-x1)*u+wx).toFixed(1)} ${(y1+(y2-y1)*u+wy).toFixed(1)}`);}
  const outlineD=pts.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ')+'Z';
  return (<svg width={size} height={size} viewBox="0 0 200 210">
    {outline && <><path d={outlineD} fill="none" stroke="#5c6070" strokeWidth={16} strokeLinejoin="round"/><path d={outlineD} fill="none" stroke="#2D2F37" strokeWidth={10} strokeLinejoin="round"/></>}
    <path d={path.join(' ')} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-draw}/>
  </svg>);
};

// real photo (Wikimedia Commons, free license) as a tilted print with slow zoom + credit line
const Photo: React.FC<{src:string; w:number; h:number; at:number; rot?:number; label?:string; credit?:string; pos?:string; blur?:boolean}> = ({src,w,h,at,rot=0,label,credit,pos='center',blur=false}) => {
  const f=useCurrentFrame(); const p=ease(f,at,at+12); const z=1.04+0.06*ease(f,at,at+90);
  return (<div style={{opacity:p,transform:`perspective(1400px) translateY(${(1-p)*120}px) rotateX(${(1-p)*40}deg) rotate(${rot*p}deg)`,background:'#f4f1ea',padding:'16px 16px 0',borderRadius:6,boxShadow:'0 30px 70px rgba(0,0,0,.6)',width:w}}>
    <div style={{width:w-32,height:h,overflow:'hidden',borderRadius:3,background:'#222'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:pos,transform:`scale(${z*(blur?1.15:1)})`,filter:blur?'blur(28px) grayscale(0.3)':undefined}}/></div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:44,color:'#1A1B20',textAlign:'center',padding:'10px 0 2px'}}>{label}</div>
    <div style={{fontFamily:BODY,fontWeight:600,fontSize:18,color:'#6b6b6b',textAlign:'center',paddingBottom:10}}>{credit}</div>
  </div>);
};

// ---------- scenes (Brain Story #5 - Wilder Penfield, awake brain surgery, 1930s) ----------
const Stamp: React.FC<{at:number; c?:string; size?:number; children:React.ReactNode}> = ({at,c=C.red,size=120,children}) => {const f=useCurrentFrame(); return (
  <div style={{opacity:ease(f,at,at+6),transform:`scale(${1.5-0.5*ease(f,at,at+8)}) rotate(-5deg)`,border:`10px solid ${c}`,color:c,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'10px 40px',borderRadius:20,background:'rgba(26,27,32,.85)',textAlign:'center'}}>{children}</div>);};
const QCard: React.FC<{at:number; foot:string}> = ({at,foot}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 40px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:C.yellow}}>COMMENT 1 OR 2</div>
    <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',background:C.blue,padding:'6px 22px',borderRadius:14,whiteSpace:'nowrap'}}>1 = YES, AWAKE</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',background:C.red,padding:'6px 22px',borderRadius:14,whiteSpace:'nowrap'}}>2 = NO WAY</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:46,color:C.text,marginTop:14}}>{foot}</div>
  </div></Flip>);
const Bubble: React.FC<{at:number; children:React.ReactNode; size?:number}> = ({at,children,size=150}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{position:'relative',opacity:p,transform:`scale(${0.5+0.5*p})`,background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'24px 60px',borderRadius:60,boxShadow:'0 12px 0 #0B0B0E'}}>
    {children}<div style={{position:'absolute',left:90,bottom:-40,width:0,height:0,borderLeft:'30px solid transparent',borderRight:'30px solid transparent',borderTop:'48px solid #fff'}}/></div>);};

const Row: React.FC<{at:number; c:string; children:React.ReactNode}> = ({at,c,children}) => {const s=useSpring(at); return (
  <div style={{transform:`translateX(${(1-s)*-60}px)`,opacity:s>0.02?1:0,background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'14px 28px',fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};

const T = (raw:number, start:number)=>Math.round((raw-start)/R*S); // voice time (raw s) -> scene frame

const Hook = () => {
  const f=useCurrentFrame();
  const a=f<T(3.9,0), b=f>=T(3.9,0)-6;
  return (<Cam keys={[[0,1.1,50,45],[30,1,50,45],[T(3.9,0)-6,1.05,50,45],[T(3.9,0),1,50,45],[214,1.05,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:250}}><Pill at={2} bg={C.yellow} size={52}>AWAKE FOR BRAIN SURGERY? · 1 / 2</Pill></AbsoluteFill>
    {a && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:30,opacity:1-ease(f,T(3.9,0)-6,T(3.9,0))}}>
      <div style={{transform:`perspective(1400px) rotateX(${14-14*ease(f,0,20)}deg) scale(${1.15-0.15*ease(f,0,30)})`}}><Title size={250} color={C.orange}>stay awake?</Title></div>
      <Title size={100} delay={T(1.68,0)}>while a surgeon<br/>touches <span style={{color:C.yellow}}>your brain</span></Title>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:360,gap:40,opacity:ease(f,T(3.9,0)-6,T(3.9,0)+2)}}>
      <QCard at={T(3.9,0)} foot="tell me at the end"/>
      <div style={{display:'flex',gap:20,alignItems:'center',marginTop:30}}><NameTag at={T(5.5,0)}/><StickDoc pose="think" mood="worried" size={300} delay={T(5.3,0)}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const Montreal = () => {
  const f=useCurrentFrame(); const st=8.0;
  const sw=T(13.1,st); const a=f<sw, b=f>=sw-6;
  return (<Cam keys={[[0,1.06,50,45],[T(10.4,st),1.1,50,45],[T(10.4,st)+6,1,50,45],[sw-6,1.05,50,45],[sw,1,50,45],[T(16.3,st),1.1,50,48],[T(16.3,st)+8,1,50,45],[249,1.05,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:1-ease(f,sw-6,sw)}}>
      <Title size={120}>Montreal, <span style={{color:C.orange}}>1930s</span></Title>
      <Photo src="penfield.jpg" w={540} h={620} at={T(10.3,st)} rot={-2} label="Dr. Wilder Penfield" credit="photo 1958 · US National Library of Medicine · public domain" pos="50% 30%"/>
      <Pill at={T(11.7,st)} bg={C.red} color="#fff" size={56}>on purpose</Pill>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:50,opacity:ease(f,sw-6,sw+2)}}>
      <Row at={sw+2} c={C.blue}>scalp: numbed with local anesthetic</Row>
      <Row at={T(14.7,st)} c={C.green}>patient: awake and talking</Row>
      <div style={{marginTop:40}}><Stamp at={T(16.3,st)} size={150} c={C.yellow}>BRAIN: NO PAIN</Stamp></div>
      <Label size={36} delay={T(16.6,st)}>brain tissue has no pain sensors</Label>
    </AbsoluteFill>}
  </Cam>);
};

const Probe = () => {
  const f=useCurrentFrame(); const st=17.3; const dist=8.2;
  const sw=T(20.5,st); const a=f<sw, b=f>=sw-6;
  const pr=ease(f,T(20.9,st),T(22.9,st)); const sp=f>T(22.96,st)?(((f-T(22.96,st))%24)/24):0;
  return (<Cam keys={[[0,1.05,50,45],[sw-6,1.08,50,45],[sw,1,50,45],[T(22.96,st),1.12,48,52],[T(22.96,st)+10,1,50,45],[214,1.05,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:40,opacity:1-ease(f,sw-6,sw)}}>
      <Title size={110}>his patients had</Title>
      <Stamp at={T(18.2,st)} size={140}>SEIZURES</Stamp>
      <Chip at={T(19.0,st)} c={C.card} size={72}>that no drug could stop</Chip>
      <Label size={36} delay={T(19.3,st)}>severe epilepsy</Label>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{opacity:ease(f,sw-6,sw+2)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:6}}>
        <Title size={84} delay={sw}>a tiny</Title>
        <Title size={116} color={C.orange} delay={sw+4}>electric probe</Title>
      </AbsoluteFill>
      <Abs x={40} y={470}><Pen3D width={1000} height={760} lobe={0} probe={pr} spark={sp} motor={0} dist={dist} orbit={Math.PI}/></Abs>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1180}}><Bubble at={T(24.1,st)} size={92}>“What do you FEEL?”</Bubble></AbsoluteFill>
    </AbsoluteFill>}
  </Cam>);
};

const Felt = () => {
  const f=useCurrentFrame(); const st=25.3;
  return (<Cam keys={[[0,1.05,50,45],[T(28.9,st),1.08,50,45],[T(28.9,st)+8,1,50,45],[165,1.06,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:34}}>
      <Title size={100}>what patients <span style={{color:C.orange}}>felt</span></Title>
      <div style={{display:'flex',flexDirection:'column',gap:24,width:880,marginTop:20}}>
        <Row at={T(25.5,st)} c={C.orange}>✋ a hand twitched</Row>
        <Row at={T(26.6,st)} c={C.orange}>👄 a lip tingled</Row>
        <Row at={T(28.9,st)} c={C.blue}>🎵 some heard music</Row>
        <Row at={T(30.4,st)} c={C.blue}>🕰️ some relived an old memory</Row>
      </div>
      <Label size={36} delay={T(30.8,st)}>memory flashbacks: under 5% of patients</Label>
    </AbsoluteFill>
  </Cam>);
};

const MapScene = () => {
  const f=useCurrentFrame(); const st=31.45; const dist=8.2;
  const sw=T(36.1,st); const a=f<sw, b=f>=sw-6;
  return (<Cam keys={[[0,1.04,50,45],[T(34.0,st),1.1,50,45],[T(34.0,st)+8,1,50,45],[sw-6,1.05,50,45],[sw,1,50,45],[T(40.8,st),1.06,50,42],[320,1.08,50,42]]}>
    {a && <AbsoluteFill style={{opacity:1-ease(f,sw-6,sw)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:6}}>
        <Title size={110}>spot by spot,</Title>
        <Title size={110} color={C.orange} delay={T(32.7,st)}>a map</Title>
      </AbsoluteFill>
      <Abs x={40} y={470}><Pen3D width={1000} height={760} lobe={0} motor={ease(f,T(32.0,st),T(34.0,st))} dist={dist} orbit={Math.PI}/></Abs>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1230}}><Chip at={T(34.0,st)} c={C.red} size={70}>1937 · journal Brain</Chip></AbsoluteFill>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:18,opacity:ease(f,sw-6,sw+2)}}>
      <Title size={120} color={C.orange} delay={sw}>the homunculus</Title>
      <div style={{position:'relative'}}>
        <Photo src="homun.png" w={760} h={700} at={sw+2} rot={1.5} label="the sensory homunculus" credit="OpenStax / Wikimedia Commons, CC BY 3.0 · after Penfield & Boldrey 1937" pos="50% 50%"/>
        <div style={{position:'absolute',left:-30,top:300}}><Pill at={T(37.4,st)} bg={C.yellow} size={56} rot={-6}>GIANT HANDS</Pill></div>
        <div style={{position:'absolute',right:-30,top:420}}><Pill at={T(38.5,st)} bg={C.yellow} size={56} rot={5}>GIANT LIPS</Pill></div>
        <div style={{position:'absolute',left:250,top:40}}><Pill at={T(39.6,st)} bg={C.blue} color="#fff" size={56} rot={-4}>TINY LEGS</Pill></div>
      </div>
      <div style={{marginTop:6}}><Pill at={T(40.8,st)} bg={C.red} color="#fff" size={54}>the brain’s selfie · no filter 🤳</Pill></div>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame(); const st=43.4; const dist=8.2;
  const t1=T(50.45,st), t2=T(53.5,st), t3=T(56.2,st);
  const a=1-ease(f,t1-6,t1), b=ease(f,t1-6,t1)*(1-ease(f,t2-6,t2)), c=ease(f,t2-6,t2)*(1-ease(f,t3-6,t3)), d=ease(f,t3-6,t3);
  return (<Cam keys={[[0,1.06,50,45],[24,1,50,45],[T(44.56,st),1.08,50,50],[T(44.56,st)+8,1,50,45],[T(47.2,st),1.08,50,50],[T(47.2,st)+8,1,50,45],[t1-6,1.04,50,45],[t1,1,50,45],[t2-6,1.04,50,45],[t2,1,50,45],[t3-6,1.03,50,45],[t3,1,50,45],[440,1.1,50,40]]}>
    {a>0 && <AbsoluteFill style={{opacity:a}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:210}}><Pill at={2} bg={C.yellow} size={56}>SAVE THIS · exam classic</Pill></AbsoluteFill>
      <Abs x={40} y={340}><Pen3D width={1000} height={760} lobe={0} motor={ease(f,T(44.56,st),T(45.6,st))} sensory={ease(f,T(47.2,st),T(48.2,st))} dist={dist} orbit={Math.PI}/></Abs>
      <HTag p={MOTOR[4]} ang={Math.PI} dist={dist} w={1000} h={760} ox={40} oy={340} text="MOTOR · in front" o={ease(f,T(44.56,st),T(44.56,st)+10)} lx={560} ly={1000} color={C.orange}/>
      <HTag p={SENSORY[4]} ang={Math.PI} dist={dist} w={1000} h={760} ox={40} oy={340} text="SENSORY · behind" o={ease(f,T(47.2,st),T(47.2,st)+10)} lx={90} ly={1110} color={C.blue}/>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1240}}><Chip at={T(46.0,st)} c={C.card} size={56}>split by the central sulcus</Chip></AbsoluteFill>
    </AbsoluteFill>}
    {b>0 && <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:30,opacity:b}}>
      <Pill at={t1-4} bg={C.orange} color="#fff" size={54}>BRAIN STORY #5</Pill>
      <Title size={116} delay={t1-2}>Would you stay<br/><span style={{color:C.orange}}>awake?</span></Title>
      <QCard at={t1+8} foot="I’ll post my answer tonight"/>
    </AbsoluteFill>}
    {c>0 && <AbsoluteFill style={{alignItems:'center',padding:'250px 60px 0',gap:32,opacity:c}}>
      <Title size={92} delay={t2-2}>Send this to the friend<br/>who faints at a</Title>
      <Chip at={T(55.4,st)} c={C.red} size={90}>BLOOD TEST 🩸</Chip>
      <div style={{textAlign:'center',marginTop:30}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:C.text}}>Source: Penfield W, Boldrey E. Somatic motor and sensory representation in the cerebral cortex of man as studied by electrical stimulation. Brain 1937;60(4):389–443, doi:10.1093/brain/60.4.389 · Penfield W, Perot P. Brain 1963;86:595–696</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.mute,marginTop:6}}>Images: Wikimedia Commons (US NLM, public domain; OpenStax, CC BY 3.0)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>}
    {d>0 && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:20,opacity:d}}>
      <Flip at={t3}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={t3+4}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={320} delay={t3+6}/>
      <div style={{opacity:ease(f,t3+12,t3+20),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'14px 36px',borderRadius:14}}>FOLLOW FOR STORY #6 · #NeuroMot</div>
    </AbsoluteFill>}
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, montreal:Montreal, probe:Probe, felt:Felt, map:MapScene, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = ([
  [0.08,1.6,'Would you stay *AWAKE*…'],[1.68,3.64,'while a surgeon touches *your brain*?'],[3.92,5.36,'*1* = yes.'],[5.52,6.8,'*2* = no.'],[6.88,7.84,'Tell me at the end.'],
  [8.29,10.24,'*Montreal*, the *1930s*.'],[10.4,13.04,'*Dr. Wilder Penfield* did this *ON purpose*.'],[13.12,14.64,'Only the *scalp* was numbed.'],[14.68,15.76,'The brain itself?'],[15.84,17.28,'It feels *NO pain*.'],
  [17.48,20.48,'His patients had *seizures* that no drug could stop.'],[20.56,23.33,'So he touched the brain with a tiny *electric probe*…'],[23.39,25.28,'and asked, “What do you *FEEL*?”'],
  [25.36,26.48,'A *hand* twitched.'],[26.52,27.68,'A *lip* tingled.'],[27.76,29.68,'A few patients even heard *MUSIC*…'],[29.76,31.44,'or relived an old *memory*.'],
  [31.52,33.84,'Spot by spot, he drew a *map*.'],[33.88,36.08,'In *1937*, he published it:'],[36.12,37.12,'the *HOMUNCULUS*.'],[37.44,39.44,'*Giant hands*, *giant lips*,'],[39.6,40.56,'*tiny legs*.'],[40.76,42.4,'Basically the brain’s own *selfie*…'],[42.48,43.36,'*no filter*.'],
  [43.64,44.4,'*Save* this:'],[44.44,47.04,'the *MOTOR* strip sits in front of the *central sulcus*,'],[47.12,48.96,'the *SENSORY* strip right behind it.'],[49.04,50.4,'*Exam classic*.'],[50.48,52.0,'So… would you stay *awake*?'],[52.4,53.28,'*1* or *2*.'],
  [53.76,55.92,'Send this to the friend who faints at a *blood test*.'],[56.24,58.88,'*Dr. Mot*, one brain story at a time.'],
] as [number,number,string][]).map(([a,b,t])=>[a/R,b/R,t] as [number,number,string]);
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
  const f=useCurrentFrame(); let start=0;
  const loop=interpolate(f,[TOTAL-9,TOTAL-2],[0,1],cl);
  const capO=1-interpolate(f,[TOTAL-14,TOTAL-9],[0,1],cl);
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <Sequence from={0} durationInFrames={COVER}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></Sequence>
    <Sequence from={COVER}>
      <Audio src={staticFile('voice.mp3')}/>
      <Audio src={staticFile('sfx.wav')} volume={0.35}/>
      <Particles/>
      {scenes.map((s,i)=>{const from=Math.round(start*S), dur=Math.round(s.d*S); start+=s.d; const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #5</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE STORY · 1930s</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
