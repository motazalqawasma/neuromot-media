import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {Skull3D, CSDH_PT, MMA_PT, projectSkull, skullAngle} from './Skull3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-05, atempo 1.08) — scene starts 0, 9.82, 20.91, 29.42, 38.89 s ; voice ends 46.7 s
const scenes = [
  {id:'hook', d:9.82},{id:'what', d:11.09},{id:'result', d:8.51},{id:'catch', d:9.47},{id:'end', d:9.3},
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

// ---------- scenes (Neuro Paper #10 — EMMA-Can, Shankar, JAMA 2026; paywalled → recreated title card) ----------
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Chip: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=64}) => {const s=useSpring(at); return (
  <div style={{transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0,background:c,borderRadius:18,padding:'12px 34px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 10px 0 #0B0B0E'}}>{children}</div>);};
const Pill: React.FC<{at:number; children:React.ReactNode; bg?:string; color?:string; size?:number; rot?:number}> = ({at,children,bg=C.yellow,color=C.bg,size=52,rot=0}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{opacity:p,transform:`scale(${0.6+0.4*p}) rotate(${rot}deg)`,background:bg,color,fontFamily:HEAD,fontWeight:900,fontSize:size,padding:'6px 26px',borderRadius:14,display:'inline-block',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};
const STag: React.FC<{p:THREE.Vector3; ang:number; dist:number; w:number; h:number; ox:number; oy:number; text:string; o:number; lx:number; ly:number; color?:string}> = ({p,ang,dist,w,h,ox,oy,text,o,lx,ly,color='rgba(235,240,248,0.94)'}) => {
  if(o<=0) return null; const q=projectSkull(p,ang,dist,w,h); const x=ox+q.x, y=oy+q.y;
  return (<>
    <svg style={{position:'absolute',left:0,top:0,opacity:o}} width={1080} height={1920}><line x1={x} y1={y} x2={lx+60} y2={ly+30} stroke="#e8edf5" strokeWidth={4}/><circle cx={x} cy={y} r={10} fill="#fff"/></svg>
    <div style={{position:'absolute',left:lx,top:ly,opacity:o,background:color,color:'#16171B',fontFamily:HEAD,fontWeight:900,fontSize:50,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',transform:`scale(${0.7+0.3*o})`,transformOrigin:'left top'}}>{text}</div>
  </>);
};

const Hook = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=skullAngle(f,fps,0.2,false), dist=11.5;
  return (<Cam keys={[[0,1,50,40],[126,1.05,50,40],[132,1,50,50],[228,1.05,50,50],[234,1,50,50],[295,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:190}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={104}>Drain it…<br/>or also <span style={{color:C.orange}}>block</span> the artery?</Title>
      </div>
      <div style={{marginTop:22}}><Pill at={8} bg={C.red} color="#fff" size={56}>CAME BACK: 28% vs 4.3%</Pill></div>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity:1-ease(f,126,132)}}>
      <Abs x={40} y={600}><Skull3D width={1000} height={860} blood={1} artery={ease(f,40,90)} orbit={0.2} sway={false} dist={dist}/></Abs>
      <STag p={CSDH_PT} ang={ang} dist={dist} w={1000} h={860} ox={40} oy={600} text="old blood" o={ease(f,30,40)} lx={700} ly={760} color="#ffc9cf"/>
      <STag p={MMA_PT} ang={ang} dist={dist} w={1000} h={860} ox={40} oy={600} text="the artery feeding it" o={ease(f,80,90)} lx={60} ly={1330} color={C.yellow}/>
    </AbsoluteFill>
    {f>=128 && f<234 && <AbsoluteFill style={{alignItems:'center',paddingTop:650,gap:30,opacity:ease(f,128,134)*(1-ease(f,228,234))}}>
      <div style={{display:'flex',gap:30}}>{[0,1,2].map(i=><Flip key={i} at={132+i*10}><div style={{fontSize:170,transform:`rotate(${(f*4+i*120)%360}deg)`}}>🔁</div></Flip>)}</div>
      <Pill at={175} bg={C.orange} color="#fff" size={80} rot={-3}>LIKE EXAM SEASON 📚</Pill>
      <StickDoc pose="facepalm" from="stand" mood="worried" size={300} sweat delay={176}/>
    </AbsoluteFill>}
    {f>=230 && <AbsoluteFill style={{alignItems:'center',paddingTop:620,gap:30}}>
      <Flip at={232}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 50px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:96,color:C.yellow}}>PICK 1 OR 2 👇</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:56,color:C.text}}>comment now · answer at the end</div>
      </div></Flip>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={236}/><StickDoc pose="point" mood="smile" size={260} delay={234}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const What = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=skullAngle(f,fps,0.2,false), dist=11;
  const blood=f<175?1:1-0.6*ease(f,178,215);
  const onyx=ease(f,270,325);
  return (<Cam keys={[[0,1,50,40],[140,1.04,50,40],[146,1,50,45],[262,1.05,50,45],[268,1,50,45],[333,1.06,50,45]]}>
    <Abs x={40} y={330}><Skull3D width={1000} height={900} blood={blood} artery={f>=262?1:0} onyx={onyx} orbit={0.2} sway={false} dist={dist}/></Abs>
    {f<146 && <AbsoluteFill style={{opacity:1-ease(f,140,146)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={82}>Chronic <span style={{color:C.orange}}>subdural</span> hematoma</Title></AbsoluteFill>
      <STag p={CSDH_PT} ang={ang} dist={dist} w={1000} h={900} ox={40} oy={330} text="old blood under the skull" o={ease(f,50,60)} lx={60} ly={1200} color="#ffc9cf"/>
      <Abs x={300} y={1300} style={{whiteSpace:'nowrap'}}><Pill at={90} bg={C.card} color="#fff" size={46}>mostly older adults · mean age 72</Pill></Abs>
    </AbsoluteFill>}
    {f>=140 && f<268 && <AbsoluteFill style={{opacity:ease(f,140,148)*(1-ease(f,262,268))}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:190,gap:18}}>
        <Flip at={142}><div style={{width:920,background:'#fff',borderRadius:14,padding:'22px 34px',boxShadow:'0 30px 70px rgba(0,0,0,.6)',transform:'rotate(-1.5deg)'}}>
          <div style={{fontFamily:'Georgia, serif',fontSize:24,color:'#b0001e',fontWeight:700}}>JAMA · 2026</div>
          <div style={{fontFamily:'Georgia, serif',fontSize:34,color:'#111',lineHeight:1.2,marginTop:8,border:`5px solid ${f>=150?C.red:'transparent'}`,borderRadius:8,padding:'4px 8px'}}>Management of Chronic Subdural Hematoma With Adjunctive Embolization of Middle Meningeal Artery: The EMMA-Can Randomized Clinical Trial</div>
          <div style={{fontFamily:'Georgia, serif',fontSize:22,color:'#444',marginTop:8}}>J.J.S. Shankar, S. Alcock, N. Kashani, et al. · recreated title block (not open access)</div>
        </div></Flip>
      </AbsoluteFill>
      <div style={{position:'absolute',top:1180,left:0,right:0,display:'flex',gap:24,justifyContent:'center'}}><Chip at={160} c={C.red} size={70}>186 PATIENTS</Chip><Chip at={180} c={C.card} size={60}>ALL DRAINED 🩸</Chip></div>
    </AbsoluteFill>}
    {f>=262 && <AbsoluteFill style={{opacity:ease(f,262,270)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={96} delay={263}>Half: artery <span style={{color:C.orange}}>plugged</span></Title></AbsoluteFill>
      <STag p={MMA_PT} ang={ang} dist={dist} w={1000} h={900} ox={40} oy={330} text="liquid glue (Onyx)" o={ease(f,285,295)} lx={60} ly={1200} color="#ffffff"/>
      <Abs x={420} y={1300} style={{whiteSpace:'nowrap'}}><Pill at={295} bg={C.card} color="#fff" size={46}>a catheter job · within 72 h</Pill></Abs>
    </AbsoluteFill>}
  </Cam>);
};

const Bar3D: React.FC<{h:number; c:string; dark:string; w?:number}> = ({h,c,dark,w=230}) => (
  <div style={{position:'relative',width:w,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:w,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Result = () => {
  const f=useCurrentFrame();
  const bars=f<170, odds=f>=164;
  const items=[{l:'DRAIN ONLY',v:28,c:C.gray,d:'#55575F',p:ease(f,70,95)},{l:'DRAIN + BLOCK',v:4.3,c:C.orange,d:'#B5621A',p:ease(f,110,126)}];
  return (<Cam keys={[[0,1,50,40],[164,1.05,50,40],[170,1,50,50],[255,1.06,50,50]]}>
    {bars && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:10,opacity:1-ease(f,164,170)}}>
      <Title size={96}>Came back <span style={{color:C.orange}}>with symptoms</span></Title>
      <Label size={44} delay={4}>within 90 days, on CT</Label>
      <div style={{display:'flex',gap:140,alignItems:'flex-end',height:780,transform:'perspective(1400px) rotateY(-10deg)'}}>
        {items.map(x=>(<div key={x.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:130,color:x.c,marginBottom:40,opacity:x.p>0.95?1:0,transform:`scale(${x.p>0.95?1:0.6})`}}>{x.v}%</div>
          <Bar3D h={x.v*19*x.p} c={x.c} dark={x.d}/>
          <div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:C.text}}>{x.l}</div></div>))}
      </div>
      <Label size={36} delay={126}>26 of 93 vs 4 of 93 · P less than .001</Label>
    </AbsoluteFill>}
    {odds && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30,opacity:ease(f,164,172)}}>
      <Title size={100} delay={165}>Basically…</Title>
      <div style={{display:'flex',gap:50,alignItems:'center',marginTop:20}}>
        <Flip at={168} axis="Y"><div style={{width:380,height:420,background:C.gray,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #0B0B0E'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:160,color:'#fff',lineHeight:1}}>1 in 4</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:'#1b1c22'}}>drain only</div></div></Flip>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:120,color:C.yellow,opacity:ease(f,200,208)}}>→</div>
        <Flip at={205} axis="Y"><div style={{width:380,height:420,background:C.orange,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #7a3d08'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,color:'#fff',lineHeight:1}}>1 in 23</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:'#3a1a02'}}>drain + block</div></div></Flip>
      </div>
      <StickDoc pose="cheer" mood="surprised" size={280} delay={210}/>
    </AbsoluteFill>}
  </Cam>);
};

const Catch = () => {
  const f=useCurrentFrame();
  const fn=f<112, death=f>=106&&f<244, fu=f>=238;
  return (<Cam keys={[[0,1.08,50,40],[20,1,50,40],[106,1.05,50,40],[112,1,50,45],[238,1.05,50,45],[244,1,50,50],[284,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={130} color={C.red}>But…</Title></AbsoluteFill>
    {fn && <AbsoluteFill style={{alignItems:'center',paddingTop:400,gap:30,opacity:ease(f,20,28)*(1-ease(f,106,112))}}>
      <Title size={90} delay={22}>Function at 90 days</Title>
      <div style={{display:'flex',gap:40,marginTop:20}}>
        {[{n:'DRAIN ONLY',v:'95.7%',c:C.gray},{n:'DRAIN + BLOCK',v:'94.6%',c:C.orange}].map((x,i)=>(<Flip key={x.n} at={30+i*8} axis="Y"><div style={{width:420,height:340,background:x.c,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #0B0B0E'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:130,color:'#fff',lineHeight:1}}>{x.v}</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:'#1b1c22'}}>{x.n}</div></div></Flip>))}
      </div>
      <Label size={38} delay={44}>mRS 0–3 (doing well) · P = .84</Label>
      <div style={{opacity:ease(f,60,68),transform:`scale(${0.5+0.5*ease(f,60,70)}) rotate(-5deg)`,border:`10px solid ${C.yellow}`,color:C.yellow,fontFamily:HEAD,fontWeight:900,fontSize:110,padding:'0 40px',borderRadius:20}}>THE SAME</div>
    </AbsoluteFill>}
    {death && <AbsoluteFill style={{alignItems:'center',paddingTop:400,gap:36,opacity:ease(f,106,114)*(1-ease(f,238,244))}}>
      <Title size={96} delay={107}>Deaths: <span style={{color:C.orange}}>4</span> vs 1</Title>
      <div style={{display:'flex',gap:60}}>
        {[{n:'DRAIN + BLOCK',k:4,c:C.orange},{n:'DRAIN ONLY',k:1,c:C.gray}].map(x=>(<div key={x.n} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <div style={{display:'flex',gap:12}}>{Array.from({length:x.k},(_,i)=><div key={i} style={{width:70,height:70,borderRadius:35,background:x.c,opacity:ease(f,112+i*4,118+i*4)}}/>)}</div>
          <div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:C.text}}>{x.n} · of 93</div></div>))}
      </div>
      <Chip at={140} c={C.card} size={56}>not significant</Chip>
      <Chip at={175} c={C.green} size={56}>none linked to the procedure</Chip>
    </AbsoluteFill>}
    {fu && <AbsoluteFill style={{alignItems:'center',paddingTop:460,gap:30,opacity:ease(f,238,246)}}>
      <Chip at={240} c={C.red} size={80}>⏳ ONLY 3 MONTHS</Chip>
      <Label size={44} delay={246}>1-year results still to come</Label>
      <StickDoc pose="shrug" mood="worried" size={280} delay={240}/>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,122,128), b=ease(f,126,132)*(1-ease(f,182,188)), c=ease(f,186,192);
  const one=f>=28&&f<70, two=f>=70&&f<122;
  return (<Cam keys={[[0,1.08,50,40],[24,1,50,50],[122,1.04,50,50],[128,1,50,50],[182,1.06,50,45],[188,1,50,50],[279,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',padding:'220px 60px 0',gap:34,opacity:a}}>
      <Pill at={0} bg={C.red} color="#fff" size={54}>YOU'RE THE SURGEON · CASE 1</Pill>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="think" mood="smile" size={260} delay={2}/>
        <Title size={112} delay={3}>Which one<br/>do you <span style={{color:C.orange}}>pick?</span></Title>
      </div>
      <Flip at={10}><div style={{background:C.card,borderRadius:28,padding:'26px 40px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:C.yellow}}>Comment below</div>
        <div style={{display:'flex',gap:26,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:one?C.gray:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = drain only</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:two?C.orange:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = drain + block</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.text}}>Shankar JJS, et al. JAMA 2026 · doi:10.1001/jama.2026.4910</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.mute,marginTop:8}}>Limitation: open-label, 186 patients, only 90 days of follow-up</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={126}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={130}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={340} delay={126}/>
      <div style={{opacity:ease(f,134,142),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'14px 38px',borderRadius:14}}>FOLLOW FOR CASE 2 · #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={186}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={188}/></div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, what:What, result:Result, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.05,1.13,'Drain the *blood*…'],[1.51,3.69,'or ALSO *block* the artery feeding it?'],[4.25,5.8,'This bleed keeps *coming back*…'],[6.1,7.13,'like *exam season*.'],
  [7.72,8.39,'Pick *1* or *2*…'],[8.68,9.4,'answer at the end.'],
  [9.82,11.2,'*Chronic subdural* hematoma:'],[11.56,14.25,'old blood under the skull, mostly in *older adults*.'],[14.58,15.43,'*EMMA-Can* trial:'],
  [15.69,18.34,'*186* patients, everyone had it *drained*.'],[18.68,20.6,'Half also had the artery *PLUGGED* with glue.'],
  [20.91,23.06,'Came back with symptoms by *90 days*?'],[23.4,24.4,'*28%*…'],[24.68,26.0,'versus *4.3%*.'],[26.46,29.04,'Basically *1 in 4*… down to *1 in 23*.'],
  [29.42,29.91,'*But*.'],[30.18,32.7,'Function at 90 days was the *SAME* in both groups.'],[33.06,35.45,'Deaths: *4* versus *1*, not significant,'],
  [35.76,37.03,'and none linked to the procedure.'],[37.41,38.5,'Only *3 months* of follow-up.'],
  [38.89,39.55,'You’re the *surgeon*.'],[39.82,42.75,'*1* = drain only, *2* = drain and block.'],
  [43.14,44.84,'*Dr. Mot*, one paper a day…'],[45.13,46.7,'because the real question is…'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #10</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>NEUROSURGERY · JAMA 2026</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
