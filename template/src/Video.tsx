import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';
import {Vessel3D} from './Vessel3D';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12; // 0.4 s cover frame first
// voice v3 take 2 — scene starts 0, 5.06, 15.63, 23.72, 30.02, 42.42 s ; voice ends 52.61 s
const scenes = [
  {id:'hook', d:5.06},{id:'study', d:10.57},{id:'score', d:8.09},{id:'small', d:6.30},
  {id:'catch', d:12.40},{id:'end', d:10.49},
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
    <div style={{position:'absolute',right:10,bottom:-34,fontFamily:BODY,fontWeight:600,fontSize:20,color:C.mute}}>JAMA Netw Open 2025 · CC BY</div>
  </div>);
};
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};

// ---------- scenes ----------
const Hook = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1,50,45],[120,1.12,50,45],[152,1.18,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260}}>
      <div style={{transform:`perspective(1400px) rotateX(${12-12*ease(f,0,20)}deg) rotateY(${Math.sin(f/30)*6}deg)`}}>
        <Title size={190}>Will it <span style={{color:C.orange}}>burst?</span></Title>
      </div>
    </AbsoluteFill>
    <Abs x={0} y={560}><Vessel3D width={1080} height={860} bulge={1+0.25*ease(f,60,140)} orbit={1.2} zoom={0.82+0.12*ease(f,0,150)}/></Abs>
    <Abs x={40} y={1040}><div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><NameTag at={10}/><StickDoc pose="think" mood="worried" size={300} sweat/></div></Abs>
    <Abs x={640} y={1180} show={ease(f,70,80)}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:C.yellow,textShadow:depth('#5a4300')}}>tick… tick…</div></Abs>
  </Cam>);
};
const Insta: React.FC<{p:number}> = ({p}) => {
  const posts=[{mm:'2 mm',r:10},{mm:'3 mm',r:14},{mm:'4 mm',r:19},{mm:'5 mm',r:25},{mm:'6 mm',r:31},{mm:'7 mm',r:38}];
  return (<div style={{width:420,height:780,background:'#0E0F12',border:'10px solid #3A3C45',borderRadius:56,padding:'40px 24px',transform:`perspective(1500px) rotateY(${(1-p)*-50+12}deg) scale(${0.7+0.3*p})`,opacity:p>0?1:0,boxShadow:'30px 40px 80px rgba(0,0,0,.6)'}}>
    <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
      <div style={{width:80,height:80,borderRadius:40,background:C.orange,border:'4px solid #fff'}}/>
      <div><div style={{fontFamily:HEAD,fontWeight:900,fontSize:38,color:C.text}}>@my.aneurysm</div><div style={{fontFamily:HEAD,fontWeight:700,fontSize:26,color:C.mute}}>growth journey 📈</div></div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
      {posts.map((q,i)=>(<div key={i} style={{height:180,background:C.card,borderRadius:12,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:p>i/6?1:0}}>
        <svg width={90} height={90}><circle cx={45} cy={45} r={q.r} fill={C.orange}/></svg>
        <div style={{fontFamily:HEAD,fontWeight:800,fontSize:28,color:C.text}}>{q.mm} · ♥ {12*(i+1)}</div>
      </div>))}
    </div>
  </div>);
};
const Hospital: React.FC<{d:number}> = ({d}) => {const s=useSpring(d); return (
  <svg width={220} height={220} viewBox="0 0 100 100" style={{transform:`perspective(800px) rotateY(${(1-s)*120}deg) scale(${0.5+0.5*s})`,opacity:s>0.02?1:0}}>
    <rect x={15} y={30} width={70} height={60} fill={C.card} stroke={C.text} strokeWidth={4}/>
    <rect x={40} y={15} width={20} height={20} fill={C.red}/><path d="M50 18 V32 M43 25 H57" stroke="#fff" strokeWidth={4}/>
    {[0,1,2].map(i=><rect key={i} x={22+i*22} y={45} width={12} height={12} fill={C.yellow}/>)}
    <rect x={43} y={68} width={14} height={22} fill={C.bg}/>
  </svg>);};
const Study = () => {
  const f=useCurrentFrame();
  const pageOut=1-ease(f,110,118);
  const ig=ease(f,118,128), hosp=f>=240;
  return (<Cam keys={[[0,1,50,30],[12,1.12,50,18],[50,1.12,50,18],[66,1,50,40],[112,1.04,50,40],[118,1,50,50],[150,1.15,30,40],[230,1.15,30,40],[240,1,50,50],[317,1.06,50,55]]}>
    <Abs x={70} y={230} show={pageOut}>
      <Page src="page1pad.png" srcW={1635} w={940} inAt={0} boxes={[{x:30,y:52,w:1390,h:148,at:10},{x:30,y:228,w:1050,h:52,at:24,note:'this team',nx:640,ny:290}]}/>
    </Abs>
    <Abs x={0} y={940} w={1080} show={pageOut}><div style={{display:'flex',justifyContent:'center'}}><Flip at={58}><div style={{background:C.red,borderRadius:20,padding:'16px 36px',fontFamily:HEAD,fontWeight:900,fontSize:84,color:'#fff',boxShadow:'0 10px 0 #7a1420'}}>3,312 ANEURYSMS → AI</div></Flip></div></Abs>
    <Abs x={680} y={1060} show={pageOut*ease(f,60,70)}><StickDoc pose="point" mood="smile" size={280} delay={60} flip/></Abs>
    {/* Instagram-history joke */}
    <Abs x={80} y={230} show={hosp?0:ig}><Insta p={ease(f,120,200)}/></Abs>
    <Abs x={560} y={760} show={hosp?0:ig}><StickDoc pose="point" mood="smirk" size={400} delay={118} flip/></Abs>
    <Abs x={540} y={330} show={hosp?0:ease(f,128,138)} w={480}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:68,color:C.text,lineHeight:1,textShadow:depth('#0B0B0E')}}>size · shape · <span style={{color:C.orange}}>growth</span></div></Abs>
    {hosp && <AbsoluteFill style={{alignItems:'center',paddingTop:330,gap:40}}>
      <Title size={110} delay={242}>Tested at <span style={{color:C.orange}}>3 other</span> hospitals</Title>
      <div style={{display:'flex',gap:30}}><Hospital d={248}/><Hospital d={256}/><Hospital d={264}/></div>
      <Label delay={272} size={50}>1,501 aneurysms it had never seen</Label>
    </AbsoluteFill>}
  </Cam>);
};
const Gauge: React.FC<{v:number}> = ({v}) => {
  const ang=Math.PI*(1-(v-0.5)/0.5); const x=300+230*Math.cos(ang), y=300-230*Math.sin(ang);
  return (<svg width={600} height={360} viewBox="0 0 600 360">
    <path d="M70 300 A230 230 0 0 1 530 300" fill="none" stroke={C.line} strokeWidth={40}/>
    <path d={`M70 300 A230 230 0 0 1 ${x} ${y}`} fill="none" stroke={C.orange} strokeWidth={40}/>
    <line x1={300} y1={300} x2={300+170*Math.cos(ang)} y2={300-170*Math.sin(ang)} stroke={C.text} strokeWidth={10} strokeLinecap="round"/>
    <circle cx={300} cy={300} r={16} fill={C.text}/>
    <text x={60} y={350} fontFamily={HEAD} fontWeight={800} fontSize={34} fill={C.mute}>0.5 = 🪙 coin flip</text>
    <text x={540} y={350} textAnchor="end" fontFamily={HEAD} fontWeight={800} fontSize={34} fill={C.green}>1 = perfect</text>
  </svg>);
};
const Score = () => {
  const f=useCurrentFrame();
  const pageShow=1-ease(f,64,72);
  return (<Cam keys={[[0,1,50,30],[14,1.3,76,38],[56,1.3,76,38],[66,1,50,50],[160,1.04,50,45],[170,1,50,50],[243,1.1,50,45]]}>
    <Abs x={40} y={300} show={pageShow}><Page src="page2hd.png" srcW={1555} w={1000} tilt={-1} boxes={[{x:897,y:624,w:512,h:44,at:8,note:"0.90 in new hospitals",nx:600,ny:690}]}/></Abs>
    <Abs x={80} y={1050} show={pageShow*ease(f,6,14)}><div style={{display:'flex',alignItems:'center',gap:30}}><StickDoc pose="point" mood="surprised" size={300} delay={6}/><div style={{fontFamily:HEAD,fontWeight:900,fontSize:90,color:C.text,textShadow:depth('#0B0B0E')}}>AUROC <span style={{color:C.orange}}>0.90</span></div></div></Abs>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:ease(f,66,72)*(1-ease(f,160,168))}}>
      <Flip at={68}><Title size={280} color={C.orange}>0.90</Title></Flip>
      <Gauge v={0.5+0.40*ease(f,80,140)}/>
      <StickDoc pose="hold" mood="smile" size={260} delay={70}/>
    </AbsoluteFill>
    <Abs x={60} y={640} show={ease(f,168,176)}><StickDoc pose="facepalm" mood="worried" size={360} sweat delay={168}/></Abs>
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,opacity:ease(f,168,174)}}><Title size={120} delay={168}>Better than my<br/><span style={{color:C.red}}>last exam</span></Title></AbsoluteFill>
    <Abs x={470} y={720} show={ease(f,172,180)}><Flip at={172} axis="Y"><div style={{width:420,background:'#F4F1EA',borderRadius:12,padding:'24px 30px',transform:'rotate(4deg)',boxShadow:'0 20px 40px rgba(0,0,0,.5)'}}>
      <div style={{fontFamily:HEAD,fontWeight:800,fontSize:36,color:'#333'}}>NEURO EXAM</div>
      <div style={{height:3,background:'#bbb',margin:'10px 0'}}/>
      {[0,1,2].map(i=><div key={i} style={{height:12,background:'#ddd',margin:'12px 0',width:`${90-i*15}%`}}/>)}
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:120,color:C.red,textAlign:'right',lineHeight:1}}>0.6?!</div>
    </div></Flip></Abs>
  </Cam>);
};
const Small = () => {
  const f=useCurrentFrame();
  const stamp=ease(f,72,80), cross=ease(f,112,122);
  const pageIn=ease(f,126,136);
  return (<Cam keys={[[0,1,50,40],[110,1.05,50,40],[126,1,50,50],[150,1.15,62,40],[189,1.18,62,40]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:34,opacity:1-pageIn}}>
      <Title size={150} delay={1}>The <span style={{color:C.orange}}>small</span> ones</Title>
      <svg width={900} height={300} viewBox="0 0 900 300" style={{transform:`perspective(1200px) rotateX(${20*(1-ease(f,4,30))+8}deg)`}}>
        <rect x={50} y={200} width={800} height={70} rx={8} fill="#E8D9A8"/>
        <rect x={50} y={270} width={800} height={14} rx={4} fill="#B8A878"/>
        {Array.from({length:21},(_,i)=><line key={i} x1={50+i*40} y1={200} x2={50+i*40} y2={i%5===0?250:230} stroke="#333" strokeWidth={4}/>)}
        {[0,5,10,15,20].map(n=><text key={n} x={50+n*40} y={240} dx={8} fontFamily={HEAD} fontWeight={800} fontSize={24} fill="#333">{n}</text>)}
        <rect x={50} y={190} width={400*ease(f,10,40)} height={8} fill={C.orange}/>
        <circle cx={150} cy={120} r={36*ease(f,10,30)} fill={C.orange} stroke="#fff" strokeWidth={5}/>
        <text x={470} y={150} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={80} fill={C.orange} opacity={ease(f,30,45)}>under 10 mm</text>
      </svg>
      <div style={{position:'relative',transform:`perspective(900px) translateZ(${(1-stamp)*400}px) rotate(-8deg)`,opacity:stamp}}>
        <div style={{border:`10px solid ${C.green}`,color:C.green,fontFamily:HEAD,fontWeight:900,fontSize:110,padding:'6px 36px',borderRadius:16}}>LOW RISK</div>
        <div style={{position:'absolute',left:-20,right:-20,top:'50%',height:14,background:C.red,transform:`scaleX(${cross})`,transformOrigin:'left'}}/>
      </div>
      <Label delay={76} size={48}>…say the old scores (PHASES, UCAS)</Label>
      <div style={{display:'flex',alignItems:'center',gap:20,opacity:ease(f,108,116)}}><StickDoc pose="point" mood="surprised" size={240} delay={108}/><div style={{fontFamily:HEAD,fontWeight:900,fontSize:64,color:C.yellow}}>but some still burst!</div></div>
    </AbsoluteFill>
    <Abs x={40} y={380} show={pageIn}><Page src="page2hd.png" srcW={1555} w={1000} tilt={1} inAt={126} boxes={[{x:781,y:684,w:550,h:44,at:138,note:"0.88 · under 10 mm",nx:560,ny:740}]}/></Abs>
    <Abs x={60} y={1070} show={ease(f,142,150)}><div style={{display:'flex',alignItems:'center',gap:30}}><StickDoc pose="cheer" mood="surprised" size={300} delay={142}/><Flip at={142}><Title size={220} color={C.orange}>0.88</Title></Flip></div></Abs>
  </Cam>);
};
const Bar3D: React.FC<{h:number; c:string; dark:string}> = ({h,c,dark}) => (
  <div style={{position:'relative',width:220,height:h,background:c}}>
    <div style={{position:'absolute',left:'100%',top:0,width:44,height:h,background:dark,transform:'skewY(-45deg)',transformOrigin:'left top'}}/>
    <div style={{position:'absolute',left:0,bottom:'100%',width:220,height:44,background:'rgba(255,255,255,.35)',transform:'skewX(-45deg)',transformOrigin:'left bottom'}}/>
  </div>);
const Catch = () => {
  const f=useCurrentFrame();
  const bars=ease(f,23,60), dice=Math.floor(f/6)%6+1;
  const grid=f>=146, bat=f>=252;
  const k=Math.floor(100*ease(f,152,196));
  return (<Cam keys={[[0,1,50,50],[130,1.06,50,40],[146,1,50,50],[244,1.06,50,40],[252,1,50,50],[300,1.12,50,50],[372,1.15,50,50]]}>
    {!grid && <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:30}}>
      <Title size={150} color={C.red} delay={1}>But…</Title>
      <div style={{display:'flex',gap:110,alignItems:'flex-end',height:600,transform:'perspective(1400px) rotateY(-10deg)'}}>
        {[{l:'OLD SCORES',v:0.84,c:C.gray,d:'#55575F'},{l:'THE AI',v:0.90,c:C.orange,d:'#B5621A'}].map(b=>(
          <div key={b.l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:HEAD,fontWeight:900,fontSize:96,color:b.c,marginBottom:40}}>{(b.v*bars).toFixed(2)}</div>
            <Bar3D h={(b.v-0.5)*950*bars} c={b.c} dark={b.d}/>
            <div style={{fontFamily:HEAD,fontWeight:800,fontSize:48,color:C.text}}>{b.l}</div>
          </div>))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:30,opacity:ease(f,70,80)}}>
        <div style={{width:130,height:130,background:'#fff',borderRadius:24,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:HEAD,fontWeight:900,fontSize:90,color:C.bg,transform:`perspective(600px) rotateX(${f*9}deg) rotateY(${f*7}deg)`}}>{dice}</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:72,color:C.yellow}}>could be luck<br/><span style={{fontSize:40,color:C.mute}}>P = .10 (not significant)</span></div>
      </div>
    </AbsoluteFill>}
    {grid && !bat && <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:30}}>
      <Title size={110} delay={147}>Of 100 it <span style={{color:C.orange}}>flagged</span>…</Title>
      <svg width={760} height={760} viewBox="0 0 200 200" style={{transform:`perspective(1400px) rotateX(${(1-ease(f,148,170))*50}deg)`}}>
        {Array.from({length:100},(_,i)=>{const x=(i%10)*20+10, y=Math.floor(i/10)*20+10; return <circle key={i} cx={x} cy={y} r={i<k?7.5:0} fill={i<9?C.red:C.gray}/>;})}
      </svg>
      <div style={{display:'flex',gap:50,opacity:ease(f,196,206)}}>
        <Label size={64} color={C.red} delay={196}>≈9 burst</Label><Label size={64} color={C.mute} delay={200}>≈91 false alarms</Label>
      </div>
    </AbsoluteFill>}
    {bat && <AbsoluteFill style={{alignItems:'center',paddingTop:300,gap:50}}>
      <Flip at={252}><div style={{display:'flex',alignItems:'center',gap:20}}>
        <div style={{width:420,height:200,border:`14px solid ${C.text}`,borderRadius:30,padding:14}}><div style={{width:'4%',height:'100%',background:C.red,borderRadius:8,opacity:Math.floor(f/8)%2?1:0.3}}/></div>
        <div style={{width:30,height:80,background:C.text,borderRadius:8}}/>
      </div></Flip>
      <Title size={130} color={C.red} delay={256}>1% battery…<br/><span style={{color:C.text}}>for an hour</span></Title>
      <StickDoc pose="shrug" mood="flat" size={300} delay={262}/>
    </AbsoluteFill>}
  </Cam>);
};
const End = () => {
  const f=useCurrentFrame();
  const a=1-ease(f,186,194), b=ease(f,192,200)*(1-ease(f,252,258)), c=ease(f,256,264)*(1-ease(f,299,305));
  const one=f>=127&&f<150, two=f>=150&&f<178;
  return (<Cam keys={[[0,1.15,50,40],[30,1,50,50],[186,1.04,50,50],[192,1,50,50],[250,1.08,50,45],[256,1,50,50],[315,1.12,50,40]]}>
    <AbsoluteFill style={{alignItems:'center',padding:'230px 60px 0',gap:60,opacity:a}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <StickDoc pose="thumbs" mood="smile" size={300}/>
        <div><Title size={120}>Cool <span style={{color:C.orange}}>tool</span></Title><Label size={54} delay={30} color={C.text}>not replacing your<br/>neurosurgeon… yet</Label></div>
      </div>
      <Flip at={95}><div style={{background:C.card,borderRadius:28,padding:'26px 44px',textAlign:'center',border:`4px solid ${C.yellow}`,boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:80,color:C.yellow}}>Would you trust it?</div>
        <div style={{display:'flex',gap:30,justifyContent:'center',marginTop:14}}>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:one?C.green:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${one?1.15:1})`}}>1 = yes</div>
          <div style={{fontFamily:HEAD,fontWeight:900,fontSize:58,color:'#fff',background:two?C.red:C.line,padding:'6px 26px',borderRadius:14,transform:`scale(${two?1.15:1})`}}>2 = not yet</div>
        </div>
      </div></Flip>
      <div style={{textAlign:'center',opacity:ease(f,40,55)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:28,color:C.text}}>Fujimura S, et al. JAMA Netw Open 2025 · doi:10.1001/jamanetworkopen.2025.50772</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.mute,marginTop:8}}>Limitation: 2-year risk only, mostly Japanese patients · page images CC BY</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:C.yellow,marginTop:6}}>For education — not medical advice</div>
      </div>
    </AbsoluteFill>
    {/* catchphrase */}
    <AbsoluteFill style={{alignItems:'center',paddingTop:260,gap:20,opacity:b}}>
      <Flip at={192}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={80} color={C.orange} delay={200}>one paper a day</Label>
      <StickDoc pose="wave" mood="smile" size={380} delay={192}/>
      <div style={{opacity:ease(f,210,220),background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:900,fontSize:56,padding:'14px 38px',borderRadius:14}}>FOLLOW #NeuroMot</div>
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:c}}>
      <Title size={130} color={C.yellow} delay={256}>because the<br/>real question is…</Title>
      <div style={{marginTop:40}}><StickDoc pose="think" mood="smirk" size={300} delay={258}/></div>
    </AbsoluteFill>
  </Cam>);
};
const MAP: Record<string, React.FC> = {hook:Hook, study:Study, score:Score, small:Small, catch:Catch, end:End};
// 3D push transition between scenes
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:ease(f,0,9), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0,3.49,'Can a computer tell which brain aneurysm is going to *BURST*…'],[3.77,4.66,'before it does?'],
  [5.06,8.82,'This team fed an AI *3,312* aneurysms.'],[9.09,10.74,'Size, shape, growth…'],[10.99,12.76,'basically their whole *Instagram* history.'],
  [13.18,15.32,'Then tested it at *3 other* hospitals.'],[15.63,17.76,'It scored *0.90*.'],[18.16,20.77,'One is perfect, 0.5 is a *coin flip*.'],
  [21.33,21.78,'Honestly?'],[22.12,23.38,'Better than my *last exam*.'],
  [23.72,27.99,'Even the *SMALL* ones, under 10 mm, the ones old scores call *low risk*…'],[28.35,29.66,'*0.88*.'],
  [30.02,30.52,'*But.*'],[30.80,34.62,'The old scores got 0.84, and that gap might be *luck*.'],[34.97,36.53,'And of every 100 it flagged,'],
  [36.79,38.17,'only about *9* burst.'],[38.50,42.05,'Lots of *false alarms*… like my phone at 1% for an hour.'],
  [42.42,43.08,'Cool tool,'],[43.38,45.02,'not replacing your *neurosurgeon* yet.'],[45.60,46.23,'Would you *trust* it?'],
  [46.65,48.35,'*1* for yes, *2* for not yet.'],[48.81,50.64,'*Dr. Mot*, one paper a day…'],[50.99,52.61,'because the real question is…'],
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
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #5</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>NEUROSURGERY · JAMA NETW OPEN 2025</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
