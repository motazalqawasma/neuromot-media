import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import {Spine3D} from './Spine3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-01, ElevenLabs Scribe word timings) — scene starts 0, 8.5, 18.5, 26.2, 39.15, 43.25 s ; voice ends 54.56 s
const scenes = [
  {id:'hook', d:8.5},{id:'study', d:10.0},{id:'score', d:7.7},{id:'year', d:12.95},
  {id:'catch', d:4.1},{id:'end', d:11.8},
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

// ---------- scenes (Neuro Paper #8 — OSCIS, Chikuda, JAMA Netw Open 2021, CC BY) ----------
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Credit: React.FC<{show:number}> = ({show}) => <div style={{opacity:show,fontFamily:BODY,fontWeight:600,fontSize:24,color:C.mute,textAlign:'center'}}>JAMA Netw Open 2021 · CC BY · page text via PubMed Central</div>;
// window onto part of a real page image (clip + offset)
const PageWin: React.FC<{src:string; w:number; srcW:number; y0:number; h:number; boxes?:Box[]; inAt?:number}> = ({src,w,srcW,y0,h,boxes=[],inAt=0}) => {
  const k=w/srcW; const f=useCurrentFrame(); const p=ease(f,inAt,inAt+14);
  return (<div style={{width:w,height:h,overflow:'hidden',borderRadius:12,background:'#fff',boxShadow:'0 40px 90px rgba(0,0,0,.65)',
    transform:`perspective(1800px) translateY(${(1-p)*260}px) rotateX(${(1-p)*55}deg) rotateZ(${-1.5*p}deg)`,opacity:p}}>
    <div style={{transform:`translateY(${-y0*k}px)`}}><Page src={src} w={w} srcW={srcW} boxes={boxes} tilt={0} inAt={-20}/></div>
  </div>);
};

const Hook = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1,50,45],[200,1.08,50,45],[255,1.14,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={124}>Operate <span style={{color:C.orange}}>now</span>…<br/>or <span style={{color:C.orange}}>wait</span> 2 weeks?</Title>
      </div>
    </AbsoluteFill>
    <Abs x={80} y={480}><Spine3D width={920} height={900} zoom={1+0.15*ease(f,0,250)} squeeze={ease(f,90,130)}/></Abs>
    <Abs x={20} y={1050}><div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><NameTag at={8}/><StickDoc pose={f<180?'think':'point'} from="think" mood={f<180?'worried':'surprised'} size={280} delay={f<180?0:180}/></div></Abs>
    <Abs x={600} y={620} show={ease(f,95,105)}><div style={{background:C.red,borderRadius:16,padding:'8px 22px',transform:`rotate(3deg) scale(${0.7+0.3*ease(f,95,105)})`,boxShadow:'0 10px 0 #7a1420',fontFamily:HEAD,fontWeight:900,fontSize:50,color:'#fff'}}>NECK CORD INJURY</div></Abs>
    <Abs x={430} y={1240} show={ease(f,205,215)}><div style={{background:C.card,border:`4px solid ${C.yellow}`,borderRadius:18,padding:'10px 26px',transform:`rotate(-3deg) scale(${0.7+0.3*ease(f,205,215)})`,fontFamily:HEAD,fontWeight:900,fontSize:54,color:C.yellow}}>WAIT FOR THE 1-YEAR TWIST ⏳</div></Abs>
  </Cam>);
};
const Chip: React.FC<{at:number; c:string; children:React.ReactNode}> = ({at,c,children}) => {const s=useSpring(at); return (
  <div style={{transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0,background:c,borderRadius:18,padding:'12px 34px',fontFamily:HEAD,fontWeight:900,fontSize:64,color:'#fff',boxShadow:'0 10px 0 #0B0B0E'}}>{children}</div>);};
const Study = () => {
  const f=useCurrentFrame();
  const pageOut=1-ease(f,118,126), chips=f>=124&&f<196, split=f>=196;
  return (<Cam keys={[[0,1,50,30],[14,1.06,50,25],[60,1.06,50,25],[76,1,50,40],[118,1.04,50,40],[124,1,50,50],[192,1.05,50,50],[196,1,50,50],[300,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:pageOut}}>
      <Page src="page1.png" w={940} srcW={840} inAt={0} boxes={[{x:65,y:188,w:701,h:314,at:14},{x:65,y:561,w:701,h:72,at:32,note:'this team',nx:300,ny:633}]}/>
      <div style={{marginTop:70,display:'flex',gap:24}}>
        <Flip at={60}><div style={{background:C.red,borderRadius:20,padding:'12px 32px',fontFamily:HEAD,fontWeight:900,fontSize:84,color:'#fff',boxShadow:'0 10px 0 #7a1420'}}>70 ADULTS</div></Flip>
        <Flip at={8}><div style={{background:C.card,border:`4px solid ${C.orange}`,borderRadius:20,padding:'12px 28px',fontFamily:HEAD,fontWeight:900,fontSize:64,color:C.orange}}>43 HOSPITALS · JAPAN</div></Flip>
      </div>
      <Credit show={ease(f,20,30)}/>
    </AbsoluteFill>
    {chips && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:44}}>
      <Title size={100} delay={125}>Who was in it?</Title>
      <Chip at={127} c={C.card}>INCOMPLETE CORD INJURY</Chip>
      <Chip at={132} c={C.card}>NARROW NECK CANAL</Chip>
      <Chip at={150} c={C.red}>NO FRACTURE</Chip>
      <div style={{marginTop:10}}><StickDoc pose="point" mood="smile" size={280} delay={130}/></div>
    </AbsoluteFill>}
    {split && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:40}}>
      <Title size={110} delay={197}>A coin flip</Title>
      <div style={{display:'flex',gap:50,marginTop:20}}>
        <Flip at={200} axis="Y"><div style={{width:440,height:520,background:C.orange,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #7a3d08'}}>
          <div style={{fontSize:150}}>🔪</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:84,color:'#fff'}}>SURGERY</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff'}}>within 24 h</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:'#3a1a02'}}>37 patients</div></div></Flip>
        <Flip at={270} axis="Y"><div style={{width:440,height:520,background:C.gray,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #3a3c45'}}>
          <div style={{fontSize:150}}>⏳</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:84,color:'#fff'}}>WAIT</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff'}}>≥ 2 weeks first</div><div style={{fontFamily:HEAD,fontWeight:800,fontSize:40,color:'#1b1c22'}}>33 patients</div></div></Flip>
      </div>
    </AbsoluteFill>}
  </Cam>);
};
const Bar3D: React.FC<{h:number; c:string; dark:string; w?:number}> = ({h,c,dark,w=220}) => (
  <div style={{position:'relative',width:w,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:w,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Bars: React.FC<{title:string; a:number; b:number; ga:number; gb:number; scale:number}> = ({title,a,b,ga,gb,scale}) => (
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
    <Label size={60} color={C.text}>{title}</Label>
    <Label size={36}>motor score gain (ASIA, points)</Label>
    <div style={{display:'flex',gap:130,alignItems:'flex-end',height:640,marginTop:30,transform:'perspective(1400px) rotateY(-10deg)'}}>
      {[{l:'SURGERY NOW',v:a,c:C.orange,d:'#B5621A',p:ga},{l:'WAITED',v:b,c:C.gray,d:'#55575F',p:gb}].map(x=>(
        <div key={x.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:110,color:x.c,marginBottom:40,opacity:x.p>0.95?1:0,transform:`scale(${x.p>0.95?1:0.6})`}}>{x.v.toFixed(1)}</div>
          <Bar3D h={x.v*scale*x.p} c={x.c} dark={x.d}/>
          <div style={{fontFamily:HEAD,fontWeight:800,fontSize:46,color:C.text}}>{x.l}</div>
        </div>))}
    </div>
  </div>);
const Score = () => {
  const f=useCurrentFrame(); const pg=1-ease(f,58,66);
  return (<Cam keys={[[0,1.05,50,40],[60,1,50,40],[200,1.06,50,50],[231,1.1,50,55]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:30,opacity:pg}}>
      <Title size={110}>At <span style={{color:C.orange}}>2 weeks</span>…</Title>
      <PageWin src="page2.png" w={1000} srcW={840} y0={860} h={430} inAt={2} boxes={[{x:65,y:1004,w:304,h:31,at:12}]}/>
      <Credit show={ease(f,10,20)}/>
    </AbsoluteFill>
    {f>=60 && <AbsoluteFill style={{alignItems:'center',paddingTop:240,gap:20}}>
      <Bars title="AFTER 2 WEEKS" a={34.2} b={18.9} ga={ease(f,66,84)} gb={ease(f,150,166)} scale={7.5}/>
      <div style={{opacity:ease(f,200,208),transform:`scale(${0.5+0.5*ease(f,200,210)}) rotate(-5deg)`,border:`10px solid ${C.red}`,color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:96,padding:'0 36px',borderRadius:20,marginTop:10}}>ALMOST 2× FASTER</div>
    </AbsoluteFill>}
  </Cam>);
};
const Year = () => {
  const f=useCurrentFrame(); const bars=f<130, page=f>=126&&f<162, joke=f>=158&&f<291, seven=f>=287;
  return (<Cam keys={[[0,1,50,40],[124,1.05,50,50],[130,1,50,45],[158,1.04,50,45],[162,1,50,50],[286,1.05,50,50],[291,1,50,50],[389,1.06,50,50]]}>
    {bars && <AbsoluteFill style={{alignItems:'center',paddingTop:240,gap:20,opacity:1-ease(f,124,130)}}>
      <Bars title="AFTER 1 YEAR" a={53.7} b={48.5} ga={ease(f,30,48)} gb={ease(f,80,96)} scale={7.5}/>
      <div style={{opacity:ease(f,124,128),fontFamily:HEAD,fontWeight:900,fontSize:80,color:C.yellow}}>gap: 5.2 points</div>
    </AbsoluteFill>}
    {page && <AbsoluteFill style={{alignItems:'center',paddingTop:320,gap:30}}>
      <Title size={110} delay={127} color={C.red}>Not significant</Title>
      <PageWin src="page2.png" w={1000} srcW={840} y0={380} h={300} inAt={126} boxes={[{x:122,y:443,w:290,h:31,at:132},{x:295,y:562,w:304,h:31,at:138}]}/>
      <Label size={44} delay={134} color={C.text}>P = .27 · 95% CI −4.2 to 14.5</Label>
    </AbsoluteFill>}
    {joke && <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:30}}>
      <Title size={104} delay={159}>Same grade in the <span style={{color:C.orange}}>end</span></Title>
      <div style={{display:'flex',gap:60,alignItems:'flex-end'}}>
        {[{n:'ALL SEMESTER',book:'📚',at:162},{n:'CRAMS',book:'☕',at:215}].map(s=>(
          <Flip key={s.n} at={s.at} axis="Y"><div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
            <div style={{fontSize:110}}>{s.book}</div>
            <StickDoc pose={s.n==='CRAMS'?'facepalm':'thumbs'} mood={s.n==='CRAMS'?'worried':'smile'} size={250} sweat={s.n==='CRAMS'} delay={s.at}/>
            <div style={{fontFamily:HEAD,fontWeight:900,fontSize:52,color:C.text}}>{s.n}</div>
            <div style={{opacity:ease(f,262,270),transform:`scale(${0.5+0.5*ease(f,262,272)}) rotate(-8deg)`,width:150,height:150,borderRadius:75,border:`8px solid ${C.green}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:HEAD,fontWeight:900,fontSize:84,color:C.green}}>B+</div>
          </div></Flip>))}
      </div>
    </AbsoluteFill>}
    {seven && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:30}}>
      <Title size={100} delay={288}><span style={{color:C.green}}>7 of 33</span> who waited</Title>
      <div style={{display:'grid',gridTemplateColumns:'repeat(11,76px)',gap:14,marginTop:10}}>
        {Array.from({length:33},(_,i)=>{const s=ease(f,290+i*0.8,296+i*0.8); const g=i<7&&f>=318; return (
          <div key={i} style={{width:76,height:76,borderRadius:38,background:g?C.green:C.line,border:`4px solid ${g?'#bff3d4':C.gray}`,transform:`scale(${0.5+0.5*s})`,opacity:s}}/>);})}
      </div>
      <Label size={66} color={C.text} delay={320}>never needed surgery</Label>
      <Label size={38} delay={326}>(in the wait group, during the study)</Label>
    </AbsoluteFill>}
  </Cam>);
};
const Catch = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1.1,50,30],[20,1,50,45],[123,1.06,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:240,gap:40}}>
      <Title size={150} color={C.red} delay={0}>The catch?</Title>
      <Chip at={26} c={C.card}>⛔ STOPPED EARLY</Chip>
      <Chip at={56} c={C.card}>🔬 SMALL: 70 PATIENTS</Chip>
      <Chip at={80} c={C.red}>👀 NOBODY BLINDED</Chip>
    </AbsoluteFill>
    <Abs x={780} y={1130} show={ease(f,30,40)}><StickDoc pose="shrug" mood="worried" size={240} delay={30} flip/></Abs>
  </Cam>);
};
const End = () => {
  const f=useCurrentFrame();
  const e=1-ease(f,136,142), a=ease(f,140,146)*(1-ease(f,226,232)), b=ease(f,230,238)*(1-ease(f,288,294)), c=ease(f,292,300);
  const one=f>=176&&f<203, two=f>=203&&f<230;
  return (<Cam keys={[[0,1.1,50,40],[30,1,50,50],[136,1.05,50,50],[142,1,50,50],[224,1.04,50,50],[232,1,50,50],[288,1.06,50,45],[294,1,50,50],[354,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:40,opacity:e}}>
      <Flip at={2}><div style={{background:C.yellow,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:72,padding:'6px 34px',borderRadius:14}}>📌 EXAM LINE</div></Flip>
      <Title size={118} delay={30}>Early surgery =<br/><span style={{color:C.orange}}>faster</span> recovery</Title>
      <Title size={92} delay={95} color={C.mute}>not a proven<br/>better year</Title>
      <StickDoc pose="point" mood="smile" size={260} delay={30}/>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:40,opacity:a}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="think" mood="smile" size={280} delay={140}/>
        <Title size={116} delay={141}>Would you<br/><span style={{color:C.orange}}>operate?</span></Title>
      </div>
      <Flip at={150}><div style={{background:C.card,borderRadius:28,padding:'26px 40px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:C.yellow}}>Comment below</div>
        <div style={{display:'flex',gap:26,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:one?C.orange:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = now</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:'#fff',background:two?C.gray:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = wait</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,156,166)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.text}}>Chikuda H, et al. JAMA Netw Open 2021 · doi:10.1001/jamanetworkopen.2021.33604</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.mute,marginTop:8}}>Limitation: stopped early, small, open-label; only AIS C injuries without fracture</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={230}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={234}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={360} delay={230}/>
      <div style={{opacity:ease(f,240,248),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:56,padding:'14px 38px',borderRadius:14}}>FOLLOW #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={292}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={294}/></div>
    </AbsoluteFill>
  </Cam>);
};
const MAP: Record<string, React.FC> = {hook:Hook, study:Study, score:Score, year:Year, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.27,1.2,'Operate *NOW*…'],[1.44,2.84,'or *wait 2 weeks*?'],[3.12,4.56,'After a neck *cord injury*,'],[4.6,6.64,'a trial tested exactly that…'],[6.72,8.4,'and wait for the *1-year twist*.'],
  [8.64,10.56,'*43 hospitals* in Japan.'],[10.6,12.96,'*70 adults*, incomplete cord injury,'],[13.0,15.04,'narrow canal, *NO fracture*.'],
  [15.16,17.36,'Half got surgery within *24 hours*.'],[17.52,18.48,'Half *WAITED*.'],
  [18.69,19.68,'At *2 weeks*…'],[19.8,22.88,'early surgery gained *34.2* motor points.'],[23.08,24.96,'Waiting? *18.9*.'],[25.16,26.16,'Basically *DOUBLE*.'],
  [26.23,27.28,'But at *1 year*…'],[27.32,30.24,'*53.7* versus *48.5*.'],[30.32,31.36,'*Not significant*.'],
  [31.4,33.2,'Like the student who studies all semester'],[33.28,34.48,'and the one who *crams*…'],[34.56,35.84,'same grade in the *END*.'],
  [35.92,37.52,'And *7 of 33* who waited'],[37.76,39.12,'never needed *surgery*.'],
  [39.19,39.8,'The *catch*?'],[39.92,40.96,'It stopped *EARLY*,'],[41.0,41.76,'it was *small*,'],[41.84,43.2,'and nobody was *blinded*.'],
  [43.54,44.16,'*Exam line*:'],[44.28,46.4,'early surgery means *FASTER* recovery,'],[46.48,47.68,'not a proven *better year*.'],
  [48.0,48.8,'Would you *operate*?'],[49.12,50.72,'*1* for now, *2* for wait.'],
  [50.96,52.96,'*Dr. Mot*, one paper a day…'],[53.04,54.56,'because the real question is…'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #8</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>SPINE · JAMA NETW OPEN 2021</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
