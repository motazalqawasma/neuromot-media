import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', blue:'#4C8DF6'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const scenes = [
  {id:'hook', d:9.0},{id:'problem', d:8.4},{id:'change', d:14.8},{id:'study', d:6.8},
  {id:'sens', d:8.5},{id:'roc', d:6.4},{id:'catch', d:12.1},{id:'end', d:6.7},
];
export const TOTAL = Math.round(scenes.reduce((a,s)=>a+s.d,0)*S);
const cl = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const ease = (f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...cl, easing:Easing.out(Easing.cubic)});
const useSpring = (delay:number)=>{const f=useCurrentFrame(); const {fps}=useVideoConfig(); return spring({frame:f-delay,fps,config:{damping:13,mass:0.6}});};

const Title: React.FC<{children:React.ReactNode; color?:string; delay?:number; size?:number}> = ({children,color=C.text,delay=0,size=120}) => {
  const f=useCurrentFrame(); const p=ease(f,delay,delay+14);
  return <div style={{fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:0.95,color,textTransform:'uppercase',textAlign:'center',opacity:p,transform:`translateY(${(1-p)*30}px)`,textShadow:'5px 5px 0 rgba(0,0,0,.4)'}}>{children}</div>;
};
const Label: React.FC<{children:React.ReactNode; color?:string; delay?:number; size?:number}> = ({children,color=C.mute,delay=0,size=46}) => {
  const f=useCurrentFrame(); const p=ease(f,delay,delay+12);
  return <div style={{fontFamily:HEAD,fontWeight:800,fontSize:size,color,textAlign:'center',opacity:p,letterSpacing:1}}>{children}</div>;
};
const Center: React.FC<{children:React.ReactNode}> = ({children}) => <AbsoluteFill style={{padding:'170px 70px 140px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-evenly'}}>{children}</AbsoluteFill>;

// ---------- reusable graphics ----------
const BRAIN = "M300 70 C200 60 120 110 100 190 C60 210 50 280 80 330 C60 380 90 450 160 460 C200 520 290 530 340 490 C390 530 480 520 510 460 C580 450 610 380 590 330 C620 280 610 210 570 190 C550 110 470 60 370 70 C350 60 320 60 300 70 Z";
const Brain: React.FC<{size?:number; glow?:string; children?:React.ReactNode; draw?:number}> = ({size=560, glow=C.text, children, draw=1}) => (
  <svg width={size} height={size*0.9} viewBox="40 40 600 520">
    <path d={BRAIN} fill="#2A2C34" stroke={glow} strokeWidth={10} strokeDasharray={2400} strokeDashoffset={2400*(1-draw)} strokeLinejoin="round"/>
    <path d="M340 80 C330 200 350 330 340 490" fill="none" stroke={glow} strokeWidth={7} opacity={0.5*draw}/>
    <path d="M150 230 C200 250 220 300 190 350 M480 220 C440 260 440 300 490 350 M240 140 C260 180 300 190 320 170 M420 140 C400 180 370 190 360 170" fill="none" stroke={glow} strokeWidth={6} opacity={0.35*draw} strokeLinecap="round"/>
    {children}
  </svg>
);
// vessel cross-section with amyloid build-up
const _V=0;
const Vessel: React.FC<{amount:number}> = ({amount}) => {
  const dots = Array.from({length:28},(_,i)=>i);
  return (
    <svg width={420} height={420} viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={80} fill="none" stroke={C.red} strokeWidth={18} opacity={0.85}/>
      <circle cx={100} cy={100} r={58} fill="#3a1015"/>
      {dots.map(i=>{const a=i/28*Math.PI*2; const show=amount>i/28; return <circle key={i} cx={100+80*Math.cos(a)} cy={100+80*Math.sin(a)} r={show?7:0} fill={C.orange}/>;})}
    </svg>
  );
};

// ---------- scenes ----------
const Hook = () => {
  const f=useCurrentFrame();
  return (<Center>
    <Title size={110} delay={2}>Amyloid in the<br/><span style={{color:C.orange}}>vessel walls</span></Title>
    <div style={{transform:`scale(${useSpring(10)})`}}><Vessel amount={ease(f,20,170)}/></div>
    <Title size={140} color={C.red} delay={185}>CAA</Title>
  </Center>);
};
const Problem = () => {
  const f=useCurrentFrame(); const t=ease(f,25,140);
  const stages=[{x:0.12,l:'EARLY'},{x:0.5,l:''},{x:0.88,l:'LATE'}];
  return (<Center>
    <Title size={100} delay={0}>v1.5 waits for a <span style={{color:C.red}}>bleed</span></Title>
    <div style={{display:'flex',gap:30,alignItems:'flex-end'}}>
      {[0,1,2].map(i=>{const on=t>(i+0.6)/3; return (
        <div key={i} style={{opacity:ease(f,10+i*12,22+i*12)}}>
          <Brain size={280} glow={on&&i===2?C.red:C.mute}>
            {i===2 && <circle cx={230} cy={260} r={70*ease(f,110,150)} fill={C.red} opacity={0.85}/>}
          </Brain>
        </div>);})}
    </div>
    <svg width={900} height={120} viewBox="0 0 900 120">
      <line x1={40} y1={50} x2={860} y2={50} stroke={C.line} strokeWidth={14} strokeLinecap="round"/>
      <line x1={40} y1={50} x2={40+820*t} y2={50} stroke={C.orange} strokeWidth={14} strokeLinecap="round"/>
      <polygon points={`${860},30 ${890},50 ${860},70`} fill={C.orange} opacity={t}/>
      <text x={40} y={110} fill={C.mute} fontFamily={HEAD} fontWeight={800} fontSize={40}>DISEASE STARTS</text>
      <text x={860} y={110} fill={C.red} fontFamily={HEAD} fontWeight={800} fontSize={40} textAnchor="end" opacity={t}>DIAGNOSED</text>
    </svg>
    <Label delay={150} color={C.yellow} size={58}>Many patients missed</Label>
  </Center>);
};
const Change = () => {
  const f=useCurrentFrame();
  const pvs = Array.from({length:24},(_,i)=>({x:200+((i*53)%260),y:200+((i*37)%170),r:(i*29)%180}));
  const spots = Array.from({length:12},(_,i)=>({x:170+((i*71)%320),y:180+((i*43)%220)}));
  const panel = (k:number, title:string, sub:string, content:React.ReactNode) => {
    const p=ease(f,[60,150,250][k],[80,170,270][k]);
    return (<div style={{display:'flex',alignItems:'center',gap:30,opacity:p,transform:`translateX(${(1-p)*-80}px)`}}>
      <div style={{width:300,height:260,background:C.card,borderRadius:24,overflow:'hidden'}}>{content}</div>
      <div style={{width:560}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:68,color:C.orange}}>{title}</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:46,color:C.mute}}>{sub}</div>
      </div>
    </div>);
  };
  const c1=ease(f,80,130), c2=ease(f,165,225), c3=ease(f,270,330);
  return (<Center>
    <Title size={96}>v2.0 adds <span style={{color:C.orange}}>3 MRI clues</span></Title>
    {panel(0,'SIDEROSIS ×2','multifocal = 2 lesions',
      <svg viewBox="40 40 600 520" width={300} height={260}><path d={BRAIN} fill="#222" stroke="#555" strokeWidth={8}/>
        <path d="M120 200 C110 260 120 320 150 380" stroke={C.orange} strokeWidth={22} fill="none" strokeDasharray={400} strokeDashoffset={400*(1-c1)} strokeLinecap="round"/>
        <path d="M560 200 C575 260 565 320 530 380" stroke={C.orange} strokeWidth={22} fill="none" strokeDasharray={400} strokeDashoffset={400*(1-c1)} strokeLinecap="round"/></svg>)}
    {panel(1,'PVS > 20','enlarged spaces, one hemisphere',
      <svg viewBox="40 40 600 520" width={300} height={260}><path d={BRAIN} fill="#222" stroke="#555" strokeWidth={8}/>
        {pvs.map((d,i)=><rect key={i} x={d.x} y={d.y} width={34} height={8} rx={4} fill={C.blue} transform={`rotate(${d.r} ${d.x+17} ${d.y+4})`} opacity={c2>i/24?1:0}/>)}</svg>)}
    {panel(2,'WMH SPOTS > 10','multispot white matter',
      <svg viewBox="40 40 600 520" width={300} height={260}><path d={BRAIN} fill="#222" stroke="#555" strokeWidth={8}/>
        {spots.map((d,i)=><circle key={i} cx={d.x} cy={d.y} r={c3>i/12?18:0} fill={C.text}/>)}</svg>)}
    <Label delay={360} color={C.yellow} size={56}>No bleed needed</Label>
  </Center>);
};
const Study = () => {
  const f=useCurrentFrame();
  const N=341, cols=19;
  const groups=[{n:159,c:C.red,l:'DERIVATION'},{n:59,c:C.orange,l:'TEMPORAL'},{n:123,c:C.blue,l:'GEOGRAPHICAL'}];
  const color=(i:number)=> i<159?C.red: i<218?C.orange:C.blue;
  const shown=Math.floor(N*ease(f,10,90));
  return (<Center>
    <div style={{display:'flex',alignItems:'baseline',gap:24}}>
      <Title size={190} color={C.text}>{shown}</Title><Label size={60} color={C.mute}>PATIENTS · 10 CENTRES</Label>
    </div>
    <svg width={900} height={900*18/cols} viewBox={`0 0 ${cols*20} ${18*20}`}>
      {Array.from({length:N},(_,i)=><circle key={i} cx={10+(i%cols)*20} cy={10+Math.floor(i/cols)*20} r={i<shown?7.5:0} fill={color(i)}/>)}
    </svg>
    <div style={{display:'flex',gap:40}}>{groups.map(g=><div key={g.l} style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:30,height:30,borderRadius:15,background:g.c}}/><span style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.text}}>{g.l} {g.n}</span></div>)}</div>
    <div style={{display:'flex',alignItems:'center',gap:30,opacity:ease(f,120,140)}}>
      <span style={{fontFamily:HEAD,fontWeight:900,fontSize:64}}>MRI</span>
      <span style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:C.orange}}>⇄</span>
      <span style={{fontFamily:HEAD,fontWeight:900,fontSize:64}}>BRAIN TISSUE 🔬</span>
    </div>
  </Center>);
};
const Waffle: React.FC<{n:number; from:number; color:string; label:string; delay:number}> = ({n,from,color,label,delay}) => {
  const f=useCurrentFrame(); const k=interpolate(f,[delay,delay+40],[0,n],cl);
  return (<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
    <svg width={400} height={400} viewBox="0 0 200 200">
      {Array.from({length:100},(_,i)=>{const x=(i%10)*20+10, y=(9-Math.floor(i/10))*20+10; return <circle key={i} cx={x} cy={y} r={7.5} fill={i<k?color:'#3A3C45'}/>;})}
    </svg>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:100,color}}>{(k*from/n||0).toFixed(1)}%</div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:C.mute}}>{label}</div>
  </div>);
};
const Sens = () => (<Center>
  <Title size={96}>Sensitivity: <span style={{color:C.red}}>cases caught</span></Title>
  <div style={{display:'flex',gap:40}}>
    <Waffle n={71} from={70.8} color="#7A7D88" label="v1.5" delay={20}/>
    <Waffle n={80} from={79.8} color={C.red} label="v2.0" delay={70}/>
  </div>
  <Label delay={130} color={C.yellow} size={60}>+9 per 100 patients</Label>
</Center>);
const Roc = () => {
  const f=useCurrentFrame();
  const d1=ease(f,20,70), d2=ease(f,60,110);
    const curve=(k:number)=>`M60 540 C ${60+80} ${540-420*k}, ${60+200} ${60+40/k}, 540 60`;
  return (<Center>
    <Title size={96}>No extra <span style={{color:C.green}}>false alarms</span></Title>
    <div style={{display:'flex',alignItems:'center',gap:30}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:130,color:C.green}}>95%</div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>SPECIFICITY<br/>BOTH VERSIONS</div>
      </div>
      <div style={{display:'flex',gap:20}}>{[{v:0.798,c:'#7A7D88',l:'v1.5',d:d1},{v:0.848,c:C.orange,l:'v2.0',d:d2}].map(g=>{const ang=Math.PI*(1-g.v*g.d); const x=150+120*Math.cos(ang), y=160-120*Math.sin(ang); return (
        <svg key={g.l} width={300} height={260} viewBox="0 0 300 220">
          <path d="M30 160 A120 120 0 0 1 270 160" fill="none" stroke={C.line} strokeWidth={26} strokeLinecap="round"/>
          <path d={`M30 160 A120 120 0 0 1 ${x} ${y}`} fill="none" stroke={g.c} strokeWidth={26} strokeLinecap="round"/>
          <text x={150} y={150} textAnchor="middle" fill={g.c} fontFamily={HEAD} fontWeight={900} fontSize={60}>{(g.v*g.d).toFixed(3)}</text>
          <text x={150} y={205} textAnchor="middle" fill={C.mute} fontFamily={HEAD} fontWeight={800} fontSize={36}>{g.l}</text>
        </svg>);})}</div>
    </div>
    <div style={{display:'flex',alignItems:'baseline',gap:24}}>
      <span style={{fontFamily:HEAD,fontWeight:800,fontSize:56,color:C.mute}}>OVERALL ACCURACY (AUC) · AUTOPSY n=150</span>
    </div>
    <Label delay={115} size={40}>p = 0.0005</Label>
  </Center>);
};
const Catch = () => {
  const f=useCurrentFrame();
  const items=[
    {icon:<svg width={200} height={200} viewBox="0 0 100 100"><path d="M10 15 H90 L60 50 V85 L40 75 V50 Z" fill="none" stroke={C.red} strokeWidth={7} strokeLinejoin="round"/></svg>, t:'Selected patients', s:'only MRI + tissue cases'},
    {icon:<svg width={200} height={200} viewBox="0 0 100 100"><circle cx={50} cy={50} r={38} fill="none" stroke={C.red} strokeWidth={7}/><path d="M12 50 H88 M50 12 C30 35 30 65 50 88 M50 12 C70 35 70 65 50 88" fill="none" stroke={C.red} strokeWidth={5}/></svg>, t:'Mostly White', s:'other groups untested'},
    {icon:<div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:C.red,lineHeight:'200px'}}>55.1%</div>, t:'No bleed?', s:'sensitivity still low (autopsy)'},
  ];
  return (<Center>
    <Title size={120} color={C.red}>The catch</Title>
    {items.map((it,i)=>{const dl=[20,195,255][i]; const p=ease(f,dl,dl+20); return (
      <div key={i} style={{display:'flex',alignItems:'center',gap:40,width:900,opacity:p,transform:`scale(${0.8+0.2*p})`}}>
        <div style={{width:200,height:200,display:'flex',alignItems:'center',justifyContent:'center',background:C.card,borderRadius:30}}>{it.icon}</div>
        <div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:76}}>{it.t}</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:C.mute}}>{it.s}</div></div>
      </div>);})}
  </Center>);
};
const End = () => {
  const f=useCurrentFrame();
  return (<Center>
    <div style={{transform:`scale(${useSpring(4)})`}}>
      <Brain size={460} glow={C.orange} draw={ease(f,0,40)}>
        <circle cx={340} cy={300} r={110*ease(f,30,50)} fill={C.green}/>
        <path d="M285 300 L325 340 L400 260" fill="none" stroke="#fff" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={220} strokeDashoffset={220*(1-ease(f,45,65))}/>
      </Brain>
    </div>
    <Title size={110} delay={50}>More found.<br/><span style={{color:C.orange}}>Same specificity.</span></Title>
    <div style={{textAlign:'center',opacity:ease(f,80,95)}}>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:34,color:C.text}}>Charidimou A, et al. Lancet Neurol 2022 · doi:10.1016/S1474-4422(22)00208-3</div>
      <div style={{fontFamily:BODY,fontWeight:600,fontSize:32,color:C.mute,marginTop:8}}>Limitation: selected, mostly White patients · <span style={{color:C.yellow}}>For education — not medical advice</span></div>
    </div>
    <div style={{opacity:ease(f,100,115),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'14px 34px',borderRadius:14}}>FOLLOW #NeuroMot</div>
  </Center>);
};
const MAP: Record<string, React.FC> = {hook:Hook, problem:Problem, change:Change, study:Study, sens:Sens, roc:Roc, catch:Catch, end:End};
const SceneFade: React.FC<{dur:number; children:React.ReactNode}> = ({dur, children}) => {
  const f=useCurrentFrame(); const o=interpolate(f,[0,8,dur-8,dur],[0,1,1,0],cl);
  return <AbsoluteFill style={{opacity:o, transform:`scale(${interpolate(f,[0,dur],[1,1.03])})`}}>{children}</AbsoluteFill>;
};
export const Video: React.FC = () => {
  const f=useCurrentFrame(); let start=0;
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <Audio src={staticFile('voice.mp3')}/>
    {scenes.map(s=>{const from=Math.round(start*S), dur=Math.round(s.d*S); start+=s.d; const Comp=MAP[s.id];
      return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneFade dur={dur}><Comp/></SceneFade></Sequence>;})}
    <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>#NeuroMot</div>
    <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>NEUROLOGY · LANCET NEUROL 2022</div>
    <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${(f/TOTAL)*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
  </AbsoluteFill>);
};
