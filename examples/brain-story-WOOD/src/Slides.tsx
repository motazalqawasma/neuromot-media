import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
// Carousel for Wed 2026-11-18 "Einstein's brain" (Brain Story #7): v4 standard = Gemini backgrounds (1-3) + paper card / real images (4-6)
const C={bg:'#1A1B20',card:'#2D2F37',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4',mute:'#9C9EA8'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
const depth='4px 4px 0 #0B0B0E, 8px 8px 0 #0B0B0E, 12px 16px 30px rgba(0,0,0,.7)';
const T: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=110,c=C.text,children}) => <div style={{fontFamily:H,fontWeight:900,fontSize:s,lineHeight:0.92,color:c,textTransform:'uppercase',textShadow:depth}}>{children}</div>;
const P: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=46,c=C.text,children}) => <div style={{fontFamily:B,fontWeight:600,fontSize:s,lineHeight:1.25,color:c}}>{children}</div>;
const Box: React.FC<{bg:string;children:React.ReactNode;w?:number}> = ({bg,children,w}) => <div style={{background:bg,borderRadius:26,padding:'24px 34px',width:w,boxShadow:'0 10px 0 #0B0B0E'}}>{children}</div>;
const Ph: React.FC<{src:string;w:number;h:number;cap:string;label?:string;pos?:string;fit?:'cover'|'contain'}> = ({src,w,h,cap,label,pos='center',fit='cover'}) => (
  <div style={{background:'#f4f1ea',padding:12,borderRadius:6,width:w,boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
    <div style={{width:w-24,height:h,overflow:'hidden',background:fit==='contain'?'#fff':'#111'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:fit,objectPosition:pos,display:'block'}}/></div>
    {label && <div style={{fontFamily:H,fontWeight:900,fontSize:40,color:'#1A1B20',textAlign:'center',paddingTop:6}}>{label}</div>}
    <div style={{fontFamily:B,fontWeight:600,fontSize:19,color:'#666',textAlign:'center',paddingTop:4}}>{cap}</div></div>);
const Frame: React.FC<{n:number;bg?:string;children:React.ReactNode}> = ({n,bg,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #25262E 0%, ${C.bg} 70%)`,color:C.text}}>
    {bg && <><Img src={staticFile(bg)} style={{position:'absolute',inset:0,width:1080,height:1350,objectFit:'cover'}}/>
      <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(26,27,32,.85) 0%, rgba(26,27,32,.25) 40%, rgba(26,27,32,.1) 60%, rgba(26,27,32,.85) 100%)'}}/></>}
    <AbsoluteFill style={{padding:'60px 70px 90px',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
        <div style={{display:'flex',gap:14}}>
          <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10,background:'rgba(26,27,32,.6)'}}>BRAIN STORY #8</div>
          <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1910</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:bg?'space-between':'center',gap:bg?18:34,paddingTop:bg?36:0,paddingBottom:bg?40:0}}>{children}</div>
    </AbsoluteFill>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
const Opt: React.FC<{t:string;c:string}> = ({t,c}) => <div style={{background:c,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:70,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{t}</div>;
const Row: React.FC<{c:string;children:React.ReactNode}> = ({c,children}) => <div style={{background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'12px 26px',fontFamily:H,fontWeight:900,fontSize:56,color:'#fff'}}>{children}</div>;
const LAYERS=[{y:265,x:760},{y:505,x:740},{y:745,x:735},{y:900,x:735},{y:1030,x:715},{y:1150,x:720}];
const PARTS=['Scalp','Skull','Dura mater (+ sup. sagittal sinus)','Arachnoid','Pia mater','Brain'];
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1} bg="car1.jpg">
    <T s={140}>Ever hit your head<br/><span style={{color:C.orange}}>really hard?</span></T>
    <div style={{display:'flex',flexDirection:'column',gap:22}}><div style={{display:'flex',gap:22}}><Opt t="1 = YES" c={C.green}/><Opt t="2 = NEVER" c={C.red}/></div>
    <T s={54} c={C.yellow}>swipe: his tumor, layer by layer →</T></div>
  </Frame>);
  if(f===1) return (<Frame n={2} bg="car2.jpg">
    <div><P s={44}>This tumor was</P><T s={170} c={C.red}>NOT in</T><T s={110}>his brain. <span style={{color:C.orange}}>ON it.</span></T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={40}>A <b style={{color:C.yellow}}>meningioma</b> grows from the brain’s covering (the dura) and presses from <b>outside</b>. His sat on the brain’s biggest vein channel… like parking on a highway, so it bled a lot.</P></Box>
  </Frame>);
  if(f===2) return (<AbsoluteFill style={{background:'#fff'}}>
    <Img src={staticFile('k3.jpg')} style={{position:'absolute',left:300,top:150,width:1080*0.66,height:1920*0.66}}/>
    {LAYERS.map((l,i)=>{const y=150+l.y*0.66, x=300+l.x*0.66; return (<React.Fragment key={i}>
      <div style={{position:'absolute',left:x,top:y-2,width:960-x,height:4,background:'#3A3C45'}}/>
      <div style={{position:'absolute',left:960,top:y-26,width:52,height:52,borderRadius:26,background:i===2?C.yellow:'#2D2F37',color:i===2?'#000':'#fff',fontFamily:H,fontWeight:900,fontSize:36,textAlign:'center',lineHeight:'52px'}}>{i+1}</div></React.Fragment>);})}
    <div style={{position:'absolute',left:60,top:60,fontFamily:H,fontWeight:800,fontSize:40,color:'#55575f'}}>#NeuroMot</div>
    <div style={{position:'absolute',left:60,top:120,fontFamily:H,fontWeight:900,fontSize:92,lineHeight:0.9,color:C.bg,textTransform:'uppercase'}}>Save this<br/><span style={{color:C.orange}}>for your exam</span></div>
    <div style={{position:'absolute',left:50,top:440,width:330,background:'rgba(255,255,255,.94)',border:'2px solid #9C9EA8',borderRadius:12,padding:'14px 20px',fontFamily:B,fontWeight:600,color:'#2D2F37'}}>
      <div style={{fontFamily:H,fontWeight:900,fontSize:32,letterSpacing:2,color:'#555',borderBottom:'2px solid #bbb',paddingBottom:4,marginBottom:8}}>PARTS LIST</div>
      {PARTS.map((p,i)=>(<div key={p} style={{fontSize:28,lineHeight:1.3,display:'flex',gap:12,alignItems:'flex-start',marginBottom:4}}>
        <span style={{flex:'0 0 36px',height:36,borderRadius:18,background:i===2?C.yellow:'#2D2F37',color:i===2?'#000':'#fff',textAlign:'center',fontFamily:H,fontWeight:900,fontSize:28,lineHeight:'36px'}}>{i+1}</span>
        <span style={{fontWeight:i===2?900:600}}>{p}</span></div>))}
    </div>
    <div style={{position:'absolute',left:50,bottom:90,width:520,background:C.bg,color:C.text,borderRadius:18,padding:'16px 24px',fontFamily:B,fontWeight:600,fontSize:30,lineHeight:1.25}}><b style={{color:C.yellow}}>Meningioma</b> = outside the brain (extra-axial), attached to the dura (3).</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:'#9C9EA8'}}>3/6</div>
  </AbsoluteFill>);
  if(f===3) return (<Frame n={4}>
    <T s={100} c={C.orange}>The story</T>
    <div style={{background:'#f4f1ea',borderRadius:8,padding:'26px 36px',transform:'rotate(-1.2deg)',boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{fontFamily:B,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>J NEUROSURG · 2011 · 115(6) · 1067–1071</div>
      <div style={{fontFamily:H,fontWeight:900,fontSize:64,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>A meningioma and its consequences for American history and the rise of neurosurgery</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:30,color:'#333',marginTop:10}}>Ansari SF, Gianaris NG, Cohen-Gadol AA</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:22,color:'#6b6b6b',marginTop:6}}>doi:10.3171/2011.7.JNS102067</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <Row c={C.green}>1910 · Cushing removes it (in 2 steps)</Row>
      <Row c={C.orange}>Wood works 17 more years</Row>
      <Row c={C.red}>1927 · it comes back · he dies</Row>
    </div>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={96} c={C.orange}>Why it bled so much</T>
    <div style={{position:'relative',alignSelf:'center'}}>
      <Ph src="gray769.png" w={860} h={500} cap="Gray’s Anatomy (1918) fig. 769 · public domain" fit="contain"/>
      <div style={{position:'absolute',left:440,top:75,width:150,height:150,borderRadius:75,border:`8px solid ${C.yellow}`}}/>
    </div>
    <Box bg={C.card}><P s={40}>The tumor sat beside the <b style={{color:C.yellow}}>superior sagittal sinus</b>, the big vein channel inside the dura, right on the midline.</P></Box>
  </Frame>);
  return (<Frame n={6}>
    <T s={100}>So… <span style={{color:C.orange}}>1 or 2?</span></T>
    <div style={{display:'flex',gap:22,justifyContent:'center'}}>
      <Ph src="wood.jpg" w={330} h={380} label="Leonard Wood" cap="Moffett, Chicago · public domain" pos="50% 25%"/>
      <Ph src="cushing1908.jpg" w={420} h={380} label="Harvey Cushing" cap="E. C. Tarbell, 1908 · public domain" pos="62% 30%"/>
    </div>
    <Box bg={C.card}><P s={40}>Ever hit your head really hard? <b style={{color:C.green}}>1 = yes</b>, <b style={{color:C.red}}>2 = never</b>. Send this to your clumsiest friend.</P></Box>
    <P s={21} c={C.mute}>Sources: Ansari SF, Gianaris NG, Cohen-Gadol AA. J Neurosurg 2011;115(6):1067–71. doi:10.3171/2011.7.JNS102067 · Ljunggren B. The case of General Wood. J Neurosurg 1982;56(4):471 · Federal Practitioner 2017. Images: slides 1–3 made with Google Gemini; Wikimedia Commons (Wood, Moffett Chicago, public domain; Cushing by E. C. Tarbell 1908, public domain; Gray’s Anatomy fig. 769, public domain). The chandelier injury is not proven to have caused the tumor. For education, not medical advice.</P>
  </Frame>);
};
