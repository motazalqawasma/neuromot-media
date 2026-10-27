import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import {Brain3D} from './Brain3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 2 (2026-10-27) — scene starts 0, 5.76, 18.04, 25.0, 32.6, 44.4 s ; voice ends 52.0 s
const scenes = [
  {id:'hook', d:5.76},{id:'study', d:12.28},{id:'score', d:6.96},{id:'plaque', d:7.6},
  {id:'catch', d:11.8},{id:'end', d:9.0},
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

// ---------- scenes ----------
// recreated title card (paper is not open access, so no page screenshot)
const TitleCard: React.FC<{inAt:number}> = ({inAt}) => {
  const f=useCurrentFrame(); const p=ease(f,inAt,inAt+14); const b1=ease(f,inAt+14,inAt+22), b2=ease(f,inAt+30,inAt+38);
  return (<div style={{position:'relative',width:940,background:'#FBFAF7',borderRadius:12,padding:'40px 46px 46px',boxShadow:'0 40px 90px rgba(0,0,0,.65)',
    transform:`perspective(1800px) translateY(${(1-p)*260}px) rotateX(${(1-p)*55}deg) rotateY(${(1-p)*-18}deg) rotateZ(${-2*p}deg)`,opacity:p}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'3px solid #222',paddingBottom:12}}>
      <div style={{fontFamily:'Georgia, serif',fontWeight:700,fontSize:56,color:'#B3121F',letterSpacing:2}}>JAMA</div>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:'#555'}}>Original Investigation · 2023;330(6):512–527</div>
    </div>
    <div style={{position:'relative',marginTop:26}}>
      <div style={{fontFamily:'Georgia, serif',fontWeight:700,fontSize:50,lineHeight:1.15,color:'#111'}}>Donanemab in Early Symptomatic Alzheimer Disease</div>
      <div style={{fontFamily:'Georgia, serif',fontSize:34,lineHeight:1.2,color:'#333',marginTop:10}}>The TRAILBLAZER-ALZ 2 Randomized Clinical Trial</div>
      <div style={{position:'absolute',left:-14,top:-10,width:`${(100+3)*b1}%`,height:'calc(100% + 20px)',border:`6px solid ${C.red}`,borderRadius:8,opacity:b1>0?1:0}}/>
    </div>
    <div style={{position:'relative',marginTop:30,display:'inline-block'}}>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:30,color:'#222'}}>Sims JR, Zimmer JA, Evans CD, et al.</div>
      <div style={{position:'absolute',left:-12,top:-8,width:`${(100+4)*b2}%`,height:'calc(100% + 16px)',border:`6px solid ${C.red}`,borderRadius:8,opacity:b2>0?1:0}}/>
      <div style={{position:'absolute',left:220,top:66,opacity:ease(f,inAt+36,inAt+44),fontFamily:HEAD,fontWeight:900,fontSize:56,color:'#fff',background:C.red,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',boxShadow:'0 8px 20px rgba(0,0,0,.4)'}}>↑ this team</div>
    </div>
    <div style={{position:'absolute',right:12,bottom:-36,fontFamily:BODY,fontWeight:600,fontSize:20,color:C.mute}}>JAMA 2023 · title card recreated (not open access)</div>
  </div>);
};
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};

const Hook = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1,50,45],[140,1.1,50,45],[173,1.16,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:250}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={128}>Can a drug <span style={{color:C.orange}}>slow</span><br/>Alzheimer's?</Title>
      </div>
    </AbsoluteFill>
    <Abs x={0} y={600}><Brain3D width={1080} height={820} clear={0} zoom={0.95+0.1*ease(f,0,170)}/></Abs>
    <Abs x={40} y={1060}><div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><NameTag at={8}/><StickDoc pose={f<95?'think':'shrug'} from="think" mood={f<95?'worried':'surprised'} size={300} delay={f<95?0:95}/></div></Abs>
    <Abs x={470} y={1230} show={ease(f,98,108)}><div style={{whiteSpace:'nowrap',fontFamily:HEAD,fontWeight:900,fontSize:68,color:C.yellow,textShadow:depth('#5a4300'),transform:'rotate(-4deg)'}}>plaque everywhere…</div></Abs>
  </Cam>);
};
const Drip: React.FC<{c:string; label:string; sub:string; at:number}> = ({c,label,sub,at}) => {
  const f=useCurrentFrame(); const s=useSpring(at); const drop=((f-at)%30)/30;
  return (<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,transform:`perspective(1000px) rotateY(${(1-s)*90}deg) scale(${0.6+0.4*s})`,opacity:s>0.02?1:0}}>
    <svg width={220} height={300} viewBox="0 0 100 140">
      <rect x={20} y={6} width={60} height={70} rx={12} fill="#E9EBF0" stroke="#fff" strokeWidth={3}/>
      <rect x={24} y={30} width={52} height={42} rx={8} fill={c} opacity={0.85}/>
      <line x1={50} y1={76} x2={50} y2={136} stroke="#E9EBF0" strokeWidth={3}/>
      <circle cx={50} cy={84+drop*46} r={4} fill={c}/>
    </svg>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:c}}>{label}</div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>{sub}</div>
  </div>);
};
const Study = () => {
  const f=useCurrentFrame();
  const cardOut=1-ease(f,112,120), groups=f>=118, timeline=f>=228, rand=f>=306;
  return (<Cam keys={[[0,1,50,30],[14,1.1,50,22],[60,1.1,50,22],[76,1,50,40],[112,1.04,50,40],[118,1,50,50],[220,1.05,50,45],[228,1,50,50],[300,1.05,50,50],[306,1,50,50],[368,1.08,50,50]]}>
    <Abs x={70} y={240} show={cardOut}><TitleCard inAt={0}/></Abs>
    <Abs x={0} y={1010} w={1080} show={cardOut}><div style={{display:'flex',justifyContent:'center'}}><Flip at={56}><div style={{background:C.red,borderRadius:20,padding:'16px 36px',fontFamily:HEAD,fontWeight:900,fontSize:92,color:'#fff',boxShadow:'0 10px 0 #7a1420'}}>1,736 PATIENTS</div></Flip></div></Abs>
    <Abs x={640} y={1120} show={cardOut*ease(f,60,70)}><StickDoc pose="point" mood="smile" size={260} delay={60} flip/></Abs>
    {groups && !timeline && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40}}>
      <Title size={110} delay={119}>Early <span style={{color:C.orange}}>Alzheimer's</span></Title>
      <div style={{display:'flex',gap:90}}>
        <Drip c={C.orange} label="DONANEMAB" sub="860 people" at={124}/>
        <Drip c={C.gray} label="PLACEBO" sub="876 people" at={190}/>
      </div>
      <Label size={50} delay={140} color={C.text}>a drip every 4 weeks</Label>
    </AbsoluteFill>}
    {timeline && !rand && <AbsoluteFill style={{alignItems:'center',paddingTop:420,gap:60}}>
      <Flip at={229}><Title size={240} color={C.orange}>76 weeks</Title></Flip>
      <svg width={900} height={140} viewBox="0 0 900 140">
        <rect x={20} y={60} width={860} height={22} rx={11} fill={C.line}/>
        <rect x={20} y={60} width={860*ease(f,236,296)} height={22} rx={11} fill={C.orange}/>
        {Array.from({length:20},(_,i)=><rect key={i} x={20+i*45} y={i%5===0?40:50} width={4} height={i%5===0?62:42} fill={i*45<860*ease(f,236,296)?C.text:C.mute}/>)}
        <text x={20} y={130} fontFamily={HEAD} fontWeight={800} fontSize={34} fill={C.mute}>start</text>
        <text x={880} y={130} textAnchor="end" fontFamily={HEAD} fontWeight={800} fontSize={34} fill={C.mute}>≈ 1.5 years</text>
      </svg>
      <StickDoc pose="hold" mood="smile" size={300} delay={232}/>
    </AbsoluteFill>}
    {rand && <AbsoluteFill style={{alignItems:'center',paddingTop:380,gap:50}}>
      <Flip at={307}><div style={{width:520,height:340,background:C.card,border:`8px solid ${C.text}`,borderRadius:24,display:'flex',alignItems:'center',justifyContent:'center',gap:30,boxShadow:'0 20px 0 #0B0B0E'}}>
        {[0,1,2].map(i=>{const on=Math.floor((f+i*5)/5)%2; return <div key={i} style={{width:110,height:110,borderRadius:20,background:on?C.orange:C.gray}}/>;})}
      </div></Flip>
      <Title size={110} delay={312}>A computer <span style={{color:C.orange}}>picked</span></Title>
      <Label size={52} delay={318}>randomized · double-blind</Label>
    </AbsoluteFill>}
  </Cam>);
};
const Bar3D: React.FC<{h:number; c:string; dark:string; w?:number}> = ({h,c,dark,w=220}) => (
  <div style={{position:'relative',width:w,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:w,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Score = () => {
  const f=useCurrentFrame(); const g=ease(f,8,60); const big=ease(f,96,104);
  const hour=f>=150;
  return (<Cam keys={[[0,1,50,40],[90,1.04,50,45],[98,1.12,50,30],[146,1.12,50,30],[150,1,50,50],[209,1.08,50,50]]}>
    {!hour && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:16}}>
      <Label size={56} color={C.text} delay={1}>Decline in memory + daily life</Label>
      <Label size={36} delay={4}>iADRS points lost · 76 weeks · earlier disease</Label>
      <div style={{display:'flex',gap:130,alignItems:'flex-end',height:640,marginTop:20,transform:'perspective(1400px) rotateY(-10deg)'}}>
        {[{l:'PLACEBO',v:9.27,c:C.gray,d:'#55575F'},{l:'DONANEMAB',v:6.02,c:C.orange,d:'#B5621A'}].map(b=>(
          <div key={b.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{fontFamily:HEAD,fontWeight:900,fontSize:88,color:b.c,marginBottom:40}}>−{g>0.98?b.v.toFixed(2):(b.v*g).toFixed(1)}</div>
            <Bar3D h={b.v*48*g} c={b.c} dark={b.d}/>
            <div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:C.text}}>{b.l}</div>
          </div>))}
      </div>
      <div style={{opacity:big,transform:`perspective(900px) translateZ(${(1-big)*300}px) rotate(-4deg)`,background:C.orange,borderRadius:24,padding:'12px 40px',boxShadow:'0 14px 0 #7a3d08'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,color:'#fff',lineHeight:1}}>35% SLOWER</div>
      </div>
    </AbsoluteFill>}
    {hour && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:40}}>
      <svg width={300} height={420} viewBox="0 0 100 140" style={{transform:`rotate(${Math.sin(f/8)*6}deg)`}}>
        <rect x={10} y={2} width={80} height={10} rx={4} fill={C.text}/><rect x={10} y={128} width={80} height={10} rx={4} fill={C.text}/>
        <path d="M18 12 C18 50 46 60 46 70 C46 80 18 90 18 128 L82 128 C82 90 54 80 54 70 C54 60 82 50 82 12 Z" fill="none" stroke={C.text} strokeWidth={4}/>
        <path d={`M26 ${22+30*ease(f,150,209)} L74 ${22+30*ease(f,150,209)} C70 50 54 60 50 68 C46 60 30 50 26 ${22+30*ease(f,150,209)} Z`} fill={C.orange}/>
        <path d={`M50 70 L50 126`} stroke={C.orange} strokeWidth={2}/>
        <path d={`M22 126 C30 ${126-25*ease(f,150,209)} 70 ${126-25*ease(f,150,209)} 78 126 Z`} fill={C.orange}/>
      </svg>
      <Title size={140} delay={151}>Buying <span style={{color:C.orange}}>time</span></Title>
      <Label size={46} delay={156}>≈ 35% slower than placebo</Label>
    </AbsoluteFill>}
  </Cam>);
};
const Plaque = () => {
  const f=useCurrentFrame(); const clear=ease(f,36,120); const k=Math.round(80*ease(f,100,125));
  const room=f>=150;
  return (<Cam keys={[[0,1,50,40],[100,1.04,50,40],[104,1.1,50,55],[146,1.1,50,55],[150,1,50,50],[228,1.08,50,50]]}>
    {!room && <>
      <AbsoluteFill style={{alignItems:'center',paddingTop:230}}><Title size={120} delay={1}>Amyloid <span style={{color:C.orange}}>plaque</span>?</Title></AbsoluteFill>
      <Abs x={0} y={360}><Brain3D width={1080} height={640} clear={clear} zoom={1.05}/></Abs>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1000,gap:20,opacity:ease(f,98,106)}}>
        <div style={{display:'flex',alignItems:'center',gap:40}}>
          <svg width={400} height={400} viewBox="0 0 200 200">
            {Array.from({length:100},(_,i)=>{const x=(i%10)*20+10, y=Math.floor(i/10)*20+10; return <circle key={i} cx={x} cy={y} r={7.5} fill={i<k?C.orange:C.line}/>;})}
          </svg>
          <div><Flip at={102}><Title size={200} color={C.orange}>80%</Title></Flip><Label size={50} color={C.text} delay={108}>CLEARED</Label><Label size={34} delay={112}>placebo: 0%</Label></div>
        </div>
      </AbsoluteFill>
    </>}
    {room && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30}}>
      <Title size={110} delay={151}>Better than <span style={{color:C.red}}>my room</span></Title>
      <div style={{display:'flex',alignItems:'flex-end',gap:20}}>
        <Flip at={154} axis="Y"><div style={{width:520,height:440,background:C.card,borderRadius:20,position:'relative',overflow:'hidden',border:`6px solid ${C.line}`}}>
          {Array.from({length:14},(_,i)=>(<div key={i} style={{position:'absolute',left:30+((i*71)%430),top:200+((i*53)%200),width:70+(i%3)*30,height:24+(i%4)*10,background:[C.orange,C.text,C.gray,C.red][i%4],borderRadius:6,transform:`rotate(${(i*37)%60-30}deg)`}}/>))}
          <div style={{position:'absolute',left:30,top:30,fontFamily:HEAD,fontWeight:900,fontSize:54,color:C.text}}>EXAM WEEK</div>
          <div style={{position:'absolute',left:30,top:90,fontFamily:HEAD,fontWeight:800,fontSize:38,color:C.mute}}>notes · mugs · socks</div>
        </div></Flip>
        <StickDoc pose="facepalm" mood="worried" size={320} sweat delay={156}/>
      </div>
    </AbsoluteFill>}
  </Cam>);
};
const Catch = () => {
  const f=useCurrentFrame(); const bars=ease(f,62,120); const b2=ease(f,182,196);
  const deaths=f>=246;
  return (<Cam keys={[[0,1,50,50],[30,1.06,50,40],[60,1,50,50],[236,1.05,50,45],[246,1,50,50],[354,1.1,50,45]]}>
    {!deaths && <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:24}}>
      <Title size={150} color={C.red} delay={1}>But…</Title>
      <Label size={56} color={C.text} delay={28}>brain swelling on MRI (ARIA-E)</Label>
      <div style={{display:'flex',gap:130,alignItems:'flex-end',height:640,transform:'perspective(1400px) rotateY(-10deg)'}}>
        {[{l:'DONANEMAB',v:24.0,c:C.red,d:'#7a1420',p:bars},{l:'PLACEBO',v:2.1,c:C.gray,d:'#55575F',p:b2}].map(b=>(
          <div key={b.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:HEAD,fontWeight:900,fontSize:100,color:b.c,marginBottom:40,opacity:b.p>0.02?1:0}}>{b.p>0.98?`${b.v.toFixed(1)}%`:`${(b.v*b.p).toFixed(0)}%`}</div>
            <Bar3D h={b.v*19*b.p} c={b.c} dark={b.d}/>
            <div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:C.text}}>{b.l}</div>
          </div>))}
      </div>
      <Abs x={790} y={760} show={ease(f,60,70)}><StickDoc pose="shrug" mood="worried" size={250} delay={60} flip/></Abs>
    </AbsoluteFill>}
    {deaths && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40}}>
      <Label size={64} color={C.green} delay={246}>Most: no symptoms</Label>
      {f<298 && <StickDoc pose="thumbs" mood="smile" size={340} delay={248}/>}
      <div style={{display:'flex',gap:50,marginTop:20}}>
        {[0,1,2].map(i=>{const s=ease(f,300+i*8,310+i*8); return (<svg key={i} width={200} height={240} viewBox="0 0 100 120" style={{transform:`scale(${0.6+0.4*s})`,opacity:s}}>
          <path d="M15 120 L15 45 C15 20 85 20 85 45 L85 120 Z" fill={C.card} stroke={C.red} strokeWidth={5}/>
          <path d="M50 50 V95 M35 65 H65" stroke={C.red} strokeWidth={7}/>
        </svg>);})}
      </div>
      <Title size={120} color={C.red} delay={300}>3 deaths linked</Title>
      <Label size={44} delay={320} color={C.text}>to treatment (all after serious ARIA)</Label>
      <div style={{opacity:ease(f,325,335),fontFamily:BODY,fontWeight:600,fontSize:30,color:C.mute,textAlign:'center',padding:'0 80px'}}>Also: only 76 weeks of follow-up, 91.5% White participants</div>
    </AbsoluteFill>}
  </Cam>);
};
const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,124,132), b=ease(f,130,138)*(1-ease(f,184,190)), c=ease(f,188,196)*(1-ease(f,250,256));
  const one=f>=55&&f<78, two=f>=78&&f<110;
  return (<Cam keys={[[0,1.12,50,40],[30,1,50,50],[124,1.04,50,50],[130,1,50,50],[182,1.08,50,45],[188,1,50,50],[270,1.12,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:50,opacity:a}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="think" mood="smile" size={300}/>
        <Title size={120}>Would you<br/><span style={{color:C.orange}}>take it?</span></Title>
      </div>
      <Flip at={20}><div style={{background:C.card,borderRadius:28,padding:'26px 44px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:C.yellow}}>Comment below</div>
        <div style={{display:'flex',gap:30,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:one?C.green:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = yes</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:two?C.red:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = not yet</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,30,45)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:C.text}}>Sims JR, et al. JAMA 2023 · doi:10.1001/jama.2023.13239</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.mute,marginTop:8}}>Limitation: 76 weeks only, 91.5% White participants</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={130}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={136}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={380} delay={130}/>
      <div style={{opacity:ease(f,140,150),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:56,padding:'14px 38px',borderRadius:14}}>FOLLOW #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={188}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={190}/></div>
    </AbsoluteFill>
  </Cam>);
};
const MAP: Record<string, React.FC> = {hook:Hook, study:Study, score:Score, plaque:Plaque, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0,2.73,'Can a drug actually *SLOW* Alzheimer\'s?'],[3.24,3.89,'Honestly…'],[4.27,5.31,'this one *surprised* me.'],
  [5.76,8.6,'In the TRAILBLAZER-ALZ 2 trial,'],[8.6,13.34,'*1736* people with early Alzheimer\'s got monthly drips of donanemab…'],
  [13.60,15.76,'or *PLACEBO*, for 76 weeks.'],[16.18,17.68,'A computer *picked* who got what.'],
  [18.04,20.95,'In earlier disease, memory and daily life declined…'],[21.29,22.84,'*35% SLOWER*.'],[23.28,24.62,'Basically, buying *time*.'],
  [25.01,26.04,'And the amyloid *plaque*?'],[26.39,28.31,'By 76 weeks it was *CLEARED* in…'],[28.47,29.53,'*80%* of them.'],
  [30.01,32.37,'That\'s a better cleanup than my *room* during exam week.'],
  [32.82,33.23,'*But.*'],[33.54,34.27,'Here\'s the *catch*.'],[34.57,38.33,'Brain swelling on MRI showed up in… *24%* on the drug,'],
  [38.66,40.52,'versus about *2%* on placebo.'],[41.04,42.40,'Most had *no symptoms*…'],[42.58,44.07,'but *3 deaths* were LINKED to treatment.'],
  [44.58,45.74,'So, would you *take* it?'],[46.15,48.19,'Comment *1* for yes, *2* for not yet.'],
  [48.71,50.38,'*Dr. Mot*, one paper a day…'],[50.67,51.98,'because the real question is…'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #6</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>NEUROLOGY · JAMA 2023</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
