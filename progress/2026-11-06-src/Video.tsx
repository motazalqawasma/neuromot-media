import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {Head3D, VIM_L, VIM_R, projectHead, headAngle} from './Head3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-04, atempo 1.08) — scene starts 0, 8.41, 17.94, 26.44, 38.31 s ; voice ends 45.45 s
const scenes = [
  {id:'hook', d:8.41},{id:'options', d:9.53},{id:'result', d:8.5},{id:'catch', d:11.87},{id:'end', d:8.64},
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

// ---------- scenes (Neuro Paper #11 — DBS vs MRgFUS for essential tremor, Sabet, Neurosurg Rev 2026, CC BY) ----------
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Chip: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=64}) => {const s=useSpring(at); return (
  <div style={{transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0,background:c,borderRadius:18,padding:'12px 34px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 10px 0 #0B0B0E'}}>{children}</div>);};
const Pill: React.FC<{at:number; children:React.ReactNode; bg?:string; color?:string; size?:number; rot?:number}> = ({at,children,bg=C.yellow,color=C.bg,size=52,rot=0}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{opacity:p,transform:`scale(${0.6+0.4*p}) rotate(${rot}deg)`,background:bg,color,fontFamily:HEAD,fontWeight:900,fontSize:size,padding:'6px 26px',borderRadius:14,display:'inline-block',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};
const Credit: React.FC<{show:number}> = ({show}) => <div style={{opacity:show,fontFamily:BODY,fontWeight:600,fontSize:24,color:C.mute,textAlign:'center'}}>Neurosurg Rev 2026 · CC BY</div>;
const HTag: React.FC<{p:THREE.Vector3; ang:number; dist:number; w:number; h:number; ox:number; oy:number; text:string; o:number; lx:number; ly:number; color?:string}> = ({p,ang,dist,w,h,ox,oy,text,o,lx,ly,color='rgba(235,240,248,0.94)'}) => {
  if(o<=0) return null; const q=projectHead(p,ang,dist,w,h); const x=ox+q.x, y=oy+q.y;
  return (<>
    <svg style={{position:'absolute',left:0,top:0,opacity:o}} width={1080} height={1920}><line x1={x} y1={y} x2={lx+60} y2={ly+30} stroke="#e8edf5" strokeWidth={4}/><circle cx={x} cy={y} r={10} fill="#fff"/></svg>
    <div style={{position:'absolute',left:lx,top:ly,opacity:o,background:color,color:'#16171B',fontFamily:HEAD,fontWeight:900,fontSize:50,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',transform:`scale(${0.7+0.3*o})`,transformOrigin:'left top'}}>{text}</div>
  </>);
};

const Hook = () => {
  const f=useCurrentFrame();
  const shake=f>=104&&f<190 ? Math.sin(f*2.3)*14 : 0;
  return (<Cam keys={[[0,1,50,40],[100,1.05,50,40],[106,1,50,50],[188,1.05,50,50],[194,1,50,50],[252,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:190}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={112}>Drill the skull…<br/>or <span style={{color:C.orange}}>no cut</span> at all?</Title>
      </div>
      <div style={{marginTop:22}}><Pill at={8} bg={C.red} color="#fff" size={56}>WALKING UNSTEADY: 27% vs 4%</Pill></div>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity:1-ease(f,100,106)}}>
      <Abs x={0} y={520}><Head3D width={540} height={760} dbs={ease(f,12,50)} orbit={0.9} dist={14}/></Abs>
      <Abs x={540} y={520}><Head3D width={540} height={760} fus={ease(f,20,60)} orbit={0.9} dist={14}/></Abs>
      <Abs x={150} y={1260}><Pill at={30} bg={C.card} color="#fff" size={58}>1 · DBS</Pill></Abs>
      <Abs x={640} y={1260}><Pill at={38} bg={C.orange} color="#fff" size={58}>2 · ULTRASOUND</Pill></Abs>
    </AbsoluteFill>
    {f>=104 && <AbsoluteFill style={{alignItems:'center',paddingTop:560,gap:20,opacity:ease(f,104,110)*(1-ease(f,188,194))}}>
      <div style={{fontSize:300,transform:`translateX(${shake}px) rotate(${shake*0.6}deg)`}}>☕</div>
      <StickDoc pose="hold" from="stand" mood="worried" size={300} sweat delay={104}/>
      <Label size={52} color={C.text} delay={110}>essential tremor: shaking when you MOVE</Label>
    </AbsoluteFill>}
    {f>=190 && <AbsoluteFill style={{alignItems:'center',paddingTop:620,gap:30}}>
      <Flip at={192}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 50px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:96,color:C.yellow}}>PICK 1 OR 2 👇</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:56,color:C.text}}>comment now · answer at the end</div>
      </div></Flip>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={196}/><StickDoc pose="point" mood="smile" size={260} delay={194}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const Options = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const one=f<106, two=f>=100;
  const angA=headAngle(f,fps,0.9,false), dist=10.5;
  return (<Cam keys={[[0,1,50,40],[100,1.06,50,40],[106,1,50,40],[220,1.05,50,40],[286,1.08,50,45]]}>
    {one && <AbsoluteFill style={{opacity:1-ease(f,100,106)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={104}>Option <span style={{color:C.orange}}>1</span>: DBS</Title></AbsoluteFill>
      <Abs x={40} y={330}><Head3D width={1000} height={900} dbs={ease(f,10,70)} orbit={0.9} sway={false} dist={dist}/></Abs>
      <HTag p={VIM_L} ang={angA} dist={dist} w={1000} h={900} ox={40} oy={330} text="wire → thalamus (Vim)" o={ease(f,40,50)} lx={60} ly={1150} color={C.yellow}/>
      <Abs x={560} y={1250} show={ease(f,60,68)}><Pill at={60} bg={C.card} color="#fff" size={46}>adjustable · can switch off</Pill></Abs>
    </AbsoluteFill>}
    {two && <AbsoluteFill style={{opacity:ease(f,100,108)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={104} delay={101}>Option <span style={{color:C.orange}}>2</span>: ultrasound</Title></AbsoluteFill>
      <Abs x={40} y={330}><Head3D width={1000} height={900} fus={ease(f,115,190)} orbit={0.9} sway={false} dist={dist}/></Abs>
      <HTag p={VIM_L} ang={angA} dist={dist} w={1000} h={900} ox={40} oy={330} text="heats ONE tiny spot" o={ease(f,170,180)} lx={60} ly={1150} color={C.yellow}/>
      <Abs x={560} y={1250} show={ease(f,185,193)}><Pill at={185} bg={C.card} color="#fff" size={46}>no skin cut · permanent</Pill></Abs>
      <Abs x={560} y={380} show={ease(f,222,230)}><Pill at={222} bg={C.orange} color="#fff" size={52} rot={4}>🔍 ☀️ magnifying glass</Pill></Abs>
    </AbsoluteFill>}
  </Cam>);
};

const Bar3D: React.FC<{h:number; c:string; dark:string; w?:number}> = ({h,c,dark,w=230}) => (
  <div style={{position:'relative',width:w,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:w,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Bars: React.FC<{a:number; b:number; pa:number; pb:number; scale:number; la:string; lb:string; unit?:string; height?:number}> = ({a,b,pa,pb,scale,la,lb,unit='%',height=760}) => (
  <div style={{display:'flex',gap:140,alignItems:'flex-end',height,transform:'perspective(1400px) rotateY(-10deg)'}}>
    {[{l:la,v:a,c:C.gray,d:'#55575F',p:pa},{l:lb,v:b,c:C.orange,d:'#B5621A',p:pb}].map(x=>(
      <div key={x.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:120,color:x.c,marginBottom:40,opacity:x.p>0.95?1:0,transform:`scale(${x.p>0.95?1:0.6})`}}>{x.v}{unit}</div>
        <Bar3D h={x.v*scale*x.p} c={x.c} dark={x.d}/>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:C.text}}>{x.l}</div>
      </div>))}
  </div>);

const Result = () => {
  const f=useCurrentFrame();
  const a=f<100, b=f>=96&&f<182, c=f>=178;
  return (<Cam keys={[[0,1,50,35],[94,1.05,50,35],[100,1,50,45],[176,1.05,50,45],[182,1,50,50],[255,1.06,50,50]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40,opacity:1-ease(f,94,100)}}>
      <Flip at={0}><div style={{width:900,background:'#fff',borderRadius:14,padding:'36px 46px',boxShadow:'0 40px 90px rgba(0,0,0,.65)',transform:'rotate(-1.5deg)'}}>
        <div style={{fontFamily:'Georgia, serif',fontSize:28,color:'#0b5394',fontWeight:700}}>Neurosurgical Review · 2026 · open access</div>
        <div style={{fontFamily:'Georgia, serif',fontSize:44,color:'#111',lineHeight:1.2,marginTop:18,border:`6px solid ${f>=10?C.red:'transparent'}`,borderRadius:8,padding:'6px 10px'}}>Deep brain stimulation and magnetic resonance–guided focused ultrasound for essential tremor: a meta-analysis</div>
        <div style={{fontFamily:'Georgia, serif',fontSize:28,color:'#444',marginTop:16}}>H. Sabet, A. Abbas, E.Y. Salama, et al.</div>
      </div></Flip>
      <Credit show={ease(f,8,16)}/>
      <div style={{display:'flex',gap:24}}><Chip at={14} c={C.red} size={80}>5 STUDIES</Chip><Chip at={40} c={C.card} size={80}>463 PATIENTS</Chip></div>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:16,opacity:ease(f,96,104)}}>
      <Title size={100} delay={97}>Responded at <span style={{color:C.orange}}>12 months</span></Title>
      <div style={{display:'flex',gap:60,marginTop:40}}>
        {['DBS','ULTRASOUND'].map((n,i)=>(<Flip key={n} at={104+i*8} axis="Y"><div style={{width:420,height:420,background:i?C.orange:C.gray,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #0B0B0E'}}>
          <div style={{fontSize:140}}>✋</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:'#fff'}}>{n}</div></div></Flip>))}
      </div>
      <div style={{position:'absolute',top:880,opacity:ease(f,120,128),transform:`scale(${0.5+0.5*ease(f,120,130)}) rotate(-5deg)`,border:`10px solid ${C.green}`,color:C.green,fontFamily:HEAD,fontWeight:900,fontSize:110,padding:'0 40px',borderRadius:20,background:'rgba(26,27,32,.9)'}}>SAME</div>
      <Label size={36} delay={130}>risk ratio 0.94 · not significant · only 2 studies, 125 patients</Label>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30,opacity:ease(f,178,186)}}>
      <Title size={100} delay={179}>Total tremor score</Title>
      <Label size={44} delay={182}>improvement, DBS vs ultrasound</Label>
      <Flip at={186}><div style={{background:C.card,border:`6px solid ${C.gray}`,borderRadius:30,padding:'30px 70px',textAlign:'center',marginTop:30}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,lineHeight:1}}>+5.1</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:56,color:C.mute}}>points more with DBS</div></div></Flip>
      <Label size={36} delay={196}>95% CI 1.08 to 9.16 · 4 studies, 421 patients</Label>
    </AbsoluteFill>}
  </Cam>);
};

const Catch = () => {
  const f=useCurrentFrame();
  const bars=f<166, risks=f>=160&&f<290, both=f>=284;
  return (<Cam keys={[[0,1.08,50,40],[20,1,50,40],[160,1.05,50,40],[166,1,50,45],[284,1.05,50,45],[290,1,50,45],[356,1.06,50,45]]}>
    {bars && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:10,opacity:1-ease(f,160,166)}}>
      <Title size={110} color={C.red}>But… walking unsteady</Title>
      <Bars la="DBS" lb="ULTRASOUND" a={4.1} b={26.6} pa={ease(f,99,115)} pb={ease(f,40,70)} scale={26}/>
      <Label size={36} delay={110}>gait instability · risk ratio 2.85 · P = .025</Label>
    </AbsoluteFill>}
    {risks && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:36,opacity:ease(f,160,168)*(1-ease(f,284,290))}}>
      <Title size={100} delay={161}>DBS has its own risks</Title>
      <Chip at={170} c={C.card} size={70}>🦠 infection</Chip>
      <Chip at={186} c={C.card} size={70}>🩸 bleeding</Chip>
      <Chip at={200} c={C.card} size={70}>🔩 hardware</Chip>
      <Label size={42} delay={210} color={C.yellow}>rare, and not significantly different</Label>
      <StickDoc pose="shrug" mood="worried" size={240} delay={200}/>
    </AbsoluteFill>}
    {both && <AbsoluteFill style={{opacity:ease(f,284,292)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={100} delay={285}>Most DBS: <span style={{color:C.orange}}>both sides</span></Title></AbsoluteFill>
      <Abs x={0} y={380}><Head3D width={540} height={760} dbs={1} dbs2={ease(f,290,320)} targets={2} orbit={0.25} sway={false} dist={13}/></Abs>
      <Abs x={540} y={380}><Head3D width={540} height={760} fus={1} orbit={0.25} sway={false} dist={13}/></Abs>
      <Abs x={120} y={1150}><Pill at={296} bg={C.card} color="#fff" size={52}>DBS: 2 sides</Pill></Abs>
      <Abs x={600} y={1150}><Pill at={300} bg={C.orange} color="#fff" size={52}>FUS: mostly 1</Pill></Abs>
      <Abs x={250} y={1270}><Pill at={310} bg={C.red} color="#fff" size={58} rot={-3}>NOT A FAIR FIGHT</Pill></Abs>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,104,110), b=ease(f,108,114)*(1-ease(f,162,168)), c=ease(f,166,172);
  const one=f>=30&&f<62, two=f>=62&&f<106;
  return (<Cam keys={[[0,1.08,50,40],[24,1,50,50],[104,1.04,50,50],[110,1,50,50],[162,1.06,50,45],[168,1,50,50],[259,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',padding:'220px 60px 0',gap:34,opacity:a}}>
      <Pill at={0} bg={C.red} color="#fff" size={54}>YOU'RE THE SURGEON · CASE 2</Pill>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="think" mood="smile" size={260} delay={2}/>
        <Title size={112} delay={3}>Which one<br/>do you <span style={{color:C.orange}}>pick?</span></Title>
      </div>
      <Flip at={10}><div style={{background:C.card,borderRadius:28,padding:'26px 40px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:C.yellow}}>Comment below</div>
        <div style={{display:'flex',gap:26,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:one?C.gray:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = drill (DBS)</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:two?C.orange:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = no cut</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.text}}>Sabet H, et al. Neurosurg Rev 2026 · doi:10.1007/s10143-025-04076-x · CC BY</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.mute,marginTop:8}}>Limitation: 5 small retrospective studies; bilateral DBS vs mostly unilateral ultrasound</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={108}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={112}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={340} delay={108}/>
      <div style={{opacity:ease(f,116,124),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'14px 38px',borderRadius:14}}>FOLLOW FOR CASE 3 · #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={166}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={168}/></div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, options:Options, result:Result, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.05,1.48,'Drill into the *skull*…'],[1.85,3.16,'or *NO cut* at all?'],[3.68,5.94,'His hands shake so much he can’t hold his *coffee*.'],
  [6.43,7.07,'Pick *1* or *2*…'],[7.37,8.08,'answer at the end.'],
  [8.41,9.04,'Option *1*:'],[9.29,11.46,'*DBS*, a wire deep in the brain.'],[11.9,12.54,'Option *2*:'],[12.94,13.86,'focused *ULTRASOUND*,'],
  [14.12,15.43,'heating one tiny spot…'],[15.83,17.62,'basically a *magnifying glass* in the sun.'],
  [17.94,20.79,'*5 studies*, *463* patients.'],[21.14,23.43,'At 12 months… the *SAME* share responded.'],[23.9,26.12,'DBS calmed the shaking a bit *more* overall.'],
  [26.44,29.46,'But after ultrasound, *27%* walked *UNSTEADY*…'],[29.74,31.45,'versus *4%* with DBS.'],
  [31.95,35.66,'DBS has its own rare risks: *infection*, *bleeding*, *hardware*.'],[36.13,37.93,'And most DBS was on *BOTH* sides.'],
  [38.31,39.01,'You’re the *surgeon*.'],[39.34,41.46,'*1* = drill, *2* = no cut.'],
  [41.94,42.41,'*Dr. Mot*,'],[42.7,43.56,'one paper a day…'],[43.91,45.45,'because the real question is…'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #11</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>NEUROSURGERY · NEUROSURG REV 2026</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
