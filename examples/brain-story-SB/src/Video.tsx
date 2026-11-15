import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {Split3D, projectSplit, SPLIT_ORBIT} from './Split3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-15 night, atempo 1.12 -> 51.5 s), word times from ElevenLabs Scribe on the final file
const R = 1;
const scenes = [
  {id:'hook', d:6.1},{id:'la', d:17.3-6.1},{id:'normal', d:21.4-17.3},{id:'test', d:30.75-21.4},{id:'mouth', d:36.15-30.75},{id:'end', d:51.9-36.15},
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

// ---------- scenes (Brain Story #5 - Wilder Penfield, awake brain surgery, 1930s) ----------
const Stamp: React.FC<{at:number; c?:string; size?:number; children:React.ReactNode}> = ({at,c=C.red,size=120,children}) => {const f=useCurrentFrame(); return (
  <div style={{opacity:ease(f,at,at+6),transform:`scale(${1.5-0.5*ease(f,at,at+8)}) rotate(-5deg)`,border:`10px solid ${c}`,color:c,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'10px 40px',borderRadius:20,background:'rgba(26,27,32,.85)',textAlign:'center'}}>{children}</div>);};
const QCard: React.FC<{at:number; foot:string}> = ({at,foot}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 40px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:C.yellow}}>PHONE IN WHICH HAND?</div>
    <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',background:C.blue,padding:'6px 22px',borderRadius:14,whiteSpace:'nowrap'}}>1 = LEFT</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:54,color:'#fff',background:C.red,padding:'6px 22px',borderRadius:14,whiteSpace:'nowrap'}}>2 = RIGHT</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:46,color:C.text,marginTop:14}}>{foot}</div>
  </div></Flip>);
const Bubble: React.FC<{at:number; children:React.ReactNode; size?:number}> = ({at,children,size=150}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{position:'relative',opacity:p,transform:`scale(${0.5+0.5*p})`,background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'24px 60px',borderRadius:60,boxShadow:'0 12px 0 #0B0B0E'}}>
    {children}<div style={{position:'absolute',left:90,bottom:-40,width:0,height:0,borderLeft:'30px solid transparent',borderRight:'30px solid transparent',borderTop:'48px solid #fff'}}/></div>);};

const Row: React.FC<{at:number; c:string; children:React.ReactNode}> = ({at,c,children}) => {const s=useSpring(at); return (
  <div style={{transform:`translateX(${(1-s)*-60}px)`,opacity:s>0.02?1:0,background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'14px 28px',fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};

const T = (raw:number, start:number)=>Math.round((raw-start)/R*S); // voice time (raw s) -> scene frame

// ---------- Brain Story #6 - the split brain (W.J., 1962) ----------
const Phone: React.FC<{w?:number; c?:string; glow?:number}> = ({w=120,c=C.text,glow=0}) => (
  <div style={{width:w,height:w*1.9,borderRadius:w*0.18,border:`${Math.round(w*0.07)}px solid ${c}`,background:'#0F1014',boxShadow:`0 0 ${40*glow}px ${C.yellow}, 0 10px 0 #0B0B0E`,position:'relative'}}>
    <div style={{position:'absolute',left:'30%',right:'30%',top:w*0.08,height:w*0.06,borderRadius:8,background:c,opacity:0.6}}/>
  </div>);
const HandCard: React.FC<{at:number; n:string; label:string; c:string; hi?:number}> = ({at,n,label,c,hi=0}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${(0.5+0.5*s)*(1+0.08*hi)})`,opacity:s>0.02?1:0,display:'flex',flexDirection:'column',alignItems:'center',gap:16,background:C.card,border:`6px solid ${c}`,borderRadius:28,padding:'26px 40px',boxShadow:`0 12px 0 #0B0B0E, 0 0 ${50*hi}px ${c}`}}>
    <Phone w={110} c={c} glow={hi}/>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:84,color:'#fff',lineHeight:1}}>{n}</div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:c,lineHeight:1}}>{label}</div>
  </div>);};

const Hook = () => {
  const f=useCurrentFrame();
  const hl=win(f,T(2.66,0),T(3.9,0),4), hr=win(f,T(3.94,0),T(5.2,0),4);
  return (<Cam keys={[[0,1.1,50,45],[30,1,50,45],[T(2.66,0),1.04,45,45],[T(3.94,0),1.04,55,45],[T(5.24,0),1,50,45],[183,1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:10}}>
      <div style={{transform:`perspective(1400px) rotateX(${14-14*ease(f,0,20)}deg) scale(${1.15-0.15*ease(f,0,30)})`}}><Title size={190} color={C.orange}>which hand</Title></div>
      <Title size={96} delay={T(0.9,0)}>is holding your <span style={{color:C.yellow}}>phone?</span></Title>
      <div style={{display:'flex',gap:60,marginTop:40}}>
        <HandCard at={4} n="1" label="LEFT" c={C.blue} hi={hl}/>
        <HandCard at={8} n="2" label="RIGHT" c={C.red} hi={hr}/>
      </div>
    </AbsoluteFill>
    <Abs x={0} y={1060} w={1080} style={{display:'flex',justifyContent:'center',alignItems:'flex-end',gap:24}}>
      <NameTag at={T(2.0,0)}/><StickDoc pose="think" mood="smile" size={250} delay={T(1.8,0)}/>
      <div style={{marginBottom:60}}><Pill at={T(5.2,0)} bg={C.yellow} size={56}>keep that answer</Pill></div>
    </Abs>
  </Cam>);
};

const LA = () => {
  const f=useCurrentFrame(); const st=6.1; const dist=9;
  const sw=T(11.15,st); const a=f<sw, b=f>=sw-6;
  const cutP=ease(f,T(16.0,st),T(17.0,st));
  return (<Cam keys={[[0,1.06,50,45],[T(9.4,st),1.1,50,45],[T(9.4,st)+8,1,50,45],[sw-6,1.05,50,45],[sw,1,50,45],[T(15.1,st),1.08,50,55],[T(15.1,st)+8,1,50,45],[T(16.0,st),1.0,50,45],[T(16.4,st),1.1,50,40],[336,1.04,50,45]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40,opacity:1-ease(f,sw-6,sw)}}>
      <Title size={130}>Los Angeles, <span style={{color:C.orange}}>1962</span></Title>
      <Row at={T(8.48,st)} c={C.blue}>a war veteran (WWII paratrooper)</Row>
      <div style={{marginTop:30}}><Stamp at={T(9.4,st)} size={150}>SEIZURES</Stamp></div>
      <Chip at={T(10.08,st)} c={C.card} size={72}>that nothing could stop</Chip>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{opacity:ease(f,sw-6,sw+2)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:210,gap:4}}>
        <Title size={90} delay={sw}>the bridge between</Title>
        <Title size={110} color={C.orange} delay={sw+4}>the two halves</Title>
      </AbsoluteFill>
      <Abs x={40} y={430} show={1-win(f,T(13.8,st),T(16.0,st),6)}><Split3D width={1000} height={720} bridge={ease(f,sw,sw+20)} cut={cutP} pulse={f/30} dist={dist}/></Abs>
      {f>=T(13.7,st) && f<T(16.0,st) && <Abs x={150} y={420} show={win(f,T(13.8,st),T(16.0,st),6)}><Photo src="gray_sagittal.jpg" w={780} h={600} at={T(13.8,st)} rot={-1.5} label="the real corpus callosum" credit="Gray’s Anatomy, 1918 · public domain" pos="50% 40%"/></Abs>}
      <Abs x={0} y={500} w={1080} style={{display:'flex',justifyContent:'space-between',padding:'0 70px',boxSizing:'border-box'}}>
        <div style={{opacity:1-win(f,T(13.8,st),T(16.0,st),6)}}><Label size={44} delay={sw+8} color={C.text}>LEFT half</Label></div><div style={{opacity:1-win(f,T(13.8,st),T(16.0,st),6)}}><Label size={44} delay={sw+8} color={C.text}>RIGHT half</Label></div>
      </Abs>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1110}}>
        {f<T(16.0,st) ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
          <Pill at={T(13.9,st)} bg={C.yellow} size={60}>CORPUS CALLOSUM</Pill>
          <Flip at={T(15.1,st)}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:74,color:'#fff',background:C.card,border:`4px solid ${C.orange}`,borderRadius:18,padding:'6px 30px'}}>~200 MILLION nerve fibers</div></Flip>
        </div> : <Stamp at={T(16.1,st)} size={140}>CUT</Stamp>}
      </AbsoluteFill>
    </AbsoluteFill>}
  </Cam>);
};

const Normal = () => {
  const f=useCurrentFrame(); const st=17.3;
  return (<Cam keys={[[0,1.05,50,45],[T(20.48,st),1.1,50,45],[T(20.48,st)+8,1,50,45],[123,1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:36}}>
      <Title size={110}>after the surgery</Title>
      <div style={{display:'flex',flexDirection:'column',gap:24,width:860}}>
        <Row at={T(17.5,st)} c={C.green}>seizures: calmed down</Row>
        <Row at={T(19.1,st)} c={C.blue}>everyday life: talking, walking</Row>
      </div>
      <Stamp at={T(20.45,st)} size={120} c={C.yellow}>TOTALLY NORMAL?</Stamp>
      <div style={{display:'flex',alignItems:'flex-end',gap:20}}>
        <Photo src="gray_above.jpg" w={360} h={360} at={T(17.7,st)} rot={-3} label="seen from above" credit="Gray’s Anatomy, 1918 · public domain" pos="50% 45%"/>
        <StickDoc pose="shrug" mood="smile" size={240} delay={T(17.6,st)}/>
      </div>
    </AbsoluteFill>
  </Cam>);
};

const Test = () => {
  const f=useCurrentFrame(); const st=21.4;
  const flash=f>=T(24.15,st) && f<T(26.0,st) ? (Math.floor((f-T(24.15,st))/5)%2===0?1:0.25) : (f>=T(26.0,st)?1:0);
  const arrow=ease(f,T(25.94,st),T(26.5,st));
  return (<Cam keys={[[0,1.05,50,45],[T(23.82,st),1.0,50,40],[T(26.04,st),1.06,55,50],[T(27.38,st),1.06,55,55],[T(27.38,st)+8,1.0,50,50],[T(28.66,st),1.1,35,60],[T(28.66,st)+10,1,50,50],[280,1.04,50,50]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:10}}>
      <Pill at={T(22.8,st)} bg={C.orange} color="#fff" size={62}>Michael Gazzaniga</Pill>
      <Label size={38} delay={T(22.9,st)} color={C.text}>young scientist in Roger Sperry’s lab · Caltech</Label>
    </AbsoluteFill>
    {f<T(24.0,st) && <AbsoluteFill style={{alignItems:'center',paddingTop:400,opacity:1-ease(f,T(23.5,st),T(23.9,st))}}>
      <Photo src="gazzaniga.jpg" w={560} h={640} at={T(21.55,st)} rot={2} label="Michael Gazzaniga, today" credit="photo via Wikipedia · used for education" pos="50% 30%"/>
    </AbsoluteFill>}
    {/* the screen: look at the dot, picture flashed on the LEFT side only */}
    <Abs x={160} y={380} w={760} show={ease(f,T(23.8,st),T(24.1,st))}>
      <div style={{height:340,background:'#0C0D11',border:`8px solid ${C.line}`,borderRadius:22,position:'relative',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{position:'absolute',left:'50%',top:'50%',width:22,height:22,marginLeft:-11,marginTop:-11,borderRadius:11,background:'#fff'}}/>
        <div style={{position:'absolute',left:0,right:0,bottom:10,textAlign:'center',fontFamily:HEAD,fontWeight:800,fontSize:30,color:C.mute}}>eyes on the dot</div>
        <div style={{position:'absolute',left:60,top:70,width:200,height:170,borderRadius:14,background:C.yellow,opacity:flash,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:HEAD,fontWeight:900,fontSize:44,color:C.bg}}>PICTURE</div>
      </div>
    </Abs>
    <Abs x={190} y={760} show={ease(f,T(23.8,st),T(24.1,st))}><Split3D width={700} height={500} bridge={1} cut={1} right={ease(f,T(26.04,st),T(26.5,st))} dist={9}/></Abs>
    <svg style={{position:'absolute',left:0,top:0,opacity:arrow}} width={1080} height={1920}>
      <path d="M 320 640 C 420 760, 600 800, 700 940" stroke={C.yellow} strokeWidth={10} fill="none" strokeDasharray="1400" strokeDashoffset={1400*(1-arrow)} strokeLinecap="round"/>
    </svg>
    <Abs x={600} y={760}><Pill at={T(26.04,st)} bg={C.orange} color="#fff" size={44}>to the RIGHT half</Pill></Abs>
    <Abs x={470} y={1160}><Bubble at={T(27.38,st)} size={76}>“I saw NOTHING.”</Bubble></Abs>
    <Abs x={70} y={1170} w={420} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:12}}>
      <Chip at={T(28.66,st)} c={C.blue} size={60}>LEFT HAND</Chip>
      <Pill at={T(29.4,st)} bg={C.green} color="#fff" size={46}>points at the answer</Pill>
    </Abs>
  </Cam>);
};

const Mouth = () => {
  const f=useCurrentFrame(); const st=30.75;
  return (<Cam keys={[[0,1.05,50,45],[T(32.5,st),1.1,50,45],[T(32.5,st)+8,1,50,45],[T(33.72,st),1.0,50,45],[T(34.44,st),1.08,50,55],[162,1.02,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:6}}>
      <Title size={100}>his <span style={{color:C.blue}}>left hand</span> knew</Title>
      <Title size={100} delay={T(32.45,st)}>his <span style={{color:C.red}}>mouth</span> didn’t</Title>
    </AbsoluteFill>
    <Abs x={90} y={470}><Split3D width={900} height={640} bridge={1} cut={1} left={0.8} right={0.8} dist={9}/></Abs>
    <Abs x={60} y={1000}><Pill at={T(31.0,st)} bg={C.blue} color="#fff" size={44} rot={-3}>left half: talks</Pill></Abs>
    <Abs x={600} y={1000}><Pill at={T(31.3,st)} bg={C.orange} color="#fff" size={44} rot={3}>right half: saw it</Pill></Abs>
    <AbsoluteFill style={{alignItems:'center',paddingTop:1130}}>
      <div style={{display:'flex',gap:24,alignItems:'center'}}>
        <Chip at={T(33.9,st)} c={C.card} size={56}>2 roommates · no texting</Chip>
        <Pill at={T(35.2,st)} bg={C.red} color="#fff" size={44} rot={-5}>NOT DELIVERED</Pill>
      </div>
    </AbsoluteFill>
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame(); const st=36.15; const dist=9;
  const t1=T(41.3,st), t2=T(44.6,st), t3=T(47.45,st), t4=T(49.1,st);
  const a=1-ease(f,t1-6,t1), b=ease(f,t1-6,t1)*(1-ease(f,t2-6,t2)), c=ease(f,t2-6,t2)*(1-ease(f,t3-6,t3)), d=ease(f,t3-6,t3)*(1-ease(f,t4-6,t4)), e=ease(f,t4-6,t4);
  const x1=ease(f,T(37.1,st),T(37.8,st)), x2=ease(f,T(37.5,st),T(38.3,st));
  return (<Cam keys={[[0,1.06,50,45],[24,1,50,45],[T(38.32,st),1.08,50,50],[T(38.32,st)+8,1,50,45],[T(39.66,st),1.08,35,40],[T(39.66,st)+8,1,50,45],[t1-6,1.04,50,45],[t1,1,50,45],[t2-6,1.04,50,45],[t2,1,50,45],[t3-6,1.03,50,45],[t3,1,50,45],[t4-6,1.03,50,45],[t4,1,50,45],[480,1.1,50,40]]}>
    {a>0 && <AbsoluteFill style={{opacity:a}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Pill at={2} bg={C.yellow} size={56}>SAVE THIS · exam classic</Pill></AbsoluteFill>
      <Abs x={90} y={300}><Split3D width={900} height={620} bridge={1} left={x2} right={x1} dist={dist}/></Abs>
      <svg style={{position:'absolute',left:0,top:0}} width={1080} height={1920}>
        <path d="M 250 1110 L 760 720" stroke={C.orange} strokeWidth={12} strokeLinecap="round" fill="none" strokeDasharray="700" strokeDashoffset={700*(1-x1)}/>
        <path d="M 830 1110 L 320 720" stroke={C.blue} strokeWidth={12} strokeLinecap="round" fill="none" strokeDasharray="700" strokeDashoffset={700*(1-x2)}/>
      </svg>
      <Abs x={90} y={1110}><Chip at={T(37.1,st)} c={C.orange} size={56}>LEFT HAND</Chip></Abs>
      <Abs x={660} y={1110}><Chip at={T(37.5,st)} c={C.blue} size={56}>RIGHT HAND</Chip></Abs>
      <Abs x={0} y={1230} w={1080} style={{display:'flex',justifyContent:'center'}}><Label size={46} delay={T(38.3,st)} color={C.text}>each hand = the OPPOSITE half</Label></Abs>
      <Abs x={100} y={330}><Pill at={T(39.66,st)} bg={C.yellow} size={56} rot={-4}>SPEECH: usually LEFT</Pill></Abs>
    </AbsoluteFill>}
    {b>0 && <AbsoluteFill style={{alignItems:'center',padding:'260px 60px 0',gap:30,opacity:b}}>
      <div style={{display:'flex',alignItems:'center',gap:30}}><Title size={170} color={C.orange} delay={t1-2}>1981</Title><Chip at={T(41.6,st)} c={C.red} size={90}>NOBEL PRIZE</Chip></div>
      <Photo src="sperry.jpg" w={480} h={540} at={T(41.9,st)} rot={-2} label="Roger Sperry" credit="photo via Wikipedia · used for education" pos="50% 25%"/>
      <Label size={36} delay={T(42.6,st)} color={C.text}>“for his discoveries concerning the functional<br/>specialization of the cerebral hemispheres”</Label>
    </AbsoluteFill>}
    {c>0 && <AbsoluteFill style={{alignItems:'center',padding:'240px 60px 0',gap:30,opacity:c}}>
      <Pill at={t2-4} bg={C.orange} color="#fff" size={54}>BRAIN STORY #6</Pill>
      <Title size={110} delay={t2-2}>your phone is in<br/><span style={{color:C.orange}}>which hand?</span></Title>
      <div style={{display:'flex',gap:60,marginTop:20}}>
        <HandCard at={T(46.4,st)} n="1" label="LEFT" c={C.blue}/>
        <HandCard at={T(46.8,st)} n="2" label="RIGHT" c={C.red}/>
      </div>
      <Label size={48} delay={T(46.9,st)} color={C.yellow}>I’ll post my answer tonight</Label>
    </AbsoluteFill>}
    {d>0 && <AbsoluteFill style={{alignItems:'center',padding:'260px 60px 0',gap:34,opacity:d}}>
      <Title size={100} delay={t3-2}>Send this to your</Title>
      <Chip at={T(48.0,st)} c={C.red} size={96}>LEFT-HANDED FRIEND</Chip>
      <div style={{textAlign:'center',marginTop:40}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.text}}>Source: Gazzaniga MS, Bogen JE, Sperry RW. Some functional effects of sectioning the cerebral commissures in man. PNAS 1962;48(10):1765–1769, doi:10.1073/pnas.48.10.1765</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.mute,marginTop:8}}>Wolman, Nature 2012 · Shen, PNAS 2014 · nobelprize.org · Photos: Gray’s Anatomy 1918 (public domain); Gazzaniga and Sperry via Wikipedia, used for education</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.yellow,marginTop:8}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>}
    {e>0 && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:20,opacity:e}}>
      <Flip at={t4}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={t4+4}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={320} delay={t4+6}/>
      <div style={{opacity:ease(f,t4+12,t4+20),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:52,padding:'14px 36px',borderRadius:14}}>FOLLOW FOR STORY #7 · #NeuroMot</div>
    </AbsoluteFill>}
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, la:LA, normal:Normal, test:Test, mouth:Mouth, end:End};

const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = ([
  [0.0,2.2,'Quick… which hand is holding your *PHONE* right now?'],[2.66,3.7,'*1* = left.'],[3.94,4.9,'*2* = right.'],[5.24,5.9,'Keep that answer.'],
  [6.24,8.1,'*Los Angeles*, *1962*.'],[8.48,10.9,'A war veteran had *seizures* that nothing could *STOP*.'],[11.18,13.66,'So surgeons cut the *bridge* between his two brain halves…'],[13.88,14.82,'the *corpus callosum*.'],[15.1,17.2,'About *200 MILLION* nerve fibers.'],
  [17.44,18.5,'The seizures *calmed down*.'],[18.86,21.16,'And in everyday life… he seemed totally *NORMAL*.'],
  [21.52,23.66,'Then a young scientist, *Michael Gazzaniga*,'],[23.82,25.68,'flashed pictures to *ONE half* at a time.'],[25.94,26.5,'The *right half*?'],[26.8,28.1,'He said, “I saw *NOTHING*.”'],[28.38,30.6,'But his *left hand*… pointed at the answer anyway.'],
  [30.88,32.3,'His *left hand* knew something…'],[32.5,33.4,'his *MOUTH* didn’t.'],[33.72,35.9,'Basically two *roommates* who stopped *texting* each other.'],
  [36.28,36.76,'*Save* this:'],[37.1,39.26,'each hand is run by the *OPPOSITE* brain half,'],[39.44,41.08,'and *speech* usually lives on the *left*.'],[41.32,44.34,'This work won *Roger Sperry* the *1981 NOBEL* Prize.'],
  [44.66,46.06,'So… which hand has your *phone*?'],[46.42,47.12,'*1* or *2*.'],[47.5,48.84,'Send this to your *left-handed* friend.'],[49.14,51.3,'*Dr. Mot*, one brain story at a time.'],
] as [number,number,string][]);
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #6</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE STORY · 1962</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
