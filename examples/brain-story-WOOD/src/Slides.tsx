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
          <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10,background:'rgba(26,27,32,.6)'}}>BRAIN STORY #7</div>
          <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1955</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:bg?'space-between':'center',gap:bg?18:34,paddingTop:bg?36:0,paddingBottom:bg?40:0}}>{children}</div>
    </AbsoluteFill>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
const Opt: React.FC<{t:string;c:string}> = ({t,c}) => <div style={{background:c,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:70,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{t}</div>;
const Row: React.FC<{c:string;children:React.ReactNode}> = ({c,children}) => <div style={{background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'12px 26px',fontFamily:H,fontWeight:900,fontSize:56,color:'#fff'}}>{children}</div>;
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1} bg="car1.jpg">
    <T s={150}>What makes<br/>a <span style={{color:C.orange}}>genius?</span></T>
    <div style={{display:'flex',flexDirection:'column',gap:22}}><div style={{display:'flex',gap:22}}><Opt t="1 = BORN WITH" c={C.green}/><Opt t="2 = PRACTICE" c={C.red}/></div>
    <T s={56} c={C.yellow}>swipe: Einstein’s brain was kept 43 years →</T></div>
  </Frame>);
  if(f===1) return (<Frame n={2} bg="car2.jpg">
    <div><P s={44}>1955: Einstein asked to be cremated. His brain was kept for</P><T s={190} c={C.orange}>43 years</T><T s={96}>in about 240 blocks</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={42}>Pathologist Thomas Harvey weighed it, photographed it and cut it up. The most famous brain on Earth… basically living in jars.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3} bg="car3.jpg">
    <div><P s={44}>The weight? Totally normal. But his parietal lobes were about</P><T s={190} c={C.red}>15% wider</T><T s={96}>than average</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={42}>Parietal lobe = the part for <b style={{color:C.yellow}}>numbers and space</b>.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={104} c={C.orange}>The paper</T>
    <div style={{background:'#f4f1ea',borderRadius:8,padding:'30px 40px',transform:'rotate(-1.2deg)',boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{fontFamily:B,fontWeight:600,fontSize:26,color:'#8a1c25',letterSpacing:2}}>THE LANCET · 1999 · VOL 353 · 2149–2153</div>
      <div style={{fontFamily:H,fontWeight:900,fontSize:84,lineHeight:0.95,color:'#1A1B20',marginTop:10}}>The exceptional brain<br/>of Albert Einstein</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:32,color:'#333',marginTop:12}}>Witelson SF, Kigar DL, Harvey T</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:22,color:'#6b6b6b',marginTop:8}}>doi:10.1016/S0140-6736(98)10327-6</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <Row c={C.green}>brain weight · normal</Row>
      <Row c={C.orange}>parietal lobes · about 15% wider</Row>
      <Row c={C.yellow}>more glia per neuron · Diamond 1985</Row>
    </div>
    <P s={38} c={C.yellow}>Save this for your neuro exam: parietal lobe = numbers + space.</P>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={110} c={C.orange}>The catch</T>
    <div style={{display:'flex',gap:24,justifyContent:'center',alignItems:'flex-start'}}>
      <Ph src="einstein.jpg" w={360} h={430} label="Einstein, 1921" cap="F. Schmutzer · public domain" pos="50% 30%"/>
      <Ph src="falk.jpg" w={560} h={300} label="his left parietal area" cap="Falk 2009, from Harvey’s photos · CC BY 3.0" fit="contain"/>
    </div>
    <Box bg={C.card}><P s={44}>It’s <b style={{color:C.yellow}}>ONE</b> brain, studied decades later, with small control groups. Nobody can prove that’s what made him a genius.</P></Box>
  </Frame>);
  return (<Frame n={6}>
    <T s={100}>So… <span style={{color:C.orange}}>1 or 2?</span></T>
    <div style={{display:'flex',gap:26,alignItems:'center'}}>
      <Ph src="gray728.jpg" w={470} h={340} cap="Gray’s Anatomy fig. 728 · public domain" fit="contain"/>
      <div style={{display:'flex',flexDirection:'column',gap:18,width:440}}>
        <Box bg={C.card}><P s={40}>What makes a genius?<br/><b style={{color:C.green}}>1 = born with</b><br/><b style={{color:C.red}}>2 = practice</b></P></Box>
        <P s={36}>Send this to the smartest friend you have.</P>
      </div>
    </div>
    <P s={22} c={C.mute}>Sources: Witelson SF, Kigar DL, Harvey T. The exceptional brain of Albert Einstein. Lancet 1999;353:2149–53. doi:10.1016/S0140-6736(98)10327-6 · Diamond MC et al. Exp Neurol 1985;88:198–204. doi:10.1016/0014-4886(85)90123-2. Images: slides 1–3 made with Google Gemini; Wikimedia Commons (Einstein 1921, F. Schmutzer, public domain; Falk 2009, CC BY 3.0; Gray’s Anatomy, public domain). For education, not medical advice.</P>
  </Frame>);
};
