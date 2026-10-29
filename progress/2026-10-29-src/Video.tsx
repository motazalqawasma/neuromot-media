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
// voice take 2 (2026-10-29, ElevenLabs Scribe word timings) — scene starts 0, 6.78, 19.12, 28.7, 38.64, 45.08 s ; voice ends 52.8 s
const scenes = [
  {id:'hook', d:6.78},{id:'study', d:12.34},{id:'score', d:9.58},{id:'both', d:9.94},
  {id:'catch', d:6.44},{id:'end', d:9.1},
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

// ---------- scenes (Neuro Paper #7 — eptinezumab RESOLUTION, Jensen, Neurology 2026) ----------
const TitleCard: React.FC<{inAt:number}> = ({inAt}) => {
  const f=useCurrentFrame(); const p=ease(f,inAt,inAt+14); const b1=ease(f,inAt+12,inAt+20), b2=ease(f,inAt+24,inAt+32);
  return (<div style={{position:'relative',width:940,background:'#FBFAF7',borderRadius:12,padding:'40px 46px 46px',boxShadow:'0 40px 90px rgba(0,0,0,.65)',
    transform:`perspective(1800px) translateY(${(1-p)*260}px) rotateX(${(1-p)*55}deg) rotateY(${(1-p)*-18}deg) rotateZ(${-2*p}deg)`,opacity:p}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'3px solid #222',paddingBottom:12}}>
      <div style={{fontFamily:'Georgia, serif',fontWeight:700,fontSize:52,color:'#1B3F7A',letterSpacing:2}}>NEUROLOGY</div>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:24,color:'#555'}}>Research Article · 2026;106(8):e214863</div>
    </div>
    <div style={{position:'relative',marginTop:26}}>
      <div style={{fontFamily:'Georgia, serif',fontWeight:700,fontSize:44,lineHeight:1.15,color:'#111'}}>Eptinezumab With Patient Education for Chronic Migraine and Medication-Overuse Headache</div>
      <div style={{fontFamily:'Georgia, serif',fontSize:32,lineHeight:1.2,color:'#333',marginTop:10}}>The Randomized, Placebo-Controlled RESOLUTION Trial</div>
      <div style={{position:'absolute',left:-14,top:-10,width:`${(100+3)*b1}%`,height:'calc(100% + 20px)',border:`6px solid ${C.red}`,borderRadius:8,opacity:b1>0?1:0}}/>
    </div>
    <div style={{position:'relative',marginTop:30,display:'inline-block'}}>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:30,color:'#222'}}>Jensen RH, Lundqvist C, Schytz HW, et al.</div>
      <div style={{position:'absolute',left:-12,top:-8,width:`${(100+4)*b2}%`,height:'calc(100% + 16px)',border:`6px solid ${C.red}`,borderRadius:8,opacity:b2>0?1:0}}/>
      <div style={{position:'absolute',left:220,top:66,opacity:ease(f,inAt+30,inAt+38),fontFamily:HEAD,fontWeight:900,fontSize:56,color:'#fff',background:C.red,padding:'6px 22px',borderRadius:12,whiteSpace:'nowrap',boxShadow:'0 8px 20px rgba(0,0,0,.4)'}}>↑ this team</div>
    </div>
    <div style={{position:'absolute',right:12,bottom:-36,fontFamily:BODY,fontWeight:600,fontSize:20,color:C.mute}}>Neurology 2026 · title card recreated</div>
  </div>);
};
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Pill: React.FC<{size?:number; c?:string; rot?:number}> = ({size=60,c=C.red,rot=-35}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform:`rotate(${rot}deg)`}}>
    <rect x={30} y={8} width={40} height={84} rx={20} fill="#F2F2F4"/>
    <path d="M30 50 L70 50 L70 72 A20 20 0 0 1 30 72 Z" fill={c}/>
  </svg>);

const Hook = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1,50,45],[150,1.1,50,45],[203,1.16,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={108}>Are your painkillers<br/><span style={{color:C.orange}}>causing</span> your<br/>headaches?</Title>
      </div>
    </AbsoluteFill>
    <Abs x={0} y={540}><Brain3D width={1080} height={800} zoom={1.0+0.12*ease(f,0,200)} pills={1}/></Abs>
    <Abs x={30} y={1090}><div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><NameTag at={8}/><StickDoc pose={f<100?'think':'point'} from="think" mood={f<100?'worried':'surprised'} size={290} delay={f<100?0:100}/></div></Abs>
    <Abs x={400} y={1260} show={ease(f,140,150)}><div style={{background:C.red,borderRadius:18,padding:'10px 26px',transform:`rotate(-3deg) scale(${0.7+0.3*ease(f,140,150)})`,boxShadow:'0 10px 0 #7a1420'}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:56,color:'#fff',lineHeight:1}}>MEDICATION-OVERUSE</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:56,color:C.yellow,lineHeight:1}}>HEADACHE (MOH)</div>
    </div></Abs>
  </Cam>);
};
const Drip: React.FC<{c:string; label:string; sub:string; at:number}> = ({c,label,sub,at}) => {
  const f=useCurrentFrame(); const s=useSpring(at); const drop=(((f-at)%30)+30)%30/30;
  return (<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,transform:`perspective(1000px) rotateY(${(1-s)*90}deg) scale(${0.6+0.4*s})`,opacity:s>0.02?1:0}}>
    <svg width={220} height={300} viewBox="0 0 100 140">
      <rect x={20} y={6} width={60} height={70} rx={12} fill="#E9EBF0" stroke="#fff" strokeWidth={3}/>
      <rect x={24} y={30} width={52} height={42} rx={8} fill={c} opacity={0.85}/>
      <line x1={50} y1={76} x2={50} y2={136} stroke="#E9EBF0" strokeWidth={3}/>
      <circle cx={50} cy={84+drop*46} r={4} fill={c}/>
    </svg>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:c}}>{label}</div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:38,color:C.mute}}>{sub}</div>
  </div>);
};
const Study = () => {
  const f=useCurrentFrame();
  const cardOut=1-ease(f,108,116), cal=f>=114&&f<180, talk=f>=180&&f<258, drips=f>=258;
  return (<Cam keys={[[0,1,50,30],[14,1.08,50,22],[60,1.08,50,22],[76,1,50,40],[108,1.04,50,40],[114,1,50,50],[176,1.05,50,50],[180,1,50,50],[254,1.05,50,50],[258,1,50,50],[370,1.08,50,50]]}>
    <Abs x={70} y={240} show={cardOut}><TitleCard inAt={0}/></Abs>
    <Abs x={0} y={1000} w={1080} show={cardOut}><div style={{display:'flex',justifyContent:'center'}}><Flip at={44}><div style={{background:C.red,borderRadius:20,padding:'16px 36px',fontFamily:HEAD,fontWeight:900,fontSize:92,color:'#fff',boxShadow:'0 10px 0 #7a1420'}}>608 ADULTS</div></Flip></div></Abs>
    <Abs x={0} y={1150} w={1080} show={cardOut*ease(f,80,90)}><Label size={54} color={C.text}>chronic migraine · 76 clinics · 11 countries</Label></Abs>
    {cal && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:30}}>
      <Title size={110} delay={115}>Pills on <span style={{color:C.orange}}>20 days</span></Title>
      <Label size={46} delay={118}>of every month (average at the start)</Label>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,130px)',gap:14,marginTop:20}}>
        {Array.from({length:30},(_,i)=>{const on=i<20; const s=ease(f,118+i*1.5,124+i*1.5); return (
          <div key={i} style={{width:130,height:110,borderRadius:14,background:on?C.card:'#22232A',border:`3px solid ${on?C.orange:C.line}`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',transform:`scale(${0.6+0.4*s})`,opacity:s}}>
            <div style={{position:'absolute',top:4,left:10,fontFamily:HEAD,fontWeight:800,fontSize:26,color:C.mute}}>{i+1}</div>
            {on && <Pill size={70} c={i%2?C.orange:C.red}/>}
          </div>);})}
      </div>
    </AbsoluteFill>}
    {talk && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:40}}>
      <Title size={120} delay={181}><span style={{color:C.orange}}>Everyone</span> got</Title>
      <Flip at={186}><div style={{background:C.text,borderRadius:40,padding:'30px 50px',position:'relative',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:96,color:C.bg,lineHeight:1}}>10-MIN TALK</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:'#555'}}>overuse → headache · plan to cut back</div>
        <div style={{position:'absolute',left:120,bottom:-40,width:0,height:0,borderLeft:'30px solid transparent',borderRight:'30px solid transparent',borderTop:`44px solid ${C.text}`}}/>
      </div></Flip>
      <div style={{marginTop:30}}><StickDoc pose="point" mood="smile" size={340} delay={186}/></div>
    </AbsoluteFill>}
    {drips && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40}}>
      <Title size={110} delay={259}>Then <span style={{color:C.orange}}>one</span> drip</Title>
      <div style={{display:'flex',gap:90}}>
        <Drip c={C.orange} label="EPTINEZUMAB" sub="100 mg · 303 people" at={294}/>
        <Drip c={C.gray} label="SALT WATER" sub="placebo · 301 people" at={338}/>
      </div>
      <Label size={46} delay={270} color={C.text}>a computer picked · double-blind</Label>
    </AbsoluteFill>}
  </Cam>);
};
const Bar3D: React.FC<{h:number; c:string; dark:string; w?:number}> = ({h,c,dark,w=220}) => (
  <div style={{position:'relative',width:w,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:w,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Score = () => {
  const f=useCurrentFrame(); const g1=ease(f,60,80), g2=ease(f,126,146); const big=ease(f,248,258);
  return (<Cam keys={[[0,1,50,40],[200,1.04,50,45],[246,1.1,50,55],[287,1.12,50,55]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:14}}>
      <Label size={58} color={C.text} delay={1}>Fewer migraine days per month</Label>
      <Label size={38} delay={4}>weeks 1–4 · from about 21 days at the start</Label>
      <div style={{display:'flex',gap:130,alignItems:'flex-end',height:560,marginTop:60,transform:'perspective(1400px) rotateY(-10deg)'}}>
        {[{l:'DRUG + TALK',v:6.9,c:C.orange,d:'#B5621A',p:g1},{l:'SALT + TALK',v:3.7,c:C.gray,d:'#55575F',p:g2}].map(b=>(
          <div key={b.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{fontFamily:HEAD,fontWeight:900,fontSize:100,color:b.c,marginBottom:40,opacity:b.p>0.95?1:0,transform:`scale(${b.p>0.95?1:0.6})`}}>−{b.v.toFixed(1)}</div>
            <Bar3D h={b.v*52*b.p} c={b.c} dark={b.d}/>
            <div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:C.text}}>{b.l}</div>
          </div>))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:30,marginTop:20}}>
        <div style={{opacity:ease(f,200,210),fontFamily:HEAD,fontWeight:900,fontSize:60,color:C.green}}>talk alone helps ✓</div>
      </div>
      <div style={{opacity:big,transform:`perspective(900px) translateZ(${(1-big)*300}px) rotate(-3deg)`,background:C.orange,borderRadius:24,padding:'10px 40px',boxShadow:'0 14px 0 #7a3d08'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:88,color:'#fff',lineHeight:1}}>DRUG: −3.2 MORE DAYS</div>
      </div>
    </AbsoluteFill>
  </Cam>);
};
const Waffle: React.FC<{v:number; c:string; at:number}> = ({v,c,at}) => {
  const f=useCurrentFrame(); const k=v*ease(f,at,at+24);
  return (<svg width={420} height={420} viewBox="0 0 200 200">
    {Array.from({length:100},(_,i)=>{const x=(i%10)*20+10, y=Math.floor(i/10)*20+10; const fill=Math.max(0,Math.min(1,k-i));
      return <g key={i}><circle cx={x} cy={y} r={7.5} fill={C.line}/>{fill>0 && <circle cx={x} cy={y} r={7.5} fill={c} opacity={fill}/>}</g>;})}
  </svg>);
};
const Both = () => {
  const f=useCurrentFrame(); const joke=f>=208;
  return (<Cam keys={[[0,1,50,40],[180,1.04,50,45],[188,1.1,50,50],[204,1.1,50,50],[208,1,50,50],[298,1.08,50,50]]}>
    {!joke && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Title size={104} delay={1}>Lost <span style={{color:C.orange}}>both</span> diagnoses</Title>
      <Label size={42} delay={4}>no longer chronic migraine AND no longer MOH · weeks 1–4</Label>
      <div style={{display:'flex',gap:60,marginTop:30}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
          <Waffle v={37.8} c={C.orange} at={8}/>
          <div style={{opacity:ease(f,30,38)}}><Flip at={30}><Title size={130} color={C.orange}>37.8%</Title></Flip></div>
          <Label size={46} color={C.text} delay={32}>DRUG + TALK</Label>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,opacity:ease(f,112,120)}}>
          <Waffle v={18.1} c={'#D9DCE3'} at={119}/>
          <div style={{opacity:ease(f,138,146)}}><Flip at={138}><Title size={130} color={C.mute}>18.1%</Title></Flip></div>
          <Label size={46} color={C.text} delay={140}>SALT + TALK</Label>
        </div>
      </div>
      <div style={{opacity:ease(f,184,190),transform:`scale(${0.5+0.5*ease(f,184,192)}) rotate(-6deg)`,border:`10px solid ${C.red}`,color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:120,padding:'0 40px',borderRadius:20,marginTop:10}}>×2 DOUBLE</div>
    </AbsoluteFill>}
    {joke && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30}}>
      <Title size={110} delay={209}>Better odds than <span style={{color:C.red}}>my exam</span></Title>
      <div style={{display:'flex',alignItems:'flex-end',gap:20}}>
        <Flip at={212} axis="Y"><div style={{width:500,height:600,background:'#FBFAF7',borderRadius:16,position:'relative',padding:30,boxShadow:'0 20px 0 #0B0B0E'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:52,color:'#222'}}>PHARMACOLOGY</div>
          {Array.from({length:7},(_,i)=><div key={i} style={{height:14,width:`${60+((i*29)%35)}%`,background:'#C9CBD3',borderRadius:7,marginTop:28}}/>)}
          <div style={{position:'absolute',right:30,top:24,width:150,height:150,borderRadius:75,border:`8px solid ${C.red}`,display:'flex',alignItems:'center',justifyContent:'center',transform:`rotate(-12deg) scale(${ease(f,228,236)})`,fontFamily:HEAD,fontWeight:900,fontSize:80,color:C.red}}>?!</div>
        </div></Flip>
        <StickDoc pose="facepalm" mood="worried" size={320} sweat delay={214}/>
      </div>
    </AbsoluteFill>}
  </Cam>);
};
const Box: React.FC<{at:number; parts:string[]; ok:boolean; note:string}> = ({at,parts,ok,note}) => {
  const f=useCurrentFrame(); const s=useSpring(at);
  return (<div style={{display:'flex',alignItems:'center',gap:24,transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0}}>
    <div style={{display:'flex',gap:12,width:640,justifyContent:'flex-end'}}>
      {parts.map(p=><div key={p} style={{background:p==='SALT'?C.gray:p==='DRUG'?C.orange:C.text,color:p==='TALK'?C.bg:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:58,padding:'8px 26px',borderRadius:14,opacity:ok?1:0.55,border:ok?'none':`4px dashed ${C.mute}`}}>{p}</div>)}
    </div>
    <div style={{width:96,height:96,borderRadius:48,background:ok?C.green:C.red,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff'}}>{ok?'✓':'✗'}</div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:ok?C.mute:C.red,width:220}}>{note}</div>
  </div>);
};
const Catch = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1.1,50,30],[20,1,50,45],[130,1.04,50,50],[193,1.08,50,55]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:36}}>
      <Title size={150} color={C.red} delay={0}>But.</Title>
      <Box at={22} parts={['TALK','DRUG']} ok note="tested"/>
      <Box at={30} parts={['TALK','SALT']} ok note="tested"/>
      <Box at={52} parts={['DRUG']} ok={false} note="never tested"/>
      <Label size={56} color={C.yellow} delay={86}>→ can't split the credit</Label>
      <div style={{opacity:ease(f,134,142),transform:`scale(${0.7+0.3*ease(f,134,142)})`,background:C.card,border:`4px solid ${C.red}`,borderRadius:22,padding:'16px 36px',textAlign:'center',marginTop:20}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:C.text}}>Funded by the drug maker</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>H. Lundbeck A/S · 97.8% of patients in Europe</div>
      </div>
    </AbsoluteFill>
    <Abs x={800} y={1150} show={ease(f,60,70)}><StickDoc pose="shrug" mood="worried" size={240} delay={60} flip/></Abs>
  </Cam>);
};
const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,128,134), b=ease(f,132,140)*(1-ease(f,184,190)), c=ease(f,188,196)*(1-ease(f,256,262));
  const one=f>=65&&f<92, two=f>=92&&f<128;
  return (<Cam keys={[[0,1.12,50,40],[30,1,50,50],[124,1.04,50,50],[132,1,50,50],[182,1.08,50,45],[188,1,50,50],[273,1.12,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:44,opacity:a}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="think" mood="smile" size={290}/>
        <Title size={110}>Drug on<br/><span style={{color:C.orange}}>day one?</span></Title>
      </div>
      <Flip at={16}><div style={{background:C.card,borderRadius:28,padding:'26px 40px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:C.yellow}}>Comment below</div>
        <div style={{display:'flex',gap:26,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:56,color:'#fff',background:one?C.green:C.line,padding:'6px 24px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = yes</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:56,color:'#fff',background:two?C.red:C.line,padding:'6px 24px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = talk first</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,26,40)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:27,color:C.text}}>Jensen RH, et al. Neurology 2026 · doi:10.1212/WNL.0000000000214863</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.mute,marginTop:8}}>Limitation: no drug-only group; 12 weeks; sponsor-funded</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={132}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={136}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={380} delay={132}/>
      <div style={{opacity:ease(f,142,150),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:56,padding:'14px 38px',borderRadius:14}}>FOLLOW #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={188}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={190}/></div>
    </AbsoluteFill>
  </Cam>);
};
const MAP: Record<string, React.FC> = {hook:Hook, study:Study, score:Score, both:Both, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.16,2.82,'What if your painkillers are *CAUSING* your headaches?'],[3.34,3.86,'It\'s *real*.'],[4.3,6.42,'It\'s called *medication-overuse* headache.'],
  [6.78,8.12,'A trial in *Neurology* took'],[8.26,10.42,'*608* adults with chronic migraine,'],[10.66,12.44,'using pills about *20 days* a month.'],
  [12.88,15.12,'Everyone got a *10-minute talk* about cutting back,'],[15.54,16.5,'then *ONE* drip…'],[16.8,18.72,'*eptinezumab*, or salt water.'],
  [19.12,21.36,'In 4 weeks, migraine days dropped by…'],[21.6,23.26,'*6.9* a month with the drug.'],[23.72,25.38,'Salt water? *3.7*.'],
  [25.7,26.68,'So the talk *HELPS*,'],[26.88,28.4,'but the drug took off *3 more*.'],
  [28.7,31.98,'And *37.8%* lost *BOTH* diagnoses…'],[32.28,34.54,'versus *18.1%* on placebo.'],[34.84,35.5,'That\'s *double*.'],
  [35.88,38.18,'Honestly, better odds than my last *exam*.'],
  [38.64,38.94,'*But.*'],[39.44,41.26,'Nobody got the drug *WITHOUT* the talk,'],[41.52,42.78,'so we can\'t split the *credit*.'],
  [43.2,44.74,'And the *drug company* funded it.'],
  [45.08,46.46,'Would you start the drug on day *ONE*?'],[46.84,49.18,'Comment *1* for yes, *2* for talk first.'],
  [49.5,51.18,'*Dr. Mot*, one paper a day…'],[51.46,52.8,'because the real question is…'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #7</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>HEADACHE · NEUROLOGY 2026</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
