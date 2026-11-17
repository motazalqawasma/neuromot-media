import React from 'react';
import {AbsoluteFill, Sequence, Audio, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing, random} from 'remotion';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {StickDoc, Cam} from './Stick';

const C = {bg:'#1A1B20', bg2:'#25262E', card:'#2D2F37', line:'#3A3C45', text:'#F2F2F4', mute:'#9C9EA8', red:'#E0263A', orange:'#F28C28', yellow:'#FFD23F', green:'#2DBE6C', gray:'#7A7D88', blue:'#4FA3FF'};
const HEAD = "'Barlow Condensed', sans-serif";
const BODY = "'Barlow', sans-serif";
const S = 30;
const COVER = 12;
// voice: take 1 (2026-11-17), 64.9 s. Times = ElevenLabs Scribe word timestamps.
const scenes = [
  {id:'zoom', a:0, b:17.14},{id:'harvey', a:17.14, b:26.97},{id:'parietal', a:26.97, b:40.92},{id:'glia', a:40.92, b:47.64},{id:'catch', a:47.64, b:55.24},{id:'ask', a:55.24, b:59.5},{id:'end', a:59.5, b:65.4},
];
export const TOTAL = COVER + Math.round(65.4*S);
const cl = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const ease = (f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...cl, easing:Easing.out(Easing.cubic)});
const useSpring = (delay:number)=>{const f=useCurrentFrame(); const {fps}=useVideoConfig(); return spring({frame:f-delay,fps,config:{damping:12,mass:0.6}});};
// frame inside a scene for an absolute voice time
const at = (scene:string, sec:number)=>{const s=scenes.find(x=>x.id===scene)!; return Math.round((sec-s.a)*S);};

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
const NameTag: React.FC<{at:number}> = ({at}) => {const s=useSpring(at); return (
  <div style={{transform:`scale(${s})`,background:C.text,color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:40,padding:'4px 18px',borderRadius:10,display:'inline-block',boxShadow:'0 6px 0 #0B0B0E'}}>DR. MOT</div>);};
const Pill: React.FC<{at:number; children:React.ReactNode; bg?:string; color?:string; size?:number; rot?:number}> = ({at,children,bg=C.yellow,color=C.bg,size=52,rot=0}) => {const f=useCurrentFrame(); const p=ease(f,at,at+8); return (
  <div style={{opacity:p,transform:`scale(${0.6+0.4*p}) rotate(${rot}deg)`,background:bg,color,fontFamily:HEAD,fontWeight:900,fontSize:size,padding:'6px 26px',borderRadius:14,display:'inline-block',boxShadow:'0 8px 0 #0B0B0E',whiteSpace:'nowrap'}}>{children}</div>);};
const Stamp: React.FC<{at:number; c?:string; size?:number; children:React.ReactNode}> = ({at,c=C.red,size=120,children}) => {const f=useCurrentFrame(); return (
  <div style={{opacity:ease(f,at,at+6),transform:`scale(${1.5-0.5*ease(f,at,at+8)}) rotate(-5deg)`,border:`10px solid ${c}`,color:c,fontFamily:HEAD,fontWeight:900,fontSize:size,lineHeight:1,padding:'10px 40px',borderRadius:20,background:'rgba(26,27,32,.88)',textAlign:'center'}}>{children}</div>);};
const Row: React.FC<{at:number; c:string; children:React.ReactNode; size?:number}> = ({at,c,children,size=60}) => {const s=useSpring(at); return (
  <div style={{transform:`translateX(${(1-s)*-60}px)`,opacity:s>0.02?1:0,background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'12px 28px',fontFamily:HEAD,fontWeight:900,fontSize:size,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{children}</div>);};
// big number card
const NumCard: React.FC<{at:number; num:string; unit:string; c:string}> = ({at,num,unit,c}) => (
  <Flip at={at}><div style={{background:'rgba(26,27,32,.82)',border:`5px solid ${c}`,borderRadius:28,padding:'14px 44px 18px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,lineHeight:0.95,color:c,textShadow:depth('#0B0B0E')}}>{num}</div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:62,color:'#fff',textTransform:'uppercase'}}>{unit}</div>
  </div></Flip>);
// real photo as a tilted print with slow zoom + credit line
const Photo: React.FC<{src:string; w:number; h:number; at:number; rot?:number; label?:string; credit?:string; pos?:string; fit?:'cover'|'contain'}> = ({src,w,h,at,rot=0,label,credit,pos='center',fit='cover'}) => {
  const f=useCurrentFrame(); const p=ease(f,at,at+12); const z=1.02+0.06*ease(f,at,at+150);
  return (<div style={{opacity:p,transform:`perspective(1400px) translateY(${(1-p)*120}px) rotateX(${(1-p)*40}deg) rotate(${rot*p}deg)`,background:'#f4f1ea',padding:'16px 16px 0',borderRadius:6,boxShadow:'0 30px 70px rgba(0,0,0,.6)',width:w}}>
    <div style={{width:w-32,height:h,overflow:'hidden',borderRadius:3,background:fit==='contain'?'#fff':'#111'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:fit,objectPosition:pos,transform:`scale(${z})`}}/></div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:44,color:'#1A1B20',textAlign:'center',padding:'8px 0 0'}}>{label}</div>
    <div style={{fontFamily:BODY,fontWeight:600,fontSize:18,color:'#6b6b6b',textAlign:'center',paddingBottom:10}}>{credit}</div>
  </div>);
};
const QCard: React.FC<{at:number; q:string; o1?:string; o2?:string; sub?:string}> = ({at,q,o1='1 = YES',o2='2 = NOT SURE',sub='comment below'}) => (
  <Flip at={at}><div style={{background:C.card,border:`5px solid ${C.yellow}`,borderRadius:28,padding:'26px 44px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:76,color:C.yellow}}>{q}</div>
    <div style={{display:'flex',gap:22,justifyContent:'center',marginTop:16}}>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff',background:C.green,padding:'6px 34px',borderRadius:14}}>{o1}</div>
      <div style={{fontFamily:HEAD,fontWeight:900,fontSize:70,color:'#fff',background:C.red,padding:'6px 34px',borderRadius:14}}>{o2}</div>
    </div>
    <div style={{fontFamily:HEAD,fontWeight:800,fontSize:44,color:C.text,marginTop:14}}>{sub}</div>
  </div></Flip>);

// ---------- Gemini zoom clips
const LEN:Record<string,number>={'c1.mp4':10.17,'c2.mp4':10.5,'c3.mp4':10.1};
const Clip: React.FC<{src:string; dur:number}> = ({src,dur}) =>
  <AbsoluteFill><OffthreadVideo muted src={staticFile(src)} playbackRate={(LEN[src]-0.1)/dur} style={{width:1080,height:1920,objectFit:'cover'}}/></AbsoluteFill>;
const Shade = () => <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 60%, rgba(0,0,0,.65) 100%)'}}/>;
const Fade: React.FC<{a:number; b:number; children:React.ReactNode; style?:React.CSSProperties}> = ({a,b,children,style}) => {
  const f=useCurrentFrame(); if(f<a||f>b) return null;
  return <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:24,opacity:ease(f,a,a+6)*(1-ease(f,b-6,b)),...style}}>{children}</AbsoluteFill>;
};

// ---------- scene 1: hook + question over the jar zoom
const Zoom = () => {
  const Z='zoom';
  return (<AbsoluteFill>
    <Clip src="c1.mp4" dur={17.14}/><Shade/>
    <Fade a={0} b={at(Z,1.95)}><Title size={230} color={C.orange}>1955</Title><Pill at={4} bg={C.yellow} size={50}>what makes a genius? 1 or 2</Pill></Fade>
    <Fade a={at(Z,2.0)} b={at(Z,5.4)} style={{paddingTop:200}}>
      <Photo src="einstein.jpg" w={520} h={600} at={at(Z,2.0)} rot={-2} label="Albert Einstein" credit="1921 · F. Schmutzer · public domain" pos="50% 30%"/>
      <Pill at={at(Z,4.3)} bg={C.red} color="#fff" size={58} rot={-3}>wish: CREMATED</Pill>
    </Fade>
    <Fade a={at(Z,5.44)} b={at(Z,9.35)} style={{paddingTop:300,gap:40}}>
      <Stamp at={at(Z,6.24)} size={110}>BRAIN KEPT</Stamp>
      <NumCard at={at(Z,7.68)} num="43 YEARS" unit="1955 → 1998" c={C.orange}/>
    </Fade>
    <Fade a={at(Z,9.5)} b={at(Z,17.14)+6} style={{paddingTop:330}}>
      <QCard at={at(Z,9.52)} q="What makes a genius?" o1="1 = BORN WITH" o2="2 = PRACTICE" sub="answer at the end"/>
    </Fade>
  </AbsoluteFill>);
};

// ---------- scene 2: Harvey, 240 blocks, jars
const Blocks: React.FC<{at:number}> = ({at:a}) => {
  const f=useCurrentFrame(); const n=Math.round(240*ease(f,a,a+40));
  return (<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(20, 34px)',gap:5}}>
      {Array.from({length:240},(_,i)=><div key={i} style={{width:34,height:22,borderRadius:4,background:i<n?(i%9===0?C.orange:'#C9CDD6'):'#2D2F37',opacity:i<n?0.9:0.4}}/>)}
    </div>
    <div style={{fontFamily:HEAD,fontWeight:900,fontSize:150,color:C.orange,textShadow:depth('#0B0B0E'),lineHeight:1}}>{n} BLOCKS</div>
  </div>);
};
const Harvey = () => {
  const f=useCurrentFrame(); const H='harvey';
  return (<Cam keys={[[0,1.08,50,45],[20,1,50,45],[at(H,21.6),1.05,50,45],[at(H,21.8),1,50,45],[at(H,26.9),1.04,50,45]]}>
    <Fade a={0} b={at(H,23.3)} style={{paddingTop:200,gap:26}}>
      <Pill at={2} bg={C.orange} color="#fff" size={52}>THE PATHOLOGIST</Pill>
      <Title size={130} delay={4}>Thomas Harvey</Title>
      <div style={{display:'flex',flexDirection:'column',gap:16,width:760}}>
        <Row at={at(H,18.72)} c={C.green}>✓ weighed it</Row>
        <Row at={at(H,19.4)} c={C.green}>✓ photographed it</Row>
      </div>
      {f>=at(H,20.4) && <Blocks at={at(H,20.5)}/>}
    </Fade>
    <Fade a={at(H,23.3)} b={at(H,27)} style={{paddingTop:260,gap:30}}>
      <Title size={104} delay={at(H,23.35)}>the most famous<br/><span style={{color:C.orange}}>brain on Earth…</span></Title>
      <div style={{position:'relative',marginTop:40}}>
        <div style={{position:'absolute',left:-330,top:-40,opacity:ease(f,at(H,25.3),at(H,25.6)),background:'#fff',color:C.bg,fontFamily:HEAD,fontWeight:900,fontSize:56,padding:'10px 26px',borderRadius:24,whiteSpace:'nowrap',boxShadow:'0 8px 0 #0B0B0E'}}>…living in jars</div>
        <StickDoc pose="shrug" mood="smirk" size={380} delay={at(H,23.6)}/>
      </div>
    </Fade>
  </Cam>);
};

// ---------- scene 3: normal weight, parietal 15% wider (zoom to the glowing fold)
const Parietal = () => {
  const P='parietal';
  return (<AbsoluteFill>
    <Clip src="c2.mp4" dur={13.95}/><Shade/>
    <Fade a={0} b={at(P,29.15)} style={{paddingTop:300,gap:40}}>
      <Label size={80} color={C.text} delay={at(P,27.1)}>THE WEIGHT?</Label>
      <Stamp at={at(P,28.4)} c={C.green} size={140}>NORMAL</Stamp>
    </Fade>
    <Fade a={at(P,29.2)} b={at(P,34.5)} style={{paddingTop:220,gap:28}}>
      <Pill at={at(P,29.4)} bg={C.yellow} size={56}>1999 · THE LANCET</Pill>
      <Photo src="gray728.jpg" w={900} h={600} at={at(P,31.3)} rot={-1.5} label="parietal lobe = numbers + space" credit="Gray’s Anatomy, fig. 728 · public domain" fit="contain"/>
    </Fade>
    <Fade a={at(P,34.5)} b={at(P,41)} style={{paddingTop:260,gap:40}}>
      <NumCard at={at(P,34.6)} num="15% WIDER" unit="his parietal lobes" c={C.orange}/>
      <Pill at={at(P,36.96)} bg={C.yellow} size={54}>SAVE: PARIETAL = NUMBERS + SPACE</Pill>
    </Fade>
  </AbsoluteFill>);
};

// ---------- scene 4: more glia per neuron (zoom to cells)
const Glia = () => {
  const G='glia';
  return (<AbsoluteFill>
    <Clip src="c3.mp4" dur={6.72}/><Shade/>
    <Fade a={0} b={at(G,47.7)} style={{paddingTop:240,gap:30}}>
      <Pill at={4} bg={C.blue} color="#fff" size={50}>1985 · ANOTHER STUDY</Pill>
      <NumCard at={at(G,42.16)} num="MORE GLIA" unit="per neuron · left parietal area" c={C.blue}/>
      <Pill at={at(G,43.56)} bg={C.yellow} size={52}>the brain’s support crew</Pill>
    </Fade>
  </AbsoluteFill>);
};

// ---------- scene 5: the catch + the paper (recreated card, not open access)
const Catch = () => {
  const f=useCurrentFrame(); const K='catch';
  return (<Cam keys={[[0,1.1,50,45],[14,1,50,45],[at(K,48.9),1.04,50,45],[at(K,49.1),1,50,45],[at(K,55.2),1.05,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:200,gap:26}}>
      <Title size={120} color={C.orange}>The catch</Title>
      <div style={{opacity:ease(f,4,16),transform:`perspective(1400px) rotateX(${(1-ease(f,4,18))*50}deg) rotate(-1.5deg)`,width:860,background:'#f4f1ea',borderRadius:8,padding:'28px 40px 24px',boxShadow:'0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:26,color:'#8a1c25',letterSpacing:2}}>THE LANCET · 1999 · VOL 353 · 2149–2153</div>
        <div style={{fontFamily:HEAD,fontWeight:900,fontSize:84,lineHeight:0.95,color:'#1A1B20',marginTop:10}}>The exceptional brain<br/>of Albert Einstein</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:32,color:'#333',marginTop:12}}>Witelson SF, Kigar DL, Harvey T</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:'#6b6b6b',marginTop:8}}>doi:10.1016/S0140-6736(98)10327-6</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16,width:860,marginTop:6}}>
        <Row at={at(K,48.88)} c={C.red}>ONE brain</Row>
        <Row at={at(K,49.68)} c={C.orange}>studied decades later</Row>
        <Row at={at(K,51.2)} c={C.yellow}>small control groups</Row>
      </div>
    </AbsoluteFill>
    {f>=at(K,53.1) && <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}><Stamp at={at(K,53.2)} c={C.red} size={110}>CAN’T PROVE IT</Stamp></AbsoluteFill>}
  </Cam>);
};

// ---------- scene 6: share + the question again
const Ask = () => {
  const A='ask';
  return (<Cam keys={[[0,1.06,50,45],[20,1,50,45],[at(A,59.4),1.04,50,45]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:220,gap:36}}>
      <Pill at={2} bg={C.green} color="#fff" size={50}>SEND THIS TO YOUR SMARTEST FRIEND</Pill>
      <QCard at={at(A,57.64)} q="What makes a genius?" o1="1 = BORN WITH" o2="2 = PRACTICE" sub="comment 1 or 2"/>
      <div style={{display:'flex',gap:20,alignItems:'center'}}><NameTag at={at(A,57.9)}/><StickDoc pose="think" mood="flat" size={280} delay={at(A,57.7)}/></div>
    </AbsoluteFill>
  </Cam>);
};

// ---------- scene 7: end card
const End = () => {
  const f=useCurrentFrame();
  return (<Cam keys={[[0,1.08,50,45],[24,1,50,45],[170,1.06,50,42]]}>
    <AbsoluteFill style={{alignItems:'center',paddingTop:230,gap:20}}>
      <Flip at={2}><div style={{fontFamily:HEAD,fontWeight:900,fontSize:190,color:C.text,textShadow:depth('#0B0B0E'),lineHeight:1}}>DR. MOT</div></Flip>
      <Label size={74} color={C.orange} delay={8}>one brain story at a time</Label>
      <Title size={96} color={C.yellow} delay={at('end',63.68)}>what makes a genius?</Title>
      <StickDoc pose="wave" mood="smile" size={300} delay={10}/>
      <div style={{textAlign:'center',padding:'0 70px',opacity:ease(f,16,26)}}>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:22,color:C.text}}>Sources: Witelson SF, Kigar DL, Harvey T. Lancet 1999;353:2149–53 · doi:10.1016/S0140-6736(98)10327-6 · Diamond MC et al. Exp Neurol 1985;88:198–204 · doi:10.1016/0014-4886(85)90123-2</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:20,color:C.mute,marginTop:6}}>Images: Einstein 1921, F. Schmutzer, public domain · Gray’s Anatomy fig. 728, public domain (Wikimedia Commons) · 3D zoom made with Google Gemini</div>
        <div style={{fontFamily:BODY,fontWeight:600,fontSize:21,color:C.yellow,marginTop:6}}>For education, not medical advice</div>
      </div>
    </AbsoluteFill>
  </Cam>);
};

const MAP: Record<string, React.FC> = {zoom:Zoom, harvey:Harvey, parietal:Parietal, glia:Glia, catch:Catch, ask:Ask, end:End};
const SceneTrans: React.FC<{dur:number; first?:boolean; last?:boolean; children:React.ReactNode}> = ({dur, first, last, children}) => {
  const f=useCurrentFrame();
  const inP=first?1:interpolate(f,[0,10],[0,1],{...cl, easing:Easing.bezier(0.16,1,0.3,1)}), outP=last?0:ease(f,dur-6,dur);
  return <AbsoluteFill style={{opacity:Math.min(inP,1-outP), overflow:'hidden',
    transform:`perspective(2000px) translateX(${(1-inP)*160}px) rotateY(${(1-inP)*-22}deg) scale(${1-0.06*outP})`}}>{children}</AbsoluteFill>;
};

// burned-in captions (voice time, s). *word* = yellow key word
const CAPS:[number,number,string][] = [
  [0.16,1.8,'*1955*.'],[2.08,3.52,'Einstein dies…'],[3.56,5.36,'and he asked to be *CREMATED*.'],[5.44,7.36,'But one doctor *KEPT* his brain…'],[7.48,8.96,'for *43 YEARS*.'],
  [9.52,11.36,'So… what makes a *genius*?'],[11.84,13.68,'*1*, the brain you’re *BORN* with…'],[13.72,16.0,'or *2*, the hours you *PRACTICE*?'],[16.16,17.12,'Answer at the end.'],
  [17.33,19.28,'Pathologist *Thomas Harvey* weighed it,'],[19.4,20.32,'photographed it…'],[20.4,23.28,'and cut it into about *240 BLOCKS*.'],[23.31,25.2,'The most famous brain on Earth…'],[25.28,26.96,'basically living in *jars*.'],
  [27.04,28.0,'And the weight?'],[28.08,29.12,'Totally *NORMAL*.'],[29.16,30.48,'But in *1999*,'],[30.56,32.48,'a team found his *parietal lobes*,'],[32.52,34.16,'the part for *numbers* and *space*,'],[34.36,36.88,'about *15 percent WIDER* than average.'],
  [36.96,38.24,'*Save this* for your exam:'],[38.36,40.88,'parietal lobe… *numbers and space*.'],
  [40.96,43.36,'Another study counted *MORE glial cells*,'],[43.4,44.56,'the brain’s *support crew*,'],[44.64,47.6,'for every neuron in one *left parietal* area.'],
  [47.67,48.48,'The *catch*?'],[48.52,49.6,'It’s *ONE* brain,'],[49.68,50.96,'studied decades later,'],[51.04,52.56,'with *small* control groups.'],[52.72,55.2,'Nobody can *PROVE* that’s what made him a genius.'],
  [55.28,57.52,'Send this to the *smartest friend* you have.'],[57.64,59.44,'So… *1 or 2*?'],[59.56,61.92,'*Dr. Mot*, one brain story at a time…'],[62.0,63.6,'because the real question is…'],[63.68,64.96,'what makes a *genius*?'],
];
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
  const f=useCurrentFrame();
  const loop=interpolate(f,[TOTAL-9,TOTAL-2],[0,1],cl);
  const capO=1-interpolate(f,[TOTAL-14,TOTAL-9],[0,1],cl);
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
    <Sequence from={0} durationInFrames={COVER}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></Sequence>
    <Sequence from={COVER}>
      <Audio src={staticFile('voice.mp3')}/>
      <Audio src={staticFile('sfx.wav')} volume={0.35}/>
      {((f-COVER>=Math.round(17.14*S)&&f-COVER<Math.round(26.97*S))||f-COVER>=Math.round(47.64*S)) && <Particles/>}
      {scenes.map((s,i)=>{const from=Math.round(s.a*S), dur=Math.round((s.b-s.a)*S); const Comp=MAP[s.id];
        return <Sequence key={s.id} from={from} durationInFrames={dur}><SceneTrans dur={dur} first={i===0} last={i===scenes.length-1}><Comp/></SceneTrans></Sequence>;})}
      <AbsoluteFill style={{opacity:capO}}><Captions/></AbsoluteFill>
      <div style={{position:'absolute',top:56,left:70,fontFamily:HEAD,fontWeight:800,fontSize:40,color:C.mute}}>#NeuroMot</div>
      <div style={{position:'absolute',top:110,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:HEAD,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10,letterSpacing:1}}>BRAIN STORY #7</div>
      <div style={{position:'absolute',top:50,right:70,background:C.red,color:'#fff',fontFamily:HEAD,fontWeight:800,fontSize:32,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>TRUE CASE · 1955</div>
      <div style={{position:'absolute',bottom:0,left:0,height:14,width:`${((f-COVER)/(TOTAL-COVER))*100}%`,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
    </Sequence>
    <AbsoluteFill style={{opacity:loop}}><Img src={staticFile('cover.png')} style={{width:1080,height:1920}}/></AbsoluteFill>
  </AbsoluteFill>);
};
