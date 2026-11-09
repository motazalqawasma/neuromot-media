import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {Frontal3D, CUT_PT, FRONT_PT, THAL_PT, projectFrontal, frontalAngle} from './Frontal3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 2 (2026-11-09, atempo 1.08 → 51.54 s) — scene starts 0, 12.43, 21.90, 30.55, 40.59 s
const scenes = [
  {id:'hook', d:12.43},{id:'family', d:9.47},{id:'surgery', d:8.65},{id:'answer', d:10.04},{id:'end', d:11.6},
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

// ---------- scenes (Brain Story #2 — Rosemary Kennedy and the 1941 lobotomy) ----------
const XMark: React.FC<{at:number; size?:number}> = ({at,size=140}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{position:'absolute',left:'50%',top:'50%',transform:`translate(-50%,-50%) scale(${0.6+0.4*p})`,opacity:p}}>
    <path d="M15 15 L85 85 M85 15 L15 85" stroke={C.red} strokeWidth={14} strokeLinecap="round"/></svg>);};
const IconCard: React.FC<{at:number; icon:string; label:string; x?:number; c?:string}> = ({at,icon,label,x,c=C.card}) => (
  <Flip at={at} axis="Y"><div style={{position:'relative',width:300,height:300,background:c,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontSize:120,lineHeight:1}}>{icon}</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',marginTop:10}}>{label}</div>
    {x!==undefined && <XMark at={x}/>}</div></Flip>);

const Hook = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=frontalAngle(f,fps,0.9,false), dist=8.2;
  return (<Cam keys={[[0,1.1,50,45],[36,1,50,45],[50,1,50,45],[120,1.05,50,45],[126,1,50,45],[196,1.06,50,40],[204,1,50,45],[258,1.05,50,50],[264,1,50,50],[373,1.06,50,50]]}>
    {f<56 && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:30,opacity:1-ease(f,50,56)}}>
      <div style={{transform:`perspective(1400px) rotateX(${14-14*ease(f,0,20)}deg) scale(${1.15-0.15*ease(f,0,30)})`}}><Title size={330} color={C.orange}>1941</Title></div>
      <Pill at={4} bg={C.red} color="#fff" size={58}>AWAKE BRAIN SURGERY · AGE 23</Pill>
    </AbsoluteFill>}
    {f>=50 && f<126 && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:40,opacity:ease(f,50,58)*(1-ease(f,120,126))}}>
      <Title size={110} delay={52}>She was <span style={{color:C.red}}>awake</span></Title>
      <Photo src="fw1941.jpg" w={600} h={700} at={56} rot={-3} label="Freeman & Watts, 1941" credit="Harris & Ewing / Saturday Evening Post 1941 · public domain"/>
    </AbsoluteFill>}
    {f>=120 && f<204 && <AbsoluteFill style={{opacity:ease(f,120,128)*(1-ease(f,196,204))}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:220}}><Title size={92} delay={122}>two doctors cut<br/><span style={{color:C.orange}}>inside her brain</span></Title></AbsoluteFill>
      <Abs x={40} y={470}><Frontal3D width={1000} height={880} glow={1} cut={0} lobe={0.6} orbit={0.9} sway={false} dist={dist}/></Abs>
      <HTag p={FRONT_PT} ang={ang} dist={dist} w={1000} h={880} ox={40} oy={470} text="frontal lobe" o={ease(f,140,150)} lx={600} ly={1240} color={C.yellow}/>
    </AbsoluteFill>}
    {f>=196 && f<264 && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:30,opacity:ease(f,196,204)*(1-ease(f,258,264))}}>
      <Photo src="rosemary_f.jpg" w={560} h={680} at={198} rot={3} label="Rosemary Kennedy" credit="Richard Sears, 1931 · JFK Library · public domain" />
      <Pill at={214} bg={C.orange} color="#fff" size={56}>her name</Pill>
    </AbsoluteFill>}
    {f>=258 && <AbsoluteFill style={{alignItems:'center',paddingTop:280,gap:34}}>
      <Title size={110} delay={260}>What did they <span style={{color:C.orange}}>cut?</span></Title>
      <Flip at={272}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 40px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:80,color:C.yellow}}>COMMENT 1 OR 2 👇</div>
        <div style={{display:'flex',flexDirection:'column',gap:14,alignItems:'center',marginTop:16}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:C.red,padding:'6px 26px',borderRadius:14}}>1 = frontal lobe connections</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:C.blue,padding:'6px 26px',borderRadius:14}}>2 = the brainstem</div>
        </div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:C.text,marginTop:14}}>answer at the end</div>
      </div></Flip>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={290}/><StickDoc pose="think" mood="flat" size={250} delay={286}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const Family = () => {
  const f=useCurrentFrame();
  const a=f<92, b=f>=88&&f<176, c=f>=172;
  return (<Cam keys={[[0,1.05,50,45],[88,1,50,45],[92,1,50,45],[172,1.05,50,45],[176,1,50,50],[284,1.06,50,50]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:30,opacity:1-ease(f,86,92)}}>
      <Title size={96}>Sister of a<br/><span style={{color:C.orange}}>future president</span></Title>
      <div style={{display:'flex',gap:14,marginTop:20}}>{Array.from({length:9},(_,i)=>{const p=ease(f,10+i*4,18+i*4); const me=i===2; return (
        <div key={i} style={{width:96,height:240,borderRadius:48,background:me?C.orange:C.line,opacity:p,transform:`translateY(${(1-p)*40}px) scale(${me?1.15:1})`,display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:8,fontFamily:HEAD,fontWeight:900,fontSize:34,color:'#fff'}}>{i===1?'JFK':me?'R':''}</div>);})}</div>
      <Label size={46} color={C.text} delay={30}>9 Kennedy children · Rosemary was number 3</Label>
      <Chip at={52} c={C.card} size={60}>JFK = <span style={{color:C.yellow}}>&nbsp;her older brother</span></Chip>
      <StickDoc pose="point" mood="flat" size={260} delay={60}/>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:40,opacity:ease(f,88,96)*(1-ease(f,170,176))}}>
      <Title size={96} delay={90}>She learned<br/><span style={{color:C.yellow}}>more slowly</span></Title>
      <div style={{display:'flex',flexDirection:'column',gap:18,width:780}}>{[1,1,0.45,1,1].map((v,i)=>{const p=ease(f,100+i*5,130+i*5); const me=i===2; return (
        <div key={i} style={{display:'flex',alignItems:'center',gap:18}}><div style={{width:200,fontFamily:HEAD,fontWeight:900,fontSize:40,color:me?C.orange:C.mute}}>{me?'ROSEMARY':''}</div>
          <div style={{flex:1,height:46,background:C.bg2,borderRadius:23,overflow:'hidden'}}><div style={{width:`${v*p*100}%`,height:'100%',background:me?C.orange:C.gray,borderRadius:23}}/></div></div>);})}</div>
      <Label size={40} delay={120}>today: support and special schools · in 1941: hidden</Label>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:36,opacity:ease(f,172,180)}}>
      <Title size={100} delay={174}>Her father<br/>said <span style={{color:C.red}}>yes</span></Title>
      <Flip at={182}><div style={{width:640,background:'#f4f1ea',borderRadius:10,padding:'30px 40px',boxShadow:'0 20px 50px rgba(0,0,0,.6)',transform:'rotate(-2deg)',color:C.bg}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:56}}>CONSENT · 1941</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:30,marginTop:10}}>A NEW operation: prefrontal lobotomy</div>
        <div style={{height:2,background:'#999',margin:'18px 0'}}/>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28}}>Father: <span style={{fontFamily:'cursive',fontSize:44}}>J. P. Kennedy</span></div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,marginTop:8,position:'relative'}}>Mother: <span style={{color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:40}}>NOT TOLD</span></div>
      </div></Flip>
      <StickDoc pose="facepalm" mood="worried" size={260} delay={230}/>
    </AbsoluteFill>}
  </Cam>);
};

const Surgery = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=frontalAngle(f,fps,0.9,false), dist=8.2;
  const a=f<96, b=f>=90;
  const cut=ease(f,206,246);
  return (<Cam keys={[[0,1.05,50,45],[90,1,50,45],[96,1,50,45],[200,1.08,52,48],[246,1,50,45],[260,1.05,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:30,opacity:1-ease(f,90,96)}}>
      <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
        <Photo src="freeman.jpg" w={430} h={520} at={2} rot={-4} label="Walter Freeman" credit="neurologist · Harris & Ewing 1941 · public domain" pos="50% 20%"/>
        <Photo src="fw1941.jpg" w={430} h={520} at={14} rot={4} label="+ James Watts" credit="neurosurgeon · Saturday Evening Post 1941 · public domain"/>
      </div>
      <Pill at={30} bg={C.yellow} size={56}>in through the TOP of the head</Pill>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{opacity:ease(f,90,98)}}>
      <Abs x={40} y={380}><Frontal3D width={1000} height={900} glow={1} cut={cut} lobe={0.5} orbit={0.9} sway={false} dist={dist}/></Abs>
      <HTag p={THAL_PT} ang={ang} dist={dist} w={1000} h={900} ox={40} oy={380} text="deep brain" o={ease(f,100,110)*(1-ease(f,200,206))} lx={90} ly={1150}/>
      {f<206 && <AbsoluteFill style={{alignItems:'center',paddingTop:220}}><Title size={84} delay={92}>while they cut, she was asked to…</Title></AbsoluteFill>}
      {[{t:'🙏 say a prayer',at:132,x:120,y:420},{t:'🎵 sing',at:168,x:620,y:520}].map(b=>{const p=ease(f,b.at,b.at+8)*(1-ease(f,206,226)); return (
        <div key={b.t} style={{position:'absolute',left:b.x,top:b.y,opacity:p,transform:`scale(${0.6+0.4*p})`,background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:62,padding:'10px 30px',borderRadius:30,boxShadow:'0 10px 0 #0B0B0E'}}>{b.t}</div>);})}
      {f>=206 && <AbsoluteFill style={{alignItems:'center',paddingTop:220}}>
        <div style={{opacity:ease(f,212,218),transform:`scale(${1.5-0.5*ease(f,212,220)}) rotate(-5deg)`,border:`10px solid ${C.red}`,color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:120,padding:'0 40px',borderRadius:20,background:'rgba(26,27,32,.85)'}}>HER WORDS STOPPED</div>
      </AbsoluteFill>}
      {f>=206 && <svg width={1080} height={120} style={{position:'absolute',left:0,top:1240,opacity:ease(f,206,212)}}>
        <path d={Array.from({length:109},(_,i)=>{const x=i*10; const amp=i*10<1080*(1-ease(f,214,246))?28*Math.sin(i*0.9+f*0.6):0; return `${i?'L':'M'}${x} ${60+amp}`;}).join(' ')} stroke={C.green} strokeWidth={6} fill="none"/></svg>}
    </AbsoluteFill>}
  </Cam>);
};

const Answer = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=frontalAngle(f,fps,0.9,false), dist=8.2;
  const a=f<184, b=f>=178;
  return (<Cam keys={[[0,1.08,50,45],[30,1,50,45],[178,1.05,50,45],[184,1,50,45],[301,1.07,50,50]]}>
    {a && <AbsoluteFill style={{opacity:1-ease(f,178,184)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:10}}>
        <Title size={96}>The answer: <span style={{color:C.red}}>1</span></Title>
        <Title size={66} color={C.orange} delay={30}>the frontal lobe’s connections</Title>
      </AbsoluteFill>
      <Abs x={40} y={440}><Frontal3D width={1000} height={760} glow={0.6} cut={1} lobe={1} orbit={0.9} sway={false} dist={dist}/></Abs>
      <HTag p={CUT_PT} ang={ang} dist={dist} w={1000} h={760} ox={40} oy={440} text="cut here" o={ease(f,20,30)} lx={640} ly={1100} color="#ffc9cf"/>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1210}}><div style={{display:'flex',gap:18}}>
        {[{t:'PLAN',at:60},{t:'DECIDE',at:80},{t:'START WORDS',at:100}].map(x=><div key={x.t} style={{position:'relative'}}><Chip at={x.at} c={C.card} size={52}>{x.t}</Chip><div style={{position:'absolute',inset:0}}><XMark at={x.at+30} size={90}/></div></div>)}
      </div></AbsoluteFill>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40,opacity:ease(f,178,186)}}>
      <Title size={100} delay={180}>After the operation</Title>
      <div style={{display:'flex',gap:40}}><IconCard at={186} icon="🚶" label="WALK" x={200}/><IconCard at={196} icon="🗣️" label="SPEAK" x={214}/></div>
      <div style={{opacity:ease(f,276,282),transform:`scale(${1.5-0.5*ease(f,276,284)}) rotate(-4deg)`,border:`10px solid ${C.red}`,color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:110,padding:'0 40px',borderRadius:20}}>EVER AGAIN</div>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,96,102), b=ease(f,96,102)*(1-ease(f,180,186)), c=ease(f,180,186)*(1-ease(f,276,282)), d=ease(f,276,282);
  const yr=Math.round(1941+(2005-1941)*ease(f,6,70));
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[96,1.04,50,45],[102,1,50,45],[180,1.04,50,45],[186,1,50,50],[276,1.05,50,45],[282,1,50,45],[348,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30,opacity:a}}>
      <Title size={100}>She lived <span style={{color:C.yellow}}>63</span> more years</Title>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:220,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>{yr}</div>
      <div style={{width:780,height:22,background:C.bg2,borderRadius:11,overflow:'hidden'}}><div style={{width:`${100*ease(f,6,70)}%`,height:'100%',background:`linear-gradient(90deg,${C.red},${C.orange})`}}/></div>
      <Pill at={40} bg={C.card} color="#fff" size={54}>mostly in a home in Wisconsin</Pill>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:28,opacity:b}}>
      <Photo src="eunice_f.jpg" w={520} h={600} at={100} rot={-3} label="Eunice Kennedy Shriver" credit="her sister · Claire Flanders 1982 · public domain" pos="50% 25%"/>
      <Chip at={118} c={C.green} size={60}>founded the Special Olympics · 1968</Chip>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'230px 60px 0',gap:26,opacity:c}}>
      <Pill at={182} bg={C.orange} color="#fff" size={54}>BRAIN STORY #2</Pill>
      <Title size={104} delay={184}>Did you <span style={{color:C.orange}}>get it?</span></Title>
      <Flip at={190}><div style={{background:C.card,borderRadius:28,padding:'26px 36px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:C.green,padding:'6px 26px',borderRadius:14}}>1 = frontal lobe connections ✓</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:56,color:C.yellow,marginTop:16}}>comment 1 or 2 · I reply to every answer</div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,196,206)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:C.text}}>Sources: Larson KC. Rosemary: The Hidden Kennedy Daughter (2015) · Freeman W, Watts JW. Psychosurgery (1942)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.mute,marginTop:6}}>Photos: Wikimedia Commons, public domain (Harris & Ewing 1941; R. Sears / JFK Library 1931; C. Flanders 1982)</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:20,opacity:d}}>
      <Flip at={278}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={282}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={320} delay={284}/>
      <div style={{opacity:ease(f,290,298),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'14px 36px',borderRadius:14}}>FOLLOW FOR STORY #3 · #NeuroMot</div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, family:Family, surgery:Surgery, answer:Answer, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.05,1.22,'*1941*.'],[1.84,3.77,'A 23-year-old woman lay *AWAKE*…'],[4.06,6.13,'while two doctors cut *inside her brain*.'],[6.58,8.24,'Her name was *Rosemary Kennedy*.'],
  [8.73,9.47,'What did they *cut*?'],[9.84,10.82,'*1* or *2*…'],[11.23,11.91,'answer at the end.'],
  [12.43,14.31,'She was the sister of a *future president*,'],[14.55,15.25,'*John F. Kennedy*.'],[15.64,17.97,'She learned *more slowly* than her brothers and sisters.'],
  [18.28,20.11,'Her father arranged a *NEW* operation…'],[20.40,21.53,'and did *not* tell her mother.'],
  [21.90,24.98,'*Walter Freeman* and *James Watts* went in through the top of her head.'],[25.36,25.97,'While they cut,'],[26.27,27.54,'she was asked to say a *prayer*…'],[27.89,28.43,'and to *sing*.'],[28.82,30.01,'Then her words *STOPPED*.'],
  [30.55,31.06,'The answer:'],[31.37,31.66,'*1*,'],[31.94,33.34,'the *CONNECTIONS* of the frontal lobe,'],[33.65,36.29,'the part that *plans*, *decides* and starts our *words*.'],
  [36.50,39.39,'After the operation, she could not *walk*, or *speak* clearly.'],[39.71,40.28,'*Ever again*.'],
  [40.59,43.72,'She lived *63* more years, mostly in a home in Wisconsin.'],[44.01,46.49,'Her sister *Eunice* later founded the *Special Olympics*.'],
  [46.85,47.10,'So…'],[47.46,47.98,'*1* or *2*,'],[48.26,48.67,'did you get it?'],[49.01,51.22,'*Dr. Mot*, one brain story at a time.'],
];
const Captions: React.FC = () => {
  const f=useCurrentFrame(); const t=f/S; const {fps}=useVideoConfig();
  const i=CAPS.findIndex(([a,b])=>t>=a-0.05&&t<=b+0.25); if(i<0) return null;
  const [a,b,txt]=CAPS[i]; const words=txt.split(' ');
  const shown=Math.max(1,Math.ceil(words.length*Math.min(1,(t-a)/Math.max(0.3,(b-a)*0.85))));
  const pop=spring({frame:f-Math.round(a*S),fps,config:{damping:11,mass:0.5}});
  return (<div style={{position:'absolute',left:60,right:60,top:1420,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 18px',transform:`scale(${0.85+0.15*pop})`}}>
    {(()=>{let on=false; return words.map((w,j)=>{const st=w.startsWith('*'); if(st) on=true; const key=on; if(w.replace(/[.,…?!:]+$/,'').endsWith('*')) on=false; const clean=w.replace(/\*/g,''); return (
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #2</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1941</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
