import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
// Carousel for Tue 2026-11-17 "Time is brain": v4 mix = Nano Banana (Gemini) backgrounds + standard real scans / paper card
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
const AiTag = () => <div style={{position:'absolute',left:70,bottom:56,fontFamily:B,fontWeight:600,fontSize:22,color:'#fff',background:'rgba(0,0,0,.55)',padding:'3px 12px',borderRadius:6}}>AI image</div>;
const Frame: React.FC<{n:number;bg?:string;children:React.ReactNode}> = ({n,bg,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #25262E 0%, ${C.bg} 70%)`,color:C.text}}>
    {bg && <><Img src={staticFile(bg)} style={{position:'absolute',inset:0,width:1080,height:1350,objectFit:'cover'}}/>
      <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(26,27,32,.85) 0%, rgba(26,27,32,.25) 40%, rgba(26,27,32,.1) 60%, rgba(26,27,32,.85) 100%)'}}/><AiTag/></>}
    <AbsoluteFill style={{padding:'60px 70px 90px',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
        <div style={{display:'flex',gap:14}}>
          <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10,background:'rgba(26,27,32,.6)'}}>NEURO PAPER</div>
          <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>STROKE · 2006</div>
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
  if(f===0) return (<Frame n={1} bg="car_brain.jpg">
    <T s={124}>Would you know<br/>the signs of a <span style={{color:C.orange}}>stroke?</span></T>
    <div style={{display:'flex',flexDirection:'column',gap:22}}><div style={{display:'flex',gap:22}}><Opt t="1 = YES" c={C.green}/><Opt t="2 = NOT SURE" c={C.red}/></div>
    <T s={56} c={C.yellow}>swipe: every minute counts →</T></div>
  </Frame>);
  if(f===1) return (<Frame n={2} bg="car_neurons.jpg">
    <div><P s={44} c={C.text}>Every minute of an untreated big-artery stroke:</P><T s={180} c={C.orange}>1.9 million</T><T s={104}>neurons lost</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={44}>One minute. That’s shorter than my morning coffee.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3} bg="car_synapse.jpg">
    <div><P s={44} c={C.text}>In that same minute:</P><T s={180} c={C.red}>14 billion</T><T s={104}>synapses go dark</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={44}>Without treatment, the brain ages about <b style={{color:C.yellow}}>3.6 years every hour</b>.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={104} c={C.orange}>The paper</T>
    <div style={{background:'#f4f1ea',borderRadius:8,padding:'30px 40px',transform:'rotate(-1.2deg)',boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{fontFamily:B,fontWeight:600,fontSize:26,color:'#8a1c25',letterSpacing:2}}>STROKE · 2006 · VOL 37, ISSUE 1 · 263–266</div>
      <div style={{fontFamily:H,fontWeight:900,fontSize:88,lineHeight:0.95,color:'#1A1B20',marginTop:10}}>Time Is Brain —<br/>Quantified</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:34,color:'#333',marginTop:12}}>Jeffrey L. Saver, MD · UCLA Stroke Center</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:22,color:'#6b6b6b',marginTop:8}}>doi:10.1161/01.STR.0000196957.55928.ab</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <Row c={C.orange}>1.9 million neurons · per minute</Row>
      <Row c={C.red}>14 billion synapses · per minute</Row>
      <Row c={C.yellow}>brain ages 3.6 years · per hour</Row>
    </div>
    <P s={38} c={C.yellow}>Save this for your neuro exam.</P>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={110} c={C.orange}>The catch</T>
    <Box bg={C.card}><P s={44}>Those numbers are an <b style={{color:C.yellow}}>AVERAGE</b> for a big-artery stroke. Small strokes lose less.</P></Box>
    <div style={{display:'flex',gap:24,justifyContent:'center'}}>
      <Ph src="ct_mca.jpg" w={450} h={430} label="big-artery stroke" cap="CT · Lucien Monfils · CC BY-SA 4.0"/>
      <Ph src="lacunar.jpg" w={450} h={430} label="small stroke" cap="MRI · Ptrump16 · CC BY-SA 4.0" pos="58% 44%"/>
    </div>
    <T s={70} c={C.red}>But the clock still runs.</T>
  </Frame>);
  return (<Frame n={6}>
    <T s={100}>Know the <span style={{color:C.orange}}>signs</span></T>
    <div style={{display:'flex',gap:26,alignItems:'center'}}>
      <Ph src="fast.jpg" w={430} h={540} cap="U.S. FDA · public domain" fit="contain"/>
      <div style={{display:'flex',flexDirection:'column',gap:18,width:480}}>
        <Box bg={C.red}><P s={42} c="#fff">Face droops or speech slurs? Call your local emergency number. <b>Don’t wait.</b></P></Box>
        <Box bg={C.card}><P s={40}>Would you know the signs?<br/><b style={{color:C.yellow}}>1 = yes · 2 = not sure</b></P></Box>
        <P s={34}>Send this to someone who lives with your grandparents.</P>
      </div>
    </div>
    <P s={22} c={C.mute}>Source: Saver JL. Time is brain—quantified. Stroke 2006;37(1):263–266. doi:10.1161/01.STR.0000196957.55928.ab. Images: Gemini AI images (slides 1–3); Wikimedia Commons (CT: Lucien Monfils, CC BY-SA 4.0; MRI: Ptrump16, CC BY-SA 4.0); F.A.S.T.: U.S. FDA, public domain. For education, not medical advice.</P>
  </Frame>);
};
