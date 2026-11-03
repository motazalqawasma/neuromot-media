import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {Brain3D, LOBAR, DEEP, project, brainAngle} from './Brain3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-03) — scene starts 0, 8.79, 16.67, 29.05, 36.52 s ; voice ends 46.2 s
const scenes = [
  {id:'hook', d:8.79},{id:'study', d:7.88},{id:'result', d:12.38},{id:'catch', d:7.47},{id:'end', d:11.2},
];
export const TOTAL = COVER + Math.round(scenes.reduce((a,s)=>a+s.d,0)*S);
const cl = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const ease = (f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...cl, easing:Easing.out(Easing.cubic)});
const useSpring = (delay:number)=>{const f=useCurrentFrame(); const {fps}=useVideoConfig(); return spring({frame:f-delay,fps,config:{damping:12,mass:0.6}});};

// 3D extruded title (layered depth shadow) with a tilt-in
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
// card that flips in around X in 3D
const Flip: React.FC<{at:number; children:React.ReactNode; axis?:'X'|'Y'}> = ({at,children,axis='X'}) => {
  const s=useSpring(at); return <div style={{transform:`perspective(1200px) rotate${axis}(${(1-s)*90}deg) scale(${0.6+0.4*s})`,opacity:s>0.02?1:0}}>{children}</div>;
};

// parallax particles (3 depth layers) — motion graphics background
const Particles: React.FC = () => {
  const f=useCurrentFrame();
  return (<AbsoluteFill style={{overflow:'hidden'}}>
    {Array.from({length:46},(_,i)=>{const z=random('z'+i); const sp=0.4+z*2.2; const x=random('x'+i)*1080+Math.sin(f/60+i)*20*z;
      const y=((random('y'+i)*2100 - f*sp)%2100+2100)%2100-90; const r=2+z*7;
      return <div key={i} style={{position:'absolute',left:x,top:y,width:r*2,height:r*2,borderRadius:r,background:i%7===0?C.orange:'#C9CDD6',opacity:0.06+z*0.16,filter:`blur(${(1-z)*3}px)`}}/>;})}
  </AbsoluteFill>);
};

// real journal page (CC BY) — flies in in 3D, red highlight boxes + note pills
type Box={x:number;y:number;w:number;h:number;at:number;note?:string;nx?:number;ny?:number};
const Page: React.FC<{src:string; w:number; srcW:number; boxes?:Box[]; tilt?:number; inAt?:number}> = ({src,w,srcW,boxes=[],tilt=-2,inAt=0}) => {
  const f=useCurrentFrame(); const k=w/srcW; const p=ease(f,inAt,inAt+14);
  return (<div style={{position:'relative',width:w,transform:`perspective(1800px) translateY(${(1-p)*260}px) rotateX(${(1-p)*55}deg) rotateY(${(1-p)*-18}deg) rotateZ(${tilt*p}deg)`,opacity:p,boxShadow:'0 40px 90px rgba(0,0,0,.65)',borderRadius:10,background:'#fff'}}>
    <Img src={staticFile(src)} style={{width:w,display:'block',borderRadius:10}}/>
    {boxes.map((b,i)=>{const q=ease(f,b.at,b.at+8); return (<React.Fragment key={i}>
      <div style={{position:'absolute',left:b.x*k-8,top:b.y*k-6,width:(b.w*k+16)*q,height:b.h*k+12,border:`6px solid ${C.red}`,borderRadius:8,opacity:q>0?1:0,boxShadow:`0 0 ${18*q}px rgba(224,38,58,.6)`}}/>
      {b.note && <div style={{position:'absolute',left:(b.nx??b.x)*k,top:(b.ny??(b.y+b.h))*k+22,opacity:ease(f,b.at+6,b.at+14),transform:`scale(${0.7+0.3*ease(f,b.at+6,b.at+14)})`,transformOrigin:'left top',fontFamily:HEAD,fontWeight:900,fontSize:56,color:'#fff',background:C.red,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',boxShadow:'0 8px 20px rgba(0,0,0,.4)'}}>↑ {b.note}</div>}
    </React.Fragment>);})}
  </div>);
};

// ---------- scenes (Neuro Paper #9 — ENRICH, Pradilla, NEJM 2024; paywalled → recreated title card, no page images) ----------
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Chip: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=64}) => {const s=useSpring(at); return (
  <div style={{transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0,background:c,borderRadius:18,padding:'12px 34px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 10px 0 #0B0B0E'}}>{children}</div>);};
// 2D tag pointing at a 3D point of the brain
const BTag: React.FC<{p:THREE.Vector3; ang:number; dist:number; w:number; h:number; ox:number; oy:number; text:string; o:number; lx:number; ly:number; color?:string}> = ({p,ang,dist,w,h,ox,oy,text,o,lx,ly,color='rgba(235,240,248,0.94)'}) => {
  if(o<=0) return null; const q=project(p,ang,dist,w,h); const x=ox+q.x, y=oy+q.y;
  return (<>
    <svg style={{position:'absolute',left:0,top:0,opacity:o}} width={1080} height={1920}><line x1={x} y1={y} x2={lx+60} y2={ly+30} stroke="#e8edf5" strokeWidth={4}/><circle cx={x} cy={y} r={10} fill="#fff"/></svg>
    <div style={{position:'absolute',left:lx,top:ly,opacity:o,background:color,color:'#16171B',fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',transform:`scale(${0.7+0.3*o})`,transformOrigin:'left top'}}>{text}</div>
  </>);
};

const Hook = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const joke=f>=134;
  return (<Cam keys={[[0,1,50,45],[130,1.08,50,45],[136,1,50,50],[264,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={112}>Suck the clot <span style={{color:C.orange}}>out</span>…<br/>or <span style={{color:C.orange}}>leave it</span>?</Title>
      </div>
    </AbsoluteFill>
    <Abs x={40} y={470} show={1-ease(f,128,136)}><Brain3D width={1000} height={900} dist={9.6-1.0*ease(f,0,130)}/></Abs>
    <Abs x={600} y={560} show={ease(f,95,105)*(1-ease(f,128,134))}><div style={{background:C.red,borderRadius:16,padding:'8px 22px',transform:`rotate(3deg) scale(${0.7+0.3*ease(f,95,105)})`,boxShadow:'0 10px 0 #7a1420',fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff'}}>BLEED IN THE BRAIN</div></Abs>
    <Abs x={30} y={1080} show={1-ease(f,128,134)}><div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><NameTag at={8}/><StickDoc pose="think" mood="worried" size={300}/></div></Abs>
    {joke && <AbsoluteFill style={{alignItems:'center',paddingTop:520,gap:26}}>
      <div style={{display:'flex',gap:30,alignItems:'flex-start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {[['🧠 SURGEON A','Operate!',140],['🧠 SURGEON B','Leave it.',160],['🧠 SURGEON A','OPERATE!!',180]].map(([n,t,at],i)=>(
            <Flip key={i} at={at as number}><div style={{background:i%2?C.card:C.orange,borderRadius:22,padding:'12px 26px',width:440,boxShadow:'0 8px 0 #0B0B0E'}}>
              <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:i%2?C.mute:'#3a1a02'}}>{n}</div>
              <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff'}}>{t}</div></div></Flip>))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {[['👥 GROUP CHAT','Lunch?',200],['👥 GROUP CHAT','…still deciding 🍔',222]].map(([n,t,at],i)=>(
            <Flip key={i} at={at as number}><div style={{background:C.line,borderRadius:22,padding:'12px 26px',width:440,boxShadow:'0 8px 0 #0B0B0E'}}>
              <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:C.mute}}>{n}</div>
              <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:C.yellow}}>{t}</div></div></Flip>))}
        </div>
      </div>
      <StickDoc pose="facepalm" from="think" mood="worried" size={280} sweat delay={136}/>
    </AbsoluteFill>}
  </Cam>);
};

const Study = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const card=f<74, brain=f>=68;
  const ang=brainAngle(f,fps,0.5,false), dist=7.8;
  const tube=ease(f,80,165);
  return (<Cam keys={[[0,1,50,35],[30,1.05,50,35],[70,1.05,50,35],[76,1,50,40],[178,1.06,50,35],[188,1,50,50],[236,1.04,50,50]]}>
    {card && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:40,opacity:1-ease(f,66,74)}}>
      <Flip at={0}><div style={{width:900,background:'#fff',borderRadius:14,padding:'40px 48px',boxShadow:'0 40px 90px rgba(0,0,0,.65)',transform:'rotate(-1.5deg)'}}>
        <div style={{fontFamily:'Georgia, serif',fontSize:30,color:'#b0001e',fontWeight:700,letterSpacing:1}}>The NEW ENGLAND JOURNAL of MEDICINE · 2024</div>
        <div style={{fontFamily:'Georgia, serif',fontSize:50,color:'#111',lineHeight:1.18,marginTop:22,border:`6px solid ${f>=10?C.red:'transparent'}`,borderRadius:8,padding:'6px 10px'}}>Trial of Early Minimally Invasive Removal of Intracerebral Hemorrhage</div>
        <div style={{fontFamily:'Georgia, serif',fontSize:30,color:'#444',marginTop:20}}>G. Pradilla, J.J. Ratcliff, A.J. Hall, et al., for the ENRICH Investigators</div>
      </div></Flip>
      <Label size={30} delay={8}>recreated title block · paper is not open access</Label>
      <div style={{display:'flex',gap:24,marginTop:10}}>
        <Chip at={32} c={C.red} size={80}>300 PATIENTS</Chip>
        <Chip at={40} c={C.card} size={62}>37 US CENTERS</Chip>
      </div>
    </AbsoluteFill>}
    {brain && <AbsoluteFill style={{opacity:ease(f,68,78)}}>
      <Abs x={40} y={170}><Brain3D width={1000} height={880} tubeIn={tube} orbit={0.5} sway={false} dist={dist}/></Abs>
      <BTag p={LOBAR} ang={ang} dist={dist} w={1000} h={880} ox={40} oy={170} text="the clot" o={ease(f,84,92)} lx={70} ly={820}/>
      <Abs x={60} y={230} show={ease(f,110,118)}><div style={{background:C.yellow,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'6px 24px',borderRadius:14,transform:`scale(${0.7+0.3*ease(f,110,120)})`,transformOrigin:'left top'}}>TINY TUBE ↘ through a brain groove</div></Abs>
      <div style={{position:'absolute',left:0,right:0,top:1040,display:'flex',gap:36,justifyContent:'center'}}>
        <Flip at={86} axis="Y"><div style={{width:440,height:360,background:C.orange,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #7a3d08'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:'#fff'}}>TUBE + MEDS</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff'}}>within 24 h</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:'#3a1a02'}}>150 patients</div></div></Flip>
        <Flip at={186} axis="Y"><div style={{width:440,height:360,background:C.gray,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #3a3c45'}}>
          <div style={{fontSize:90}}>💊</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:'#fff'}}>MEDS ONLY</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:'#1b1c22'}}>150 patients</div></div></Flip>
      </div>
    </AbsoluteFill>}
  </Cam>);
};

const Bar3D: React.FC<{h:number; c:string; dark:string; w?:number}> = ({h,c,dark,w=230}) => (
  <div style={{position:'relative',width:w,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:w,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Ring: React.FC<{p:number; value:string}> = ({p,value}) => {
  const r=230, c=2*Math.PI*r;
  return (<div style={{position:'relative',width:560,height:560}}>
    <svg width={560} height={560} style={{transform:'rotate(-90deg)'}}><circle cx={280} cy={280} r={r} stroke={C.line} strokeWidth={46} fill="none"/>
      <circle cx={280} cy={280} r={r} stroke={C.orange} strokeWidth={46} fill="none" strokeDasharray={`${c*0.877*p} ${c}`} strokeLinecap="round" style={{filter:'drop-shadow(0 0 18px rgba(242,140,40,.6))'}}/></svg>
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,color:C.text,opacity:p>0.97?1:0,transform:`scale(${p>0.97?1:0.6})`,textShadow:depth('#0B0B0E')}}>{value}</div>
      <div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:C.mute}}>of the clot removed</div>
      <div style={{fontFamily:HEAD,fontWeight:800,fontSize:30,color:C.mute}}>(median, at 24 h)</div>
    </div></div>);
};
const Result = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const a=f<122, b=f>=118&&f<300, c=f>=296;
  return (<Cam keys={[[0,1,50,40],[116,1.06,50,40],[122,1,50,45],[250,1.05,50,45],[256,1.1,50,50],[296,1,50,50],[371,1.05,50,50]]}>
    {a && <AbsoluteFill style={{opacity:1-ease(f,116,122)}}>
      <Abs x={110} y={170}><Brain3D width={860} height={720} tubeIn={1} remove={ease(f,10,100)} orbit={0.5} dist={9} sway={false}/></Abs>
      <Abs x={260} y={830}><Ring p={ease(f,50,100)} value="87.7%"/></Abs>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:10,opacity:ease(f,118,126)}}>
      <Title size={110} delay={120}>Deaths at <span style={{color:C.orange}}>30 days</span></Title>
      <div style={{display:'flex',gap:140,alignItems:'flex-end',height:820,transform:'perspective(1400px) rotateY(-10deg)'}}>
        {[{l:'TUBE + MEDS',v:9.3,c:C.orange,d:'#B5621A',p:ease(f,170,192)},{l:'MEDS ONLY',v:18.0,c:C.gray,d:'#55575F',p:ease(f,215,237)}].map(x=>(
          <div key={x.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{fontFamily:HEAD,fontWeight:900,fontSize:120,color:x.c,marginBottom:40,opacity:x.p>0.95?1:0,transform:`scale(${x.p>0.95?1:0.6})`}}>{x.v.toFixed(1)}%</div>
            <Bar3D h={x.v*30*x.p} c={x.c} dark={x.d}/>
            <div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:C.text}}>{x.l}</div>
          </div>))}
      </div>
      <div style={{position:'absolute',top:860,left:300,opacity:ease(f,256,264),transform:`scale(${0.5+0.5*ease(f,256,266)}) rotate(-6deg)`,border:`10px solid ${C.red}`,color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:100,padding:'0 36px',borderRadius:20,background:'rgba(26,27,32,.85)'}}>ALMOST HALF</div>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30,opacity:ease(f,296,304)}}>
      <Title size={110} delay={297}>6 months later</Title>
      <Label size={44} delay={300}>disability score (patient-weighted, 1 = no symptoms)</Label>
      <div style={{display:'flex',gap:40,marginTop:30}}>
        <Flip at={302} axis="Y"><div style={{width:420,height:330,background:C.orange,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #7a3d08'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:140,color:'#fff'}}>0.458</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:'#3a1a02'}}>TUBE + MEDS</div></div></Flip>
        <Flip at={312} axis="Y"><div style={{width:420,height:330,background:C.gray,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #3a3c45'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:140,color:'#fff'}}>0.374</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:'#1b1c22'}}>MEDS ONLY</div></div></Flip>
      </div>
      <Label size={40} delay={322} color={C.text}>98.1% chance surgery is truly better (bar: 97.5%)</Label>
    </AbsoluteFill>}
  </Cam>);
};

const Catch = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const ang=brainAngle(f,fps,0.35,false), dist=7.2;
  const brain=f<150, money=f>=146;
  return (<Cam keys={[[0,1.1,50,30],[22,1,50,40],[146,1.05,50,40],[150,1,50,50],[224,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={130} color={C.red}>But wait…</Title></AbsoluteFill>
    {brain && <AbsoluteFill style={{opacity:ease(f,20,30)*(1-ease(f,144,150))}}>
      <Abs x={40} y={420}><Brain3D width={1000} height={880} deep={ease(f,84,96)} orbit={0.35} sway={false} dist={dist}/></Abs>
      <BTag p={LOBAR} ang={ang} dist={dist} w={1000} h={880} ox={40} oy={420} text="✅ SURFACE (lobar): the win" o={ease(f,40,50)} lx={60} ly={330} color="#bff3d4"/>
      <BTag p={DEEP} ang={ang} dist={dist} w={1000} h={880} ox={40} oy={420} text="❌ DEEP (basal ganglia): no gain" o={ease(f,96,106)} lx={60} ly={1290} color="#ffc9cf"/>
    </AbsoluteFill>}
    {money && <AbsoluteFill style={{alignItems:'center',paddingTop:420,gap:40}}>
      <Chip at={148} c={C.red} size={80}>💰 DEVICE MAKER PAID</Chip>
      <Chip at={156} c={C.card} size={56}>open-label: everyone knew their group</Chip>
      <div style={{marginTop:20}}><StickDoc pose="shrug" mood="worried" size={300} delay={150}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const e=1-ease(f,78,84), a=ease(f,82,88)*(1-ease(f,180,186)), b=ease(f,184,190)*(1-ease(f,222,228)), c=ease(f,226,232);
  const one=f>=118&&f<148, two=f>=148&&f<190;
  return (<Cam keys={[[0,1.1,50,40],[24,1,50,50],[78,1.05,50,50],[84,1,50,50],[180,1.04,50,50],[186,1,50,50],[222,1.06,50,45],[228,1,50,50],[336,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:280,gap:40,opacity:e}}>
      <Flip at={2}><div style={{background:C.yellow,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:76,padding:'6px 34px',borderRadius:14}}>📌 EXAM TIP</div></Flip>
      <Title size={124} delay={26}><span style={{color:C.orange}}>Surface</span> bleed<br/>+ early tube</Title>
      <Label size={46} delay={34} color={C.mute}>lobar ICH, 30–80 ml, within 24 h</Label>
      <StickDoc pose="point" mood="smile" size={270} delay={26}/>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:40,opacity:a}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="think" mood="smile" size={280} delay={82}/>
        <Title size={116} delay={83}>Would you<br/><span style={{color:C.orange}}>operate?</span></Title>
      </div>
      <Flip at={92}><div style={{background:C.card,borderRadius:28,padding:'26px 40px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:C.yellow}}>Comment below</div>
        <div style={{display:'flex',gap:26,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:one?C.orange:C.line,padding:'6px 24px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = remove it</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:two?C.gray:C.line,padding:'6px 24px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = leave it</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,98,108)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.text}}>Pradilla G, et al. N Engl J Med 2024 · doi:10.1056/NEJMoa2308440</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.mute,marginTop:8}}>Limitation: open-label, device-maker funded; deep bleeds stopped early</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={184}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={188}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={360} delay={184}/>
      <div style={{opacity:ease(f,192,200),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:56,padding:'14px 38px',borderRadius:14}}>FOLLOW #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={226}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={228}/></div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, study:Study, result:Result, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.1,1.3,'Suck the clot *OUT*…'],[1.3,2.7,'or *leave it*?'],[3.25,4.13,'A *brain bleed*.'],
  [4.58,6.4,'Surgeons have argued about this'],[6.4,8.39,'longer than my group chat argues about *LUNCH*.'],
  [8.79,9.54,'*ENRICH* trial:'],[9.86,10.91,'*300* patients.'],
  [11.23,13.0,'Half got a tiny *TUBE*'],[13.0,14.72,'through a brain groove, within *24 hours*.'],[15.05,16.31,'Half got *medicines only*.'],
  [16.67,18.5,'The tube pulled out…'],[18.5,20.58,'*87.7%* of the clot.'],
  [20.91,22.6,'Deaths at *30 days*?'],[22.6,24.85,'*9.3%*… versus *18%*.'],
  [25.22,26.2,'Almost *HALF*.'],[26.2,28.69,'And 6 months later… *LESS* disability.'],
  [29.05,29.46,'But *wait*.'],[29.82,31.9,'The win came from bleeds near the *SURFACE*.'],[31.9,33.71,'Deep bleeds? *No gain*.'],
  [34.01,36.12,'And the device maker *PAID* for the trial.'],
  [36.52,37.07,'*Exam tip*:'],[37.43,38.82,'*SURFACE* bleeds, early.'],
  [39.21,40.2,'Would you *operate*?'],[40.2,42.27,'Comment *1* to remove it, *2* to leave it.'],
  [42.66,43.14,'*Dr. Mot*,'],[43.45,44.7,'one paper a day…'],[44.7,46.2,'because the real question is…'],
];
const Captions: React.FC = () => {
  const f=useCurrentFrame(); const t=f/S; const {fps}=useVideoConfig();
  const i=CAPS.findIndex(([a,b])=>t>=a-0.05&&t<=b+0.25); if(i<0) return null;
  const [a,b,txt]=CAPS[i]; const words=txt.split(' ');
  const shown=Math.max(1,Math.ceil(words.length*Math.min(1,(t-a)/Math.max(0.3,(b-a)*0.85))));
  const pop=spring({frame:f-Math.round(a*S),fps,config:{damping:11,mass:0.5}});
  return (<div style={{position:'absolute',left:60,right:60,top:1470,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 18px',transform:`scale(${0.85+0.15*pop})`}}>
    {(()=>{let on=false; return words.map((w,j)=>{const st=w.startsWith('*'); if(st) on=true; const key=on; if(w.replace(/[.,…?!]+$/,'').endsWith('*')) on=false; const clean=w.replace(/\*/g,''); return (
      <span key={j} style={{fontFamily:HEAD,fontWeight:900,fontSize:78,lineHeight:1.08,textTransform:'uppercase',color:key?C.yellow:'#fff',
        WebkitTextStroke:'12px #000',paintOrder:'stroke fill',opacity:j<shown?1:0,transform:`translateY(${j===shown-1?-4:0}px)`}}>{clean}</span>);});})()}
  </div>);
};
export const Video: React.FC = () => {
  const f=useCurrentFrame(); let start=0;
  const loop=interpolate(f,[TOTAL-9,TOTAL-2],[0,1],cl);
  const capO=1-interpolate(f,[TOTAL-14,TOTAL-9],[0,1],cl); // crossfade back into the cover = seamless loop
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #9</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>NEUROSURGERY · NEJM 2024</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
