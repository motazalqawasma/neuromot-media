import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {projectFrontal} from './Frontal3D';
import {Gage3D, G_ORBIT, BROCA_PT} from './Gage3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-13, atempo 1.12 -> ~58.2 s), word times from ElevenLabs Scribe / 1.12
const R = 1.12;
const scenes = [
  {id:'hook', d:11.65/R},{id:'who', d:(21.77-11.65)/R},{id:'understood', d:(29.64-21.77)/R},{id:'broca', d:(38.49-29.64)/R},{id:'brain', d:(47.12-38.49)/R},{id:'end', d:(65.6-47.12)/R},
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

// ---------- scenes (Brain Story #4 - "Tan", Louis Victor Leborgne, 1861) ----------
const Stamp: React.FC<{at:number; c?:string; size?:number; children:React.ReactNode}> = ({at,c=C.red,size=120,children}) => {const f=useCurrentFrame(); return (
  <div style={{opacity:ease(f,at,at+6),transform:`scale(${1.5-0.5*ease(f,at,at+8)}) rotate(-5deg)`,border:`10px solid ${c}`,color:c,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'10px 40px',borderRadius:20,background:'rgba(26,27,32,.85)',textAlign:'center'}}>{children}</div>);};
const QCard: React.FC<{at:number; foot:string}> = ({at,foot}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 40px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:C.yellow}}>COMMENT 1 OR 2</div>
    <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',background:C.blue,padding:'6px 22px',borderRadius:14,whiteSpace:'nowrap'}}>1 = LOSE SPEECH</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',background:C.red,padding:'6px 22px',borderRadius:14,whiteSpace:'nowrap'}}>2 = LOSE MOVEMENT</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:46,color:C.text,marginTop:14}}>{foot}</div>
  </div></Flip>);
const Bubble: React.FC<{at:number; children:React.ReactNode; size?:number}> = ({at,children,size=150}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{position:'relative',opacity:p,transform:`scale(${0.5+0.5*p})`,background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'24px 60px',borderRadius:60,boxShadow:'0 12px 0 #0B0B0E'}}>
    {children}<div style={{position:'absolute',left:90,bottom:-40,width:0,height:0,borderLeft:'30px solid transparent',borderRight:'30px solid transparent',borderTop:'48px solid #fff'}}/></div>);};

const Hook = () => {
  const f=useCurrentFrame();
  const a=f<116, b=f>=110&&f<175, c=f>=169;
  return (<Cam keys={[[0,1.1,50,45],[40,1,50,45],[110,1.04,50,45],[116,1.12,50,42],[150,1,50,45],[169,1.05,50,45],[175,1,50,45],[312,1.06,50,46]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:250}}><Pill at={2} bg={C.yellow} size={52}>LOSE SPEECH OR MOVEMENT? · 1 / 2</Pill></AbsoluteFill>
    {a && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:26,opacity:1-ease(f,110,116)}}>
      <div style={{transform:`perspective(1400px) rotateX(${14-14*ease(f,0,20)}deg) scale(${1.15-0.15*ease(f,0,30)})`}}><Title size={290} color={C.orange}>21 years</Title></div>
      <Title size={110} delay={44}>only <span style={{color:C.yellow}}>one</span> word</Title>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:60,opacity:ease(f,110,116)*(1-ease(f,169,175))}}>
      <Bubble at={112} size={230}>“TAN.”</Bubble>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><Label size={70} delay={128} color={C.text}>that’s it.</Label></div>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:34,opacity:ease(f,169,177)}}>
      <Title size={112} delay={171}>Lose your <span style={{color:C.blue}}>speech</span><br/>or your <span style={{color:C.red}}>movement?</span></Title>
      <QCard at={196} foot="tell me at the end"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={240}/><StickDoc pose="think" mood="flat" size={250} delay={236}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const Who = () => {
  const f=useCurrentFrame();
  const a=f<134, b=f>=128&&f<222, c=f>=216;
  const bar=ease(f,150,205);
  return (<Cam keys={[[0,1.06,50,45],[128,1.1,50,45],[134,1,50,45],[216,1.05,50,45],[222,1,50,45],[271,1.06,50,42]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:44,opacity:1-ease(f,128,134)}}>
      <Title size={150}>Paris, <span style={{color:C.orange}}>1840</span></Title>
      <Chip at={44} c={C.card} size={68}>a 30-year-old craftsman</Chip>
      <Label size={36} delay={56}>he made forms for shoemakers</Label>
      <Stamp at={92} size={110}>LOSES HIS SPEECH</Stamp>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:280,gap:46,opacity:ease(f,128,136)*(1-ease(f,216,222))}}>
      <Title size={118} delay={130}>Bicêtre <span style={{color:C.orange}}>Hospital</span></Title>
      <Label size={44} delay={140}>Paris</Label>
      <div style={{width:860,marginTop:40}}>
        <div style={{display:'flex',justifyContent:'space-between',fontFamily:HEAD,fontWeight:900,fontSize:64,color:C.text}}><span>1840</span><span style={{opacity:ease(f,195,205)}}>1861</span></div>
        <div style={{height:34,background:C.line,borderRadius:17,marginTop:14,overflow:'hidden'}}><div style={{height:'100%',width:`${bar*100}%`,background:`linear-gradient(90deg, ${C.orange}, ${C.red})`}}/></div>
        <div style={{textAlign:'center',marginTop:22}}><Pill at={176} bg={C.red} color="#fff" size={62}>never came out · 21 years</Pill></div>
      </div>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:330,gap:60,opacity:ease(f,216,224)}}>
      <Title size={96} delay={218}>Everyone called him</Title>
      <Stamp at={226} size={210} c={C.orange}>“TAN”</Stamp>
    </AbsoluteFill>}
  </Cam>);
};

const Row: React.FC<{at:number; c:string; children:React.ReactNode}> = ({at,c,children}) => {const s=useSpring(at); return (
  <div style={{transform:`translateX(${(1-s)*-60}px)`,opacity:s>0.02?1:0,background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'14px 28px',fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};
const Understood = () => {
  const f=useCurrentFrame();
  const a=f<134, b=f>=128;
  return (<Cam keys={[[0,1.05,50,45],[30,1.1,50,45],[40,1,50,45],[128,1.04,50,45],[134,1,50,45],[211,1.06,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:30,opacity:1-ease(f,128,134)}}>
      <Title size={84}>But here’s the thing</Title>
      <Stamp at={30} c={C.green} size={130}>HE UNDERSTOOD</Stamp>
      <div style={{display:'flex',flexDirection:'column',gap:20,width:860,marginTop:20}}>
        <Row at={46} c={C.green}>almost everything said to him</Row>
        <Row at={84} c={C.green}>read the time on a watch</Row>
      </div>
      <Label size={34} delay={60}>as described by Broca, 1861</Label>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:30,opacity:ease(f,128,136)}}>
      <Title size={92} delay={130}>Me before an<br/><span style={{color:C.orange}}>8 a.m. lecture</span></Title>
      <div style={{position:'relative',marginTop:120}}>
        <div style={{position:'absolute',left:210,top:-110,opacity:ease(f,142,150),transform:`scale(${0.6+0.4*ease(f,142,150)})`,transformOrigin:'left bottom',background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'12px 26px',borderRadius:26,whiteSpace:'nowrap',boxShadow:'0 8px 0 #0B0B0E'}}>what time is it?? ⏰</div>
        <StickDoc pose="facepalm" mood="worried" size={420} delay={134} sweat/>
      </div>
    </AbsoluteFill>}
  </Cam>);
};

const BrocaScene = () => {
  const f=useCurrentFrame();
  const a=f<96, b=f>=90;
  return (<Cam keys={[[0,1.06,50,45],[40,1.1,50,45],[46,1,50,45],[90,1.05,50,45],[96,1,50,45],[214,1.08,50,40],[237,1.1,50,40]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:280,gap:44,opacity:1-ease(f,90,96)}}>
      <Title size={100}>After about <span style={{color:C.orange}}>10 years</span></Title>
      <Stamp at={40} size={130}>RIGHT SIDE</Stamp>
      <Chip at={52} c={C.card} size={76}>paralyzed</Chip>
      <Label size={36} delay={60}>arm first, then leg</Label>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:26,opacity:ease(f,90,98)}}>
      <Title size={110} delay={92}>April <span style={{color:C.orange}}>1861</span></Title>
      <Photo src="broca.jpg" w={560} h={640} at={150} rot={3} label="Dr. Paul Broca, surgeon" credit="photo: Pierre Petit, about 1860 · public domain" pos="50% 25%"/>
      <Pill at={214} bg={C.red} color="#fff" size={60}>days later… he died · 17 April</Pill>
    </AbsoluteFill>}
  </Cam>);
};

const Brain = () => {
  const f=useCurrentFrame(); const dist=8.2;
  const a=f<76, b=f>=70;
  const pulse=((f-120)%30+30)%30/30;
  return (<Cam keys={[[0,1.04,50,45],[70,1.08,50,45],[76,1,50,45],[126,1.08,50,55],[150,1,50,45],[231,1.05,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:1-ease(f,70,76)}}>
      <Title size={90}>Broca opened<br/><span style={{color:C.orange}}>his brain</span></Title>
      <Photo src="brain1.jpg" w={600} h={700} at={2} rot={-2} label="Tan’s real brain, Paris" credit="Musée Dupuytren · photo Selbymay, CC BY-SA 4.0" pos="50% 45%"/>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{opacity:ease(f,70,78)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:6}}>
        <Title size={80} delay={72}>damage in the</Title>
        <Title size={112} color={C.orange} delay={76}>left frontal lobe</Title>
      </AbsoluteFill>
      <Abs x={40} y={470}><Gage3D width={1000} height={760} lobe={0.55*(1-ease(f,120,140))+0.15} spot={ease(f,118,128)} pulse={f>120?pulse:0} dist={dist}/></Abs>
      <HTag p={BROCA_PT} ang={G_ORBIT} dist={dist} w={1000} h={760} ox={40} oy={470} text="BROCA’S AREA" o={ease(f,124,134)} lx={110} ly={1060} color={C.yellow}/>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1190}}><Chip at={186} c={C.red} size={68}>SPEECH OUTPUT</Chip></AbsoluteFill>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1310}}><Pill at={156} bg={C.yellow} size={50}>SAVE THIS · exam classic</Pill></AbsoluteFill>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,229,235), b=ease(f,229,235)*(1-ease(f,326,332)), c=ease(f,326,332)*(1-ease(f,415,421)), d=ease(f,415,421);
  return (<Cam keys={[[0,1.1,50,45],[24,1,50,45],[112,1.05,50,45],[118,1,50,45],[180,1.06,50,45],[186,1,50,45],[229,1.05,50,45],[235,1,50,45],[326,1.04,50,48],[332,1,50,45],[415,1.03,50,45],[421,1,50,45],[553,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:240,gap:30,opacity:a}}>
      <Title size={120} color={C.orange}>The twist</Title>
      <Flip at={20} axis="Y"><div style={{width:860,background:C.card,borderRadius:28,padding:'26px 36px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:110,color:'#fff',lineHeight:1}}>150 YEARS</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:C.yellow}}>nobody knew his name</div>
      </div></Flip>
      <Chip at={112} c={C.blue} size={56}>2013 · historian Cezary Domański, Poland</Chip>
      <div style={{marginTop:10}}><Flip at={182}><div style={{background:C.text,color:C.bg,borderRadius:22,padding:'16px 40px',textAlign:'center',boxShadow:'0 12px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:96,lineHeight:1}}>LOUIS VICTOR LEBORGNE</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:46,color:'#555'}}>born 1809, Moret, France</div>
      </div></Flip></div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:30,opacity:b}}>
      <Pill at={231} bg={C.orange} color="#fff" size={54}>BRAIN STORY #4</Pill>
      <Title size={110} delay={233}>Lose <span style={{color:C.blue}}>speech</span>,<br/>or lose <span style={{color:C.red}}>movement?</span></Title>
      <QCard at={250} foot="I’ll post my answer tonight"/>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'250px 60px 0',gap:32,opacity:c}}>
      <Title size={92} delay={328}>Send this to the friend<br/>who mixes up</Title>
      <div style={{display:'flex',gap:20}}><Chip at={350} c={C.orange} size={72}>BROCA</Chip><Chip at={362} c={C.blue} size={72}>WERNICKE</Chip></div>
      <div style={{textAlign:'center',marginTop:20}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:C.text}}>Sources: Broca P. Bull Soc Anthropol Paris 1861;2:235–238 · Dronkers NF et al. Brain 2007;130:1432–1441, doi:10.1093/brain/awm042 · Domanski CW. J Hist Neurosci 2013;22:47–52, doi:10.1080/0964704X.2012.667528</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.mute,marginTop:6}}>Photos: Wikimedia Commons (Pierre Petit, public domain; Selbymay, CC BY-SA 4.0)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:20,opacity:d}}>
      <Flip at={417}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={421}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={320} delay={423}/>
      <div style={{opacity:ease(f,429,437),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'14px 36px',borderRadius:14}}>FOLLOW FOR STORY #5 · #NeuroMot</div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, who:Who, understood:Understood, broca:BrocaScene, brain:Brain, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = ([
  [0.13,1.48,'For *21 YEARS*,'],[1.68,4.08,'this man could say only *ONE* word.'],[4.4,5.28,'“*Tan*.”'],[5.36,6.08,'That’s it.'],[6.4,8.24,'Would you rather lose your *speech*…'],[8.28,9.36,'or your *movement*?'],[9.52,10.48,'*1* or *2*.'],[10.56,11.6,'Tell me at the end.'],
  [12.03,13.36,'*Paris, 1840*.'],[13.44,16.64,'A 30-year-old craftsman suddenly loses his *SPEECH*.'],[16.72,18.56,'He goes into *Bicêtre Hospital*…'],[18.64,19.84,'and *never* comes out.'],[20.0,21.76,'Everyone just calls him “*Tan*”.'],
  [21.83,22.88,'But here’s the thing.'],[22.96,24.88,'He *UNDERSTOOD* almost everything.'],[24.96,26.56,'He could read the time on a *watch*.'],[26.8,29.6,'Honestly… better than me before an *8 a.m. lecture*.'],
  [29.8,31.12,'After about *10 years* there,'],[31.2,33.2,'his *RIGHT side* became paralyzed.'],[33.28,34.8,'In *April 1861*,'],[34.84,36.8,'he met a surgeon, *Paul Broca*.'],[36.92,38.48,'Days later… he *died*.'],
  [38.56,40.72,'Broca opened his brain and found the damage'],[40.8,42.48,'in the *LEFT frontal lobe*.'],[42.6,44.24,'Today we call it *BROCA’S area*.'],[44.4,45.04,'*Save* that.'],[45.2,45.92,'Speech *OUTPUT*.'],[46.08,46.96,'*Exam classic*.'],
  [47.19,47.92,'The *twist*?'],[48.0,51.28,'For *150 years*, nobody knew his *NAME*.'],[51.32,53.92,'In *2013*, a Polish historian found it.'],[54.08,55.76,'*Louis Victor Leborgne*.'],[55.88,58.24,'So… lose *speech*, or lose *movement*?'],[58.32,59.36,'*1* or *2*.'],[59.44,60.32,'Send this to the friend'],[60.44,62.64,'who still mixes up *Broca* and *Wernicke*.'],[62.76,65.12,'*Dr. Mot*, one brain story at a time.'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #4</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1861</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
