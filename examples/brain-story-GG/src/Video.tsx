import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {projectFrontal} from './Frontal3D';
import {Gage3D, G_ORBIT, LFRONT_PT} from './Gage3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 2 (2026-11-12, atempo 1.12 -> 55.97 s), word times from ElevenLabs Scribe / 1.12
const scenes = [
  {id:'hook', d:10.57},{id:'accident', d:8.69},{id:'survive', d:5.37},{id:'doctor', d:11.64},{id:'neuro', d:6.57},{id:'end', d:13.2},
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

// ---------- scenes (Brain Story #3 — Phineas Gage, 1848) ----------
const Stamp: React.FC<{at:number; c?:string; size?:number; children:React.ReactNode}> = ({at,c=C.red,size=120,children}) => {const f=useCurrentFrame(); return (
  <div style={{opacity:ease(f,at,at+6),transform:`scale(${1.5-0.5*ease(f,at,at+8)}) rotate(-5deg)`,border:`10px solid ${c}`,color:c,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'10px 40px',borderRadius:20,background:'rgba(26,27,32,.85)',textAlign:'center'}}>{children}</div>);};
const QCard: React.FC<{at:number; foot:string}> = ({at,foot}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 44px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:80,color:C.yellow}}>COMMENT 1 OR 2 👇</div>
    <div style={{display:'flex',gap:22,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:'#fff',background:C.green,padding:'6px 34px',borderRadius:14}}>1 = YES</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:'#fff',background:C.red,padding:'6px 34px',borderRadius:14}}>2 = NO</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:C.text,marginTop:14}}>{foot}</div>
  </div></Flip>);

const Hook = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1.1,50,45],[40,1,50,45],[46,1.02,50,42],[136,1.1,50,36],[200,1.16,50,34],[206,1,50,45],[317,1.05,50,48]]}>
    {f<50 && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:30,opacity:1-ease(f,44,50)}}>
      <div style={{transform:`perspective(1400px) rotateX(${14-14*ease(f,0,20)}deg) scale(${1.15-0.15*ease(f,0,30)})`}}><Title size={330} color={C.orange}>1848</Title></div>
      <Pill at={4} bg={C.yellow} size={62}>SAME MAN, OR NOT? · 1 / 2</Pill>
    </AbsoluteFill>}
    {f>=44 && f<208 && <AbsoluteFill style={{alignItems:'center',paddingTop:215,gap:26,opacity:ease(f,44,52)*(1-ease(f,202,208))}}>
      <Title size={98} delay={46}>“No longer<br/><span style={{color:C.orange}}>the same man</span>”</Title>
      <Photo src="gage.jpg" w={600} h={720} at={48} rot={-2} label={f<137?'Vermont, about 1850':'Phineas Gage'} credit="Gage family collection (T. Gage Miller) · public domain" pos="50% 22%"/>
    </AbsoluteFill>}
    {f>=202 && <AbsoluteFill style={{alignItems:'center',paddingTop:270,gap:34,opacity:ease(f,202,210)}}>
      <Title size={120} delay={204}>Same man,<br/><span style={{color:C.orange}}>or not?</span></Title>
      <QCard at={214} foot="tell me at the end"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={250}/><StickDoc pose="think" mood="flat" size={250} delay={246}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const Accident = () => {
  const f=useCurrentFrame();
  const a=f<146, b=f>=140&&f<222, c=f>=216;
  const rod=ease(f,224,246);
  return (<Cam keys={[[0,1.04,50,45],[140,1.1,50,45],[146,1,50,45],[216,1.05,50,45],[222,1,50,45],[261,1.06,50,42]]}>
    {a && <AbsoluteFill style={{opacity:1-ease(f,140,146)}}>
      <AbsoluteFill style={{overflow:'hidden'}}><OffthreadVideo muted src={staticFile('shotA.mp4')} style={{width:'100%',height:'100%',objectFit:'cover',filter:'blur(30px) brightness(0.45)',transform:'scale(1.2)'}}/></AbsoluteFill>
      <div style={{position:'absolute',left:0,top:560,width:1080,height:607,overflow:'hidden',boxShadow:'0 30px 80px rgba(0,0,0,.7)'}}>
        <OffthreadVideo muted src={staticFile('shotA.mp4')} style={{width:1080,height:607,transform:`scale(${1.02+0.06*ease(f,0,146)})`}}/>
        <div style={{position:'absolute',right:14,bottom:10,fontFamily:BODY,fontWeight:600,fontSize:22,color:'#fff',background:'rgba(0,0,0,.55)',padding:'2px 10px',borderRadius:6}}>AI illustration</div>
      </div>
      <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:20}}>
        <Title size={104}>Railroad <span style={{color:C.orange}}>foreman</span></Title>
        <Pill at={8} bg={C.card} color="#fff" size={52}>Cavendish, Vermont · 13 Sep 1848</Pill>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1200}}><Pill at={64} bg={C.red} color="#fff" size={64} rot={-2}>one afternoon… an explosion</Pill></AbsoluteFill>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:230,opacity:ease(f,140,148)*(1-ease(f,216,222))}}>
      <Title size={100} delay={142}>His <span style={{color:C.orange}}>iron rod</span></Title>
      <div style={{display:'flex',gap:36,alignItems:'center',marginTop:30}}>
        <Photo src="ironskull.jpg" w={470} h={780} at={144} rot={-2} label="the real iron" credit="J.B.S. Jackson, Warren Museum catalogue 1870 · public domain" pos="50% 50%"/>
        <div style={{display:'flex',flexDirection:'column',gap:36,alignItems:'flex-start'}}>
          <Chip at={148} c={C.orange} size={70}>1.1 m long</Chip>
          <Chip at={178} c={C.red} size={70}>13 pounds</Chip>
          <Label size={38} delay={186} color={C.text}>3 ft 7 in · about 6 kg</Label>
        </div>
      </div>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{opacity:ease(f,216,224)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:220}}><Title size={88} delay={218}>through the <span style={{color:C.orange}}>front</span><br/>of his head</Title></AbsoluteFill>
      <Abs x={40} y={470}><Gage3D width={1000} height={880} lobe={0.5} rod={rod} path={ease(f,236,250)}/></Abs>
    </AbsoluteFill>}
  </Cam>);
};

const Survive = () => {
  const f=useCurrentFrame();
  const a=f<96, b=f>=90;
  return (<Cam keys={[[0,1.12,50,45],[14,1,50,45],[90,1.05,50,45],[96,1,50,45],[161,1.06,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:330,gap:50,opacity:1-ease(f,90,96)}}>
      <Stamp at={8} c={C.green} size={170}>HE SURVIVED</Stamp>
      <Chip at={40} c={C.card} size={58}>he may not even have <span style={{color:C.yellow}}>&nbsp;passed out</span></Chip>
      <StickDoc pose="shrug" mood="surprised" size={330} delay={44}/>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:30,opacity:ease(f,90,98)}}>
      <Title size={92} delay={92}>Me in <span style={{color:C.orange}}>anatomy lab</span></Title>
      <div style={{position:'relative',marginTop:120}}>
        <div style={{position:'absolute',left:210,top:-110,opacity:ease(f,104,112),transform:`scale(${0.6+0.4*ease(f,104,112)})`,transformOrigin:'left bottom',background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'12px 26px',borderRadius:26,whiteSpace:'nowrap',boxShadow:'0 8px 0 #0B0B0E'}}>I need to sit down 😵</div>
        <StickDoc pose="facepalm" mood="worried" size={420} delay={96} sweat/>
      </div>
    </AbsoluteFill>}
  </Cam>);
};

const Row: React.FC<{at:number; c:string; children:React.ReactNode}> = ({at,c,children}) => {const s=useSpring(at); return (
  <div style={{transform:`translateX(${(1-s)*-60}px)`,opacity:s>0.02?1:0,background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'14px 28px',fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};
const Doctor = () => {
  const f=useCurrentFrame();
  const a=f<98, b=f>=92&&f<282, c=f>=276;
  return (<Cam keys={[[0,1.05,50,45],[92,1.02,50,45],[98,1,50,45],[276,1.04,50,45],[282,1.1,50,45],[300,1,50,45],[349,1.05,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:30,opacity:1-ease(f,92,98)}}>
      <Title size={96}>His <span style={{color:C.orange}}>doctor</span></Title>
      <Photo src="harlow.jpg" w={560} h={650} at={4} rot={3} label="Dr. John M. Harlow" credit="portrait from S. A. Eliot (1911) · public domain" pos="50% 20%"/>
      <Pill at={50} bg={C.yellow} size={58}>noticed something strange</Pill>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:240,gap:24,opacity:ease(f,92,100)*(1-ease(f,276,282))}}>
      <div style={{display:'flex',flexDirection:'column',gap:18,width:860}}>
        <Chip at={96} c={C.green} size={76}>BEFORE</Chip>
        <Row at={110} c={C.green}>careful</Row>
        <Row at={128} c={C.green}>a great planner</Row>
        <div style={{height:26}}/>
        <Chip at={168} c={C.red} size={76}>AFTER</Chip>
        <Row at={186} c={C.red}>rude</Row>
        <Row at={202} c={C.red}>impatient</Row>
        <Row at={224} c={C.red}>plans he never finished</Row>
      </div>
      <Label size={34} delay={120}>as described by Harlow, 1868</Label>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:50,opacity:ease(f,276,284)}}>
      <Title size={90} delay={278}>His friends said he was</Title>
      <Stamp at={306} size={150}>“NO LONGER<br/>GAGE”</Stamp>
    </AbsoluteFill>}
  </Cam>);
};

const Neuro = () => {
  const f=useCurrentFrame(); const dist=8.6;
  return (<Cam keys={[[0,1.08,50,45],[30,1,50,45],[130,1.05,50,48],[136,1,50,45],[197,1.05,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:6}}>
      <Title size={80}>The iron destroyed<br/>part of his</Title>
      <Title size={108} color={C.orange} delay={36}>left frontal lobe</Title>
    </AbsoluteFill>
    <Abs x={40} y={470}><Gage3D width={1000} height={760} lobe={1} dark={ease(f,60,110)} path={1} dist={dist}/></Abs>
    <HTag p={LFRONT_PT} ang={G_ORBIT} dist={dist} w={1000} h={760} ox={40} oy={470} text="left frontal lobe" o={ease(f,40,50)} lx={90} ly={560} color={C.yellow}/>
    <AbsoluteFill style={{alignItems:'center',paddingTop:1190}}><div style={{display:'flex',gap:18}}>
      <Chip at={72} c={C.card} size={60}>PLANS</Chip><Chip at={100} c={C.card} size={60}>HOLDS YOU BACK</Chip>
    </div></AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:1310}}><Pill at={134} bg={C.yellow} size={50}>📌 SAVE THIS · it’s on every neuro exam</Pill></AbsoluteFill>
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,146,152), b=ease(f,146,152)*(1-ease(f,262,268)), c=ease(f,262,268)*(1-ease(f,326,332)), d=ease(f,326,332);
  return (<Cam keys={[[0,1.1,50,45],[24,1,50,45],[146,1.05,50,45],[152,1,50,45],[262,1.04,50,48],[268,1,50,45],[326,1.03,50,45],[332,1,50,45],[395,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:34,opacity:a}}>
      <Title size={130} color={C.orange}>The twist</Title>
      <Flip at={30} axis="Y"><div style={{width:820,background:C.card,borderRadius:28,padding:'30px 36px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontSize:130,lineHeight:1}}>🐎</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:84,color:'#fff'}}>STAGECOACH DRIVER</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:C.yellow}}>Valparaíso, Chile · about 7 years</div>
      </div></Flip>
      <Pill at={112} bg={C.green} color="#fff" size={60}>a job that needs planning</Pill>
      <StickDoc pose="point" mood="surprised" size={240} delay={60}/>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:30,opacity:b}}>
      <Pill at={148} bg={C.orange} color="#fff" size={54}>BRAIN STORY #3</Pill>
      <Title size={118} delay={150}>Still the<br/><span style={{color:C.orange}}>same man?</span></Title>
      <QCard at={170} foot="I’ll post my answer tonight"/>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'260px 60px 0',gap:36,opacity:c}}>
      <Title size={100} delay={264}>Send this to your<br/><span style={{color:C.yellow}}>study partner</span></Title>
      <Pill at={292} bg={C.card} color="#fff" size={56}>see if they agree 👀</Pill>
      <div style={{textAlign:'center',marginTop:20}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:C.text}}>Sources: Harlow JM. Recovery from the passage of an iron bar through the head. Publ Mass Med Soc 1868;2:327–347 · Macmillan M. An Odd Kind of Fame (2000)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.mute,marginTop:6}}>Photos: Wikimedia Commons, public domain (Gage family collection; S. A. Eliot 1911; J.B.S. Jackson 1870) · railroad scene: AI illustration</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:20,opacity:d}}>
      <Flip at={328}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={332}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={320} delay={334}/>
      <div style={{opacity:ease(f,340,348),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'14px 36px',borderRadius:14}}>FOLLOW FOR STORY #4 · #NeuroMot</div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, accident:Accident, survive:Survive, doctor:Doctor, neuro:Neuro, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.07,1.39,'*1848*.'],[1.64,4.32,'Doctors said this man was *NO LONGER* the same man.'],[4.57,6.57,'His name was *Phineas Gage*.'],
  [6.86,8.18,'*Same man*, or *not*?'],[8.43,9.43,'Tell me at the end…'],[9.50,10.32,'*1* or *2*.'],
  [10.57,12.61,'He was a *railroad foreman* in Vermont.'],[12.64,15.25,'One afternoon, an *explosion* shot his iron rod…'],[15.29,16.43,'over *1 meter* long,'],[16.46,17.64,'*13 pounds*…'],[17.79,19.14,'straight through the *front of his head*.'],
  [19.26,20.50,'And he *SURVIVED*.'],[20.54,22.07,'He may not even have *passed out*.'],[22.25,24.57,'Honestly, I almost pass out in *anatomy lab*.'],
  [24.63,26.14,'But his doctor, *John Harlow*,'],[26.29,27.64,'noticed something *strange*.'],[27.82,30.07,'Before: *careful*, a great *planner*.'],[30.25,32.07,'After: *rude*, *impatient*,'],[32.14,33.79,'full of plans he *never finished*.'],
  [33.86,36.14,'His friends said he was “*no longer Gage*”.'],
  [36.27,38.64,'The iron destroyed part of his *LEFT frontal lobe*…'],[38.68,40.64,'the part that *plans*, and *holds you back*.'],[40.75,41.21,'*Save* that.'],[41.25,42.71,'It’s on every *neuro exam*.'],
  [42.84,43.71,'Here’s the *twist*.'],[43.86,46.50,'Later, he drove *stagecoaches* in Chile for *YEARS*.'],[46.55,47.86,'A job that needs *planning*.'],
  [47.96,49.86,'So… was he still the *same man*?'],[49.93,50.71,'*1* for yes,'],[50.79,51.57,'*2* for no.'],[51.64,52.69,'Send this to your *study partner*,'],[52.74,53.79,'and see if they *agree*.'],
  [53.89,55.90,'*Dr. Mot*, one brain story at a time.'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #3</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1848</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
