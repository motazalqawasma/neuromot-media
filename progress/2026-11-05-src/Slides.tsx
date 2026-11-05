import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Skull3D} from './Skull3D';
const C={bg:'#1A1B20',card:'#2D2F37',line:'#3A3C45',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4',mute:'#9C9EA8',gray:'#7A7D88'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
const T: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=110,c=C.text,children}) => <div style={{fontFamily:H,fontWeight:900,fontSize:s,lineHeight:0.92,color:c,textTransform:'uppercase'}}>{children}</div>;
const P: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=46,c=C.text,children}) => <div style={{fontFamily:B,fontWeight:600,fontSize:s,lineHeight:1.25,color:c}}>{children}</div>;
const Box: React.FC<{bg:string;children:React.ReactNode;w?:number}> = ({bg,children,w}) => <div style={{background:bg,borderRadius:26,padding:'26px 34px',width:w}}>{children}</div>;
const Frame: React.FC<{n:number;children:React.ReactNode}> = ({n,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #2b1a16 0%, ${C.bg} 65%)`,padding:'70px 70px 90px',color:C.text}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
      <div style={{display:'flex',gap:14}}>
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>NEURO PAPER #10</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>YOU'RE THE SURGEON · CASE 1</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={150}>Drain it…<br/>or also <span style={{color:C.orange}}>block</span><br/>the artery?</T>
    <P s={50} c={C.mute}>Chronic subdural bleed · a 2026 trial in 6 slides</P>
    <div style={{height:560,position:'relative'}}><div style={{position:'absolute',left:-80,top:-40}}><Skull3D width={1100} height={660} blood={1} artery={1} onyx={0.7} orbit={0.2} sway={false} dist={11}/></div></div>
    <T s={70} c={C.orange}>swipe →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <T s={120}>The problem</T>
    <Box bg={C.card}><P>Chronic subdural hematoma = old blood between the brain and its outer cover, mostly in older adults.</P></Box>
    <Box bg={C.card}><P>It often comes back after surgery. One idea: block the <b style={{color:C.orange}}>middle meningeal artery</b> that feeds its membrane.</P></Box>
    <Box bg={C.card}><P>The plug: <b>Onyx</b>, a liquid embolic agent, given by catheter.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <T s={120}>The study</T>
    <P s={44} c={C.mute}>EMMA-Can · JAMA 2026 · randomized · 9 Canadian centers</P>
    <div style={{display:'flex',gap:26}}><Box bg={C.red}><T s={110}>186</T><P>patients analyzed</P></Box><Box bg={C.card}><T s={110}>72</T><P>years, mean age</P></Box></div>
    <Box bg={C.card}><P><b>Everyone:</b> surgical drainage.</P><P><b style={{color:C.orange}}>Half also:</b> artery embolization within 72 h.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={110}>Came back <span style={{color:C.orange}}>with symptoms</span> by 90 days</T>
    <div style={{display:'flex',gap:30}}>
      <Box bg={C.gray} w={440}><T s={150}>28%</T><P s={42}>drain only · 26 of 93</P></Box>
      <Box bg={C.orange} w={440}><T s={150}>4.3%</T><P s={42}>drain + block · 4 of 93</P></Box>
    </div>
    <P s={44}>About 1 in 4 → about 1 in 23. P less than .001.</P>
    <P s={40} c={C.mute}>Any regrowth on CT: 49.5% vs 14%.</P>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={120} c={C.red}>The catch</T>
    <Box bg={C.card}><P><b>Function at 90 days: the same.</b> mRS 0–3 in 95.7% vs 94.6%.</P></Box>
    <Box bg={C.card}><P><b>Deaths: 4 vs 1</b> (block vs drain only). Not significant, none linked to the procedure.</P></Box>
    <Box bg={C.card}><P><b>Only 90 days</b> of follow-up, open-label, 186 patients.</P></Box>
  </Frame>);
  return (<Frame n={6}>
    <T s={130}>You're the <span style={{color:C.orange}}>surgeon</span></T>
    <Box bg={C.card}><T s={80} c={C.yellow}>Comment 1 or 2</T><P s={50}>1 = drain only · 2 = drain + block</P></Box>
    <P s={46}>📌 Save this for your neurosurgery rotation.</P>
    <P s={46}>Send it to the friend who would just drain it.</P>
    <T s={60} c={C.orange}>Follow #NeuroMot for case 2</T>
    <P s={28} c={C.mute}>Shankar JJS, et al. JAMA 2026. doi:10.1001/jama.2026.4910 · For education — not medical advice</P>
  </Frame>);
};
