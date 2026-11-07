import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import * as THREE from 'three';
import {Hippo3D, HIPPO_L, HIPPO_R, projectHippo, hippoAngle} from './Hippo3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice take 1 (2026-11-07, atempo 1.1) — scene starts 0, 13.24, 24.78, 33.8, 48.63 s ; voice ends 54.8 s
const scenes = [
  {id:'hook', d:13.24},{id:'meet', d:11.54},{id:'mirror', d:9.02},{id:'answer', d:14.83},{id:'end', d:6.5},
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

// ---------- scenes (Brain Story #1 — patient H.M., Scoville & Milner 1957) ----------
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Chip: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=64}) => {const s=useSpring(at); return (
  <div style={{transform:`perspective(1000px) rotateX(${(1-s)*80}deg)`,opacity:s>0.02?1:0,background:c,borderRadius:18,padding:'12px 34px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 10px 0 #0B0B0E',whiteSpace:'nowrap'}}>{children}</div>);};
const Pill: React.FC<{at:number; children:React.ReactNode; bg?:string; color?:string; size?:number; rot?:number}> = ({at,children,bg=C.yellow,color=C.bg,size=52,rot=0}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{opacity:p,transform:`scale(${0.6+0.4*p}) rotate(${rot}deg)`,background:bg,color,fontFamily:HEAD,fontWeight:900,fontSize:size,padding:'6px 26px',borderRadius:14,display:'inline-block',boxShadow:'0 8px 0 #0B0B0E',whiteSpace:'nowrap'}}>{children}</div>);};
const HTag: React.FC<{p:THREE.Vector3; ang:number; dist:number; w:number; h:number; ox:number; oy:number; text:string; o:number; lx:number; ly:number; color?:string}> = ({p,ang,dist,w,h,ox,oy,text,o,lx,ly,color='rgba(235,240,248,0.94)'}) => {
  if(o<=0) return null; const q=projectHippo(p,ang,dist,w,h); const x=ox+q.x, y=oy+q.y;
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
const Photo: React.FC<{src:string; w:number; h:number; at:number; rot?:number; label?:string; credit?:string; pos?:string}> = ({src,w,h,at,rot=0,label,credit,pos='center'}) => {
  const f=useCurrentFrame(); const p=ease(f,at,at+12); const z=1.04+0.06*ease(f,at,at+90);
  return (<div style={{opacity:p,transform:`perspective(1400px) translateY(${(1-p)*120}px) rotateX(${(1-p)*40}deg) rotate(${rot*p}deg)`,background:'#f4f1ea',padding:'16px 16px 0',borderRadius:6,boxShadow:'0 30px 70px rgba(0,0,0,.6)',width:w}}>
    <div style={{width:w-32,height:h,overflow:'hidden',borderRadius:3,background:'#222'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:pos,transform:`scale(${z})`}}/></div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:44,color:'#1A1B20',textAlign:'center',padding:'10px 0 2px'}}>{label}</div>
    <div style={{fontFamily:BODY,fontWeight:600,fontSize:18,color:'#6b6b6b',textAlign:'center',paddingBottom:10}}>{credit}</div>
  </div>);
};

const Hook = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=hippoAngle(f,fps,0.6,false), dist=8.5;
  const brain=f>=46&&f<214;
  return (<Cam keys={[[0,1.1,50,45],[44,1,50,45],[50,1,50,45],[180,1.06,50,45],[186,1,50,45],[270,1.05,50,50],[276,1,50,50],[397,1.06,50,50]]}>
    {f<52 && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:30,opacity:1-ease(f,46,52)}}>
      <div style={{transform:`perspective(1400px) rotateX(${14-14*ease(f,0,20)}deg) scale(${1.15-0.15*ease(f,0,30)})`}}><Title size={330} color={C.orange}>1953</Title></div>
      <Pill at={6} bg={C.red} color="#fff" size={60}>BRAIN SURGERY · AGE 27</Pill>
    </AbsoluteFill>}
    {brain && <AbsoluteFill style={{opacity:ease(f,46,54)*(1-ease(f,208,214))}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200}}><Title size={92} delay={48}>Surgeons removed<br/><span style={{color:C.orange}}>part of his brain</span></Title></AbsoluteFill>
      {f<116 && <><Abs x={50} y={500} show={1-ease(f,106,116)}><Photo src="hartford.jpg" w={700} h={450} at={48} rot={-4} label="Hartford Hospital, USA" credit="Tichnor Bros. postcard · public domain · Wikimedia Commons"/></Abs>
      <Abs x={560} y={860} show={1-ease(f,106,116)}><Photo src="scoville.jpg" w={440} h={520} at={62} rot={5} label="Dr. William Scoville" credit="his surgeon · public domain · Wikimedia Commons" pos="50% 20%"/></Abs></>}
      <Abs x={40} y={520} show={ease(f,104,116)}><Hippo3D width={1000} height={900} glow={0.4+0.6*ease(f,90,120)} gone={0} orbit={0.6} sway={false} dist={dist}/></Abs>
      <HTag p={HIPPO_L} ang={ang} dist={dist} w={1000} h={900} ox={40} oy={520} text="but WHICH part?" o={ease(f,110,120)} lx={620} ly={1300} color={C.yellow}/>
      <Abs x={70} y={1280} style={{whiteSpace:'nowrap'}}><Pill at={130} bg={C.card} color="#fff" size={50}>goal: stop his seizures ⚡</Pill></Abs>
      {f>=186 && <AbsoluteFill style={{alignItems:'center',paddingTop:470}}><Chip at={188} c={C.green} size={96}>IT WORKED ✅</Chip></AbsoluteFill>}
    </AbsoluteFill>}
    {f>=210 && f<282 && <AbsoluteFill style={{alignItems:'center',paddingTop:330,gap:30,opacity:ease(f,210,216)*(1-ease(f,276,282))}}>
      <Title size={190} color={C.red} delay={212}>But…</Title>
      <Title size={84} delay={224}>it cost him something <span style={{color:C.yellow}}>strange</span></Title>
      <StickDoc pose="facepalm" from="stand" mood="worried" size={330} sweat delay={214}/>
    </AbsoluteFill>}
    {f>=276 && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:34}}>
      <Title size={104} delay={278}>Which part did<br/>they <span style={{color:C.orange}}>take?</span></Title>
      <Flip at={290}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 44px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:84,color:C.yellow}}>COMMENT 1 OR 2 👇</div>
        <div style={{display:'flex',gap:24,justifyContent:'center',marginTop:16}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',background:C.red,padding:'6px 26px',borderRadius:14}}>1 = hippocampus</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',background:C.blue,padding:'6px 26px',borderRadius:14}}>2 = frontal lobe</div>
        </div>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:50,color:C.text,marginTop:14}}>answer at the end</div>
      </div></Flip>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={300}/><StickDoc pose="think" mood="smirk" size={270} delay={296}/></div>
    </AbsoluteFill>}
  </Cam>);
};

const Meet = () => {
  const f=useCurrentFrame();
  const n1=f<100, n2=f>=96&&f<200, n3=f>=196;
  const mem=Math.floor(ease(f,110,190)*5);
  return (<Cam keys={[[0,1.06,50,40],[96,1,50,40],[100,1,50,45],[196,1.05,50,45],[200,1,50,50],[346,1.07,50,50]]}>
    {n1 && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:26,opacity:1-ease(f,94,100)}}>
      <Title size={120}>Henry <span style={{color:C.orange}}>Molaison</span></Title>
      <Label size={46}>1926 – 2008</Label>
      <Patient size={330} at={6}/>
      {f>=50 && <div style={{display:'flex',alignItems:'center',gap:24}}>
        <Label size={60} color={C.text} delay={52}>medicine called him</Label>
        <Flip at={60}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:170,color:C.yellow,textShadow:depth('#0B0B0E'),lineHeight:1}}>H.M.</div></Flip>
      </div>}
    </AbsoluteFill>}
    {n2 && <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:34,opacity:ease(f,96,104)*(1-ease(f,194,200))}}>
      <Title size={100} delay={98}>After surgery:<br/><span style={{color:C.red}}>zero</span> new memories</Title>
      <div style={{position:'relative',width:700,height:520}}>
        <div style={{position:'absolute',left:200,top:120,width:300,height:300,borderRadius:150,border:`8px dashed ${C.gray}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:150}}>🧠</div>
        {[0,1,2,3,4].map(i=>{const t0=112+i*16; const p=ease(f,t0,t0+14); const back=ease(f,t0+8,t0+16);
          return <div key={i} style={{position:'absolute',left:-40+p*260-back*320,top:40+i*90,fontSize:70,opacity:p*(1-back*0.9),transform:`rotate(${back*-40}deg)`}}>{['📅','👋','🍽️','📰','🎂'][i]}</div>;})}
      </div>
      <Chip at={118} c={C.card} size={64}>NEW MEMORIES SAVED: <span style={{color:C.red}}>0</span>{mem>=0?'':''}</Chip>
    </AbsoluteFill>}
    {n3 && <AbsoluteFill style={{opacity:ease(f,196,204)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:220}}>
        <div style={{display:'flex',gap:24}}>
          {[{t:'MEET 👋',a:204},{t:'LEAVE 🚪',a:222},{t:'COME BACK',a:240}].map(x=><Pill key={x.t} at={x.a} bg={f>=x.a+18&&x.t!=='COME BACK'?C.card:C.yellow} color={f>=x.a+18&&x.t!=='COME BACK'?'#fff':C.bg} size={64}>{x.t}</Pill>)}
        </div>
      </AbsoluteFill>
      <div style={{position:'absolute',left:110,top:560,transform:`translateX(${f<222?0:f<240?-500*ease(f,222,236):-500+500*ease(f,240,254)}px)`}}><StickDoc pose={f<222?'wave':f<272?'stand':'facepalm'} from="stand" mood={f<272?'smile':'worried'} size={380} delay={f<222?200:f<272?240:272}/></div>
      <div style={{position:'absolute',right:110,top:600}}><Patient size={330} at={200} bubble={f>=268?'Nice to meet you!':f<222?'Hello!':undefined}/></div>
      {f>=300 && <AbsoluteFill style={{alignItems:'center',paddingTop:1150}}>
        <div style={{opacity:ease(f,300,306),transform:`scale(${1.6-0.6*ease(f,300,308)}) rotate(-6deg)`,border:`10px solid ${C.red}`,color:C.red,fontFamily:HEAD,fontWeight:900,fontSize:140,padding:'0 46px',borderRadius:20,background:'rgba(26,27,32,.85)'}}>AGAIN.</div>
      </AbsoluteFill>}
    </AbsoluteFill>}
  </Cam>);
};

const Mirror = () => {
  const f=useCurrentFrame();
  const a=f<140, b=f>=136&&f<190, c=f>=186;
  return (<Cam keys={[[0,1.06,50,40],[60,1,50,45],[136,1.05,50,45],[140,1,50,45],[186,1.04,50,45],[190,1,50,50],[271,1.06,50,50]]}>
    {a && <AbsoluteFill style={{alignItems:'center',paddingTop:210,gap:20,opacity:1-ease(f,134,140)}}>
      <Title size={104}>Brenda <span style={{color:C.orange}}>Milner</span>’s test</Title>
      <Label size={42}>Montreal Neurological Institute</Label>
      <div style={{position:'relative',width:820,height:820,marginTop:30}}>
        <div style={{position:'absolute',inset:0,borderRadius:30,background:'linear-gradient(135deg,#3b4a5e,#1f2733 60%,#4a5b70)',border:'14px solid #8a93a3',boxShadow:'0 30px 80px rgba(0,0,0,.6)',opacity:ease(f,58,70)}}/>
        <div style={{position:'absolute',left:60,top:40,transform:'scaleX(-1)',opacity:ease(f,60,72)}}><StarTrace size={700} skill={0} draw={ease(f,70,132)} seed="d1"/></div>
        {f<70 && <Abs x={150} y={-20} show={1-ease(f,58,68)}><Photo src="milner.jpg" w={520} h={620} at={2} rot={-3} label="Brenda Milner (in 2014)" credit="photo: Per Henning/NTNU · CC BY 2.0 · Wikimedia Commons" pos="50% 15%"/></Abs>}
        <Abs x={40} y={-10}><Pill at={64} bg={C.yellow} size={54}>🪞 trace a star · MIRROR ONLY</Pill></Abs>
      </div>
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:30,opacity:ease(f,136,142)*(1-ease(f,184,190))}}>
      <Title size={110} delay={137}>Every day: <span style={{color:C.green}}>better</span></Title>
      <div style={{display:'flex',gap:20}}>
        {[{d:'DAY 1',s:0,at:140},{d:'DAY 2',s:0.55,at:150},{d:'DAY 3',s:0.92,at:160}].map(x=>(<Flip key={x.d} at={x.at} axis="Y"><div style={{width:320,background:C.card,borderRadius:24,padding:'18px 0',display:'flex',flexDirection:'column',alignItems:'center',boxShadow:'0 12px 0 #0B0B0E'}}>
          <StarTrace size={280} skill={x.s} draw={ease(f,x.at,x.at+20)} seed={x.d} color={x.s>0.8?C.green:x.s>0.3?C.yellow:C.red}/>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:60,color:C.text}}>{x.d}</div></div></Flip>))}
      </div>
      <Chip at={168} c={C.green} size={64}>MISTAKES ↓ ↓ ↓</Chip>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:250,gap:40,opacity:ease(f,186,194)}}>
      <Title size={96} delay={188}>…but every day he said</Title>
      <div style={{display:'flex',alignItems:'flex-end',gap:30}}>
        <Patient size={300} at={190}/>
        <Flip at={198}><div style={{background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:86,padding:'20px 40px',borderRadius:34,boxShadow:'0 12px 0 #0B0B0E',marginBottom:220,lineHeight:1}}>“I’ve <span style={{color:C.red}}>NEVER</span><br/>done this.”</div></Flip>
      </div>
      <div style={{display:'flex',gap:24}}><Chip at={222} c={C.green} size={56}>SKILL ✓ kept</Chip><Chip at={232} c={C.red} size={56}>MEMORY OF IT ✗</Chip></div>
    </AbsoluteFill>}
  </Cam>);
};

const Slices: React.FC<{p:number}> = ({p}) => {
  const n=18; return (<div style={{position:'relative',width:900,height:520,perspective:1400}}>
    {Array.from({length:n},(_,i)=>{const k=i-(n-1)/2; return <div key={i} style={{position:'absolute',left:300+k*p*44,top:60,width:300,height:380,borderRadius:'48% 52% 44% 56%',
      background:`radial-gradient(circle at 50% 45%, #f0d6cf 0%, #d9a9a0 55%, #a96e66 100%)`,border:'3px solid #5a2c28',opacity:0.95,
      transform:`rotateY(${-55*p}deg) translateZ(${k*4}px)`,boxShadow:'0 10px 20px rgba(0,0,0,.35)'}}/>;})}
  </div>);
};
const Answer = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ang=hippoAngle(f,fps,0.6,false), dist=8.5;
  const a=f<220, b=f>=214&&f<274, c=f>=268&&f<376, d=f>=372;
  const count=Math.round(2401*ease(f,300,360));
  return (<Cam keys={[[0,1.08,50,45],[30,1,50,45],[214,1.05,50,45],[220,1,50,45],[268,1.05,50,45],[274,1,50,45],[372,1.05,50,45],[378,1,50,45],[445,1.08,50,45]]}>
    {a && <AbsoluteFill style={{opacity:1-ease(f,214,220)}}>
      <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:14}}>
        <Title size={96}>The answer: <span style={{color:C.red}}>1</span></Title>
        <Title size={120} color={C.orange} delay={20}>Hippocampus</Title>
      </AbsoluteFill>
      <Abs x={40} y={470}><Hippo3D width={1000} height={900} glow={1} gone={ease(f,150,200)} orbit={0.6} sway={false} dist={dist}/></Abs>
      <HTag p={HIPPO_L} ang={ang} dist={dist} w={1000} h={900} ox={40} oy={470} text="left" o={ease(f,40,50)*(1-ease(f,150,160))} lx={720} ly={1260} color="#ffc9cf"/>
      <HTag p={HIPPO_R} ang={ang} dist={dist} w={1000} h={900} ox={40} oy={470} text="right" o={ease(f,50,60)*(1-ease(f,150,160))} lx={80} ly={1260} color="#ffc9cf"/>
      <AbsoluteFill style={{alignItems:'center',paddingTop:1380,opacity:1-ease(f,84,90)}}><Pill at={60} bg={C.card} color="#fff" size={50}>BOTH sides removed (+ nearby tissue)</Pill></AbsoluteFill>
      {f>=88 && <AbsoluteFill style={{alignItems:'center',paddingTop:1380,opacity:ease(f,88,96)}}><div style={{display:'flex',gap:24}}>
        <Chip at={90} c={C.red} size={56}>WHAT HAPPENED ✗</Chip><Chip at={140} c={C.green} size={56}>HOW TO DO IT ✓</Chip></div></AbsoluteFill>}
    </AbsoluteFill>}
    {b && <AbsoluteFill style={{alignItems:'center',paddingTop:380,gap:40,opacity:ease(f,214,222)*(1-ease(f,268,274))}}>
      <Title size={130} delay={216}>Different<br/><span style={{color:C.yellow}}>brain systems</span></Title>
      <div style={{display:'flex',gap:30}}>
        <Flip at={226} axis="Y"><div style={{width:400,height:300,background:C.red,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #0B0B0E'}}><div style={{fontSize:110}}>📼</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:52,color:'#fff'}}>remembering</div></div></Flip>
        <Flip at={236} axis="Y"><div style={{width:400,height:300,background:C.green,borderRadius:28,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 0 #0B0B0E'}}><div style={{fontSize:110}}>🚲</div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:52,color:'#fff'}}>learning skills</div></div></Flip>
      </div>
    </AbsoluteFill>}
    {c && <AbsoluteFill style={{alignItems:'center',paddingTop:240,gap:20,opacity:ease(f,268,276)*(1-ease(f,370,376))}}>
      <Title size={110} delay={270}>He died in <span style={{color:C.orange}}>2008</span></Title>
      <Label size={52} color={C.text} delay={290}>his brain was cut into</Label>
      <Slices p={ease(f,296,350)}/>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:200,color:C.yellow,textShadow:depth('#0B0B0E'),lineHeight:1,opacity:ease(f,298,304)}}>{count.toLocaleString('en-US')}</div>
      <Label size={60} color={C.text} delay={304}>SLICES</Label>
    </AbsoluteFill>}
    {d && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:30,opacity:ease(f,372,380)}}>
      <Label size={60} color={C.text} delay={374}>and the world finally learned his name</Label>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,color:C.text,textAlign:'center',lineHeight:0.95,textShadow:`0 0 ${40*ease(f,380,410)}px rgba(255,210,63,.8), ${depth('#0B0B0E')}`,opacity:ease(f,380,392),transform:`scale(${0.85+0.15*ease(f,380,400)})`}}>HENRY<br/><span style={{color:C.yellow}}>MOLAISON</span></div>
      <Patient size={300} at={384}/>
    </AbsoluteFill>}
  </Cam>);
};

const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,62,68), b=ease(f,66,72)*(1-ease(f,136,142)), c=ease(f,140,146);
  return (<Cam keys={[[0,1.06,50,40],[20,1,50,45],[62,1.04,50,45],[68,1,50,50],[136,1.06,50,45],[142,1,50,50],[195,1.1,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',padding:'230px 60px 0',gap:30,opacity:a}}>
      <Pill at={0} bg={C.orange} color="#fff" size={54}>BRAIN STORY #1</Pill>
      <Title size={110} delay={2}>Did you <span style={{color:C.orange}}>get it?</span></Title>
      <Flip at={8}><div style={{background:C.card,borderRadius:28,padding:'26px 40px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{display:'flex',gap:26,justifyContent:'center'}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:'#fff',background:C.green,padding:'6px 26px',borderRadius:14,transform:'scale(1.1)'}}>1 = hippocampus ✓</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:'#fff',background:C.line,padding:'6px 26px',borderRadius:14}}>2 ✗</div>
        </div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:C.yellow,marginTop:16}}>comment 1 or 2 · I reply to every answer</div>
      </div></Flip>
      <StickDoc pose="point" mood="smile" size={300} delay={4}/>
      <div style={{textAlign:'center',opacity:ease(f,10,20)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.text}}>Scoville WB, Milner B. J Neurol Neurosurg Psychiatry 1957 · doi:10.1136/jnnp.20.1.11</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.mute,marginTop:6}}>Photos: Wikimedia Commons (public domain; B. Milner by Per Henning/NTNU, CC BY 2.0). H.M. photo (1953): courtesy of Suzanne Corkin / MIT, used for education.</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.mute,marginTop:8}}>Simplified: the surgery also took nearby medial temporal tissue</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:25,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={66}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={70}>one brain story at a time</Label>
      <StickDoc pose="wave" mood="smile" size={340} delay={66}/>
      <div style={{opacity:ease(f,74,82),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:54,padding:'14px 38px',borderRadius:14}}>FOLLOW FOR STORY #2 · #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={140}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={142}/></div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {hook:Hook, meet:Meet, mirror:Mirror, answer:Answer, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.05,1.45,'*1953*.'],[1.86,3.9,'Surgeons removed part of a *27-year-old’s* brain…'],[4.1,5.9,'to stop his *seizures*.'],[6.28,6.75,'It *worked*.'],
  [7.22,8.87,'But it cost him something *STRANGE*.'],[9.33,10.34,'Which part did they *take*?'],[10.69,11.58,'*1* or *2*…'],[12.03,12.69,'answer at the end.'],
  [13.24,14.72,'His name was *Henry Molaison*.'],[15.04,16.42,'Medicine called him *H.M.*'],[16.87,19.63,'After surgery he could not form *ONE* new memory.'],
  [20.04,22.0,'Meet him, leave the room, come back…'],[22.31,23.63,'and he meets you for the *first time*.'],[23.96,24.29,'*Again*.'],
  [24.78,26.69,'Then *Brenda Milner* gave him a test:'],[27.0,29.23,'trace a star… looking only in a *MIRROR*.'],[29.6,30.76,'Every day he got *better*.'],
  [31.09,33.37,'And every day he said he had *NEVER* done it before.'],
  [33.8,34.27,'The answer:'],[34.64,36.4,'the *HIPPOCAMPUS*, on both sides.'],[36.75,38.7,'Remembering *what happened*…'],[38.9,40.89,'and learning *how to do* something…'],
  [41.31,42.63,'use *different* brain systems.'],[42.89,44.5,'When he died in *2008*,'],[44.6,46.13,'his brain was cut into *2,401* slices…'],[46.46,48.19,'and the world finally learned his *name*.'],
  [48.63,49.76,'So… *1* or *2*,'],[50.03,50.42,'did you get it?'],[50.83,53.02,'*Dr. Mot*, one brain story at a time…'],[53.34,54.8,'because the real question is…'],
];
const Captions: React.FC = () => {
  const f=useCurrentFrame(); const t=f/S; const {fps}=useVideoConfig();
  const i=CAPS.findIndex(([a,b])=>t>=a-0.05&&t<=b+0.25); if(i<0) return null;
  const [a,b,txt]=CAPS[i]; const words=txt.split(' ');
  const shown=Math.max(1,Math.ceil(words.length*Math.min(1,(t-a)/Math.max(0.3,(b-a)*0.85))));
  const pop=spring({frame:f-Math.round(a*S),fps,config:{damping:11,mass:0.5}});
  return (<div style={{position:'absolute',left:60,right:60,top:1530,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 18px',transform:`scale(${0.85+0.15*pop})`}}>
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #1</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1953</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
