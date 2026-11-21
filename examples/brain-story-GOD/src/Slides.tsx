import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
// Carousel for Sun 2026-11-22 "First brain tumour operation, 1884" (Brain Story #9): v4 standard = Gemini backgrounds (1-3) + paper card / real images (4-6)
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
          <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10,background:'rgba(26,27,32,.6)'}}>BRAIN STORY #9</div>
          <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1884</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:bg?'space-between':'center',gap:bg?18:34,paddingTop:bg?36:0,paddingBottom:bg?40:0}}>{children}</div>
    </AbsoluteFill>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
const Opt: React.FC<{t:string;c:string}> = ({t,c}) => <div style={{background:c,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:70,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{t}</div>;
const Row: React.FC<{c:string;children:React.ReactNode}> = ({c,children}) => <div style={{background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'12px 26px',fontFamily:H,fontWeight:900,fontSize:56,color:'#fff'}}>{children}</div>;

const GX=431, GY=175;
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1} bg="car1.jpg">
    <div><P s={46}>1884: a doctor found a brain tumour with NO scan.</P><T s={130}>Who do you<br/><span style={{color:C.orange}}>trust more?</span></T></div>
    <div style={{display:'flex',flexDirection:'column',gap:22}}><div style={{display:'flex',gap:22,flexWrap:'wrap'}}><Opt t="1 = A DOCTOR'S EYES" c={C.green}/><Opt t="2 = THE MACHINE" c={C.red}/></div>
    <T s={54} c={C.yellow}>swipe: how he did it →</T></div>
  </Frame>);
  if(f===1) return (<Frame n={2} bg="car2.jpg">
    <div><T s={170} c={C.text}>1884.</T><T s={110} c={C.orange}>No scans. No X-rays.</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={40}>A young man’s face <b style={{color:C.yellow}}>twitched</b> and his hand <b style={{color:C.yellow}}>shook</b>, on one side only. Neurologist <b>A. Hughes Bennett</b> knew: the <b style={{color:C.orange}}>motor cortex</b> controls the <b>opposite</b> side. So he could point to the spot.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3} bg="car3.jpg">
    <div><P s={44}>The surgery worked. But…</P><T s={190} c={C.red}>28 days</T><T s={110}>later</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={40}>25 Nov 1884: surgeon <b>Rickman Godlee</b> removed a <b style={{color:C.yellow}}>glioma</b> the size of a walnut. The patient died <b style={{color:C.red}}>28 days later</b> of infection (meningitis). The autopsy found no tumour left.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={100} c={C.orange}>The story</T>
    <div style={{background:'#f4f1ea',borderRadius:8,padding:'26px 36px',transform:'rotate(-1.2deg)',boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{fontFamily:B,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>J NEUROSURG · 1984 · 61(5) · 809–813</div>
      <div style={{fontFamily:H,fontWeight:900,fontSize:76,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>The first primary brain-tumor operation</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:30,color:'#333',marginTop:10}}>Kirkpatrick DB</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:22,color:'#6b6b6b',marginTop:6}}>doi:10.3171/jns.1984.61.5.0809</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <Row c={C.yellow}>Found from the signs alone</Row>
      <Row c={C.green}>25 Nov 1884 · glioma removed</Row>
      <Row c={C.red}>Day 28 · died of meningitis</Row>
    </div>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={96} c={C.orange}>Save this for your exam</T>
    <div style={{position:'relative',alignSelf:'center'}}>
      <Ph src="gray726.png" w={900} h={520} cap="Gray’s Anatomy (1918) fig. 726 · public domain" fit="contain"/>
      <div style={{position:'absolute',left:GX-55,top:GY-100,width:110,height:200,borderRadius:'50%',border:`8px solid ${C.yellow}`,transform:'rotate(18deg)'}}/>
    </div>
    <Box bg={C.card}><P s={40}>The <b style={{color:C.yellow}}>motor strip</b> (precentral gyrus, “anterior central gyrus” in old Gray’s) moves the <b>opposite</b> side of the body. A twitch that starts in one hand points to the other side of the brain.</P></Box>
  </Frame>);
  return (<Frame n={6}>
    <T s={100}>So… <span style={{color:C.orange}}>1 or 2?</span></T>
    <div style={{display:'flex',gap:22,justifyContent:'center'}}>
      <Ph src="godlee_photo.jpg" w={380} h={420} label="Rickman Godlee" cap="Wellcome Collection · CC BY 4.0" pos="50% 20%"/>
      <Ph src="lister1902.jpg" w={330} h={420} label="his uncle, Lister" cap="Joseph Lister, 1902 · public domain" pos="50% 25%"/>
    </div>
    <Box bg={C.card}><P s={40}>Who do you trust more? <b style={{color:C.green}}>1 = a doctor’s eyes</b>, <b style={{color:C.red}}>2 = the machine</b>. Send this to the friend who trusts Google over doctors.</P></Box>
    <P s={21} c={C.mute}>Sources: Kirkpatrick DB. The first primary brain-tumor operation. J Neurosurg 1984;61(5):809–13. doi:10.3171/jns.1984.61.5.0809 · Wellcome Collection, “The mystery of the malignant brain” (T. Morris, 2019). Images: slides 1–3 made with Google Gemini; Wikimedia Commons (Godlee, Wellcome Collection, CC BY 4.0; Lister 1902, public domain; Gray’s Anatomy fig. 726, public domain). For education, not medical advice.</P>
  </Frame>);
};
