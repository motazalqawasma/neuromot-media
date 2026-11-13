import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Gage3D} from './Gage3D';
const C={bg:'#1A1B20',card:'#2D2F37',line:'#3A3C45',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4',mute:'#9C9EA8',gray:'#7A7D88'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
const T: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=110,c=C.text,children}) => <div style={{fontFamily:H,fontWeight:900,fontSize:s,lineHeight:0.92,color:c,textTransform:'uppercase'}}>{children}</div>;
const P: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=46,c=C.text,children}) => <div style={{fontFamily:B,fontWeight:600,fontSize:s,lineHeight:1.25,color:c}}>{children}</div>;
const Box: React.FC<{bg:string;children:React.ReactNode;w?:number}> = ({bg,children,w}) => <div style={{background:bg,borderRadius:26,padding:'26px 34px',width:w}}>{children}</div>;
const Ph: React.FC<{src:string;w:number;h:number;cap:string;pos?:string;blur?:boolean}> = ({src,w,h,cap,pos='center',blur=false}) => (<div style={{background:'#f4f1ea',padding:10,borderRadius:6,width:w}}><div style={{width:w-20,height:h,overflow:'hidden'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:pos,display:'block',transform:blur?'scale(1.2)':undefined,filter:blur?'blur(28px) grayscale(0.3)':undefined}}/></div><div style={{fontFamily:B,fontWeight:600,fontSize:20,color:'#555',paddingTop:6}}>{cap}</div></div>);
const Frame: React.FC<{n:number;children:React.ReactNode}> = ({n,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #2b1a16 0%, ${C.bg} 65%)`,padding:'60px 70px 80px',color:C.text}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
      <div style={{display:'flex',gap:14}}>
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>BRAIN STORY #4</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1861</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={140}>Lose speech<br/>or lose <span style={{color:C.orange}}>movement?</span></T>
    <div style={{display:'flex',gap:24,alignItems:'center'}}><Ph src="brain1.jpg" w={400} h={480} cap="Tan’s brain · Musée Dupuytren · Selbymay, CC BY-SA 4.0" pos="50% 45%"/>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <div style={{background:'#4FA3FF',borderRadius:18,padding:'10px 26px',fontFamily:H,fontWeight:900,fontSize:62}}>1 = SPEECH</div>
        <div style={{background:C.red,borderRadius:18,padding:'10px 26px',fontFamily:H,fontWeight:900,fontSize:62}}>2 = MOVEMENT</div>
        <P s={40} c={C.mute}>Paris, 1840 to 1861</P></div></div>
    <T s={66} c={C.orange}>swipe, then vote 1 or 2 →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <T s={120}>One word.<br/>21 years.</T>
    <Box bg={C.card}><P>In 1840 a 30-year-old craftsman in Paris lost his speech. He went into Bicêtre Hospital and stayed there for 21 years.</P></Box>
    <Box bg={C.card}><P>The only syllable he could say was “tan”. So everyone called him Tan.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <T s={120}>He understood</T>
    <Box bg={C.green}><P c="#fff">He understood almost everything said to him. He could read the time on a watch.</P></Box>
    <Box bg={C.card}><P>After about 10 years his right arm, then his right leg, became paralyzed.</P></Box>
    <P s={36} c={C.mute}>Broca, Bull Soc Anthropol Paris 1861</P>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <div style={{display:'flex',alignItems:'center',gap:30}}><T s={110}>April<br/>1861</T><Ph src="broca.jpg" w={360} h={430} cap="Paul Broca · Pierre Petit, about 1860 · public domain" pos="50% 25%"/></div>
    <Box bg={C.card}><P>He met the surgeon Paul Broca. He died a few days later, on 17 April 1861.</P></Box>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={110}>The neurology</T>
    <div style={{height:400,position:'relative'}}><div style={{position:'absolute',left:40,top:-50}}><Gage3D width={860} height={500} lobe={0.2} spot={1} path={0}/></div></div>
    <Box bg={C.card}><P>Broca found the damage in the LEFT frontal lobe. Today we call it Broca’s area: speech output.</P></Box>
    <P s={40} c={C.yellow}>Save this for your neuro exam.</P>
  </Frame>);
  return (<Frame n={6}>
    <T s={110}>The twist</T>
    <Box bg={C.card}><P>For 150 years nobody knew his name. In 2013 the Polish historian Cezary Domański found it: Louis Victor Leborgne, born 1809 in Moret, France.</P></Box>
    <Box bg={C.card}><P s={50}>Lose speech or lose movement?<br/><b style={{color:C.yellow}}>1 = speech · 2 = movement</b></P></Box>
    <P s={36} c={C.mute}>Send this to the friend who mixes up Broca and Wernicke.</P>
    <P s={24} c={C.mute}>Sources: Broca 1861; Dronkers NF et al. Brain 2007;130:1432–41; Domanski CW. J Hist Neurosci 2013;22:47–52. For education, not medical advice.</P>
  </Frame>);
};
