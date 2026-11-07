import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Hippo3D} from './Hippo3D';
const C={bg:'#1A1B20',card:'#2D2F37',line:'#3A3C45',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4',mute:'#9C9EA8',gray:'#7A7D88'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
const T: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=110,c=C.text,children}) => <div style={{fontFamily:H,fontWeight:900,fontSize:s,lineHeight:0.92,color:c,textTransform:'uppercase'}}>{children}</div>;
const P: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=46,c=C.text,children}) => <div style={{fontFamily:B,fontWeight:600,fontSize:s,lineHeight:1.25,color:c}}>{children}</div>;
const Box: React.FC<{bg:string;children:React.ReactNode;w?:number}> = ({bg,children,w}) => <div style={{background:bg,borderRadius:26,padding:'26px 34px',width:w}}>{children}</div>;
const Ph: React.FC<{src:string;w:number;h:number;cap:string;pos?:string}> = ({src,w,h,cap,pos='center'}) => (<div style={{background:'#f4f1ea',padding:10,borderRadius:6,width:w}}><Img src={staticFile(src)} style={{width:w-20,height:h,objectFit:'cover',objectPosition:pos,display:'block'}}/><div style={{fontFamily:B,fontWeight:600,fontSize:20,color:'#555',paddingTop:6}}>{cap}</div></div>);
const Frame: React.FC<{n:number;children:React.ReactNode}> = ({n,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #2b1a16 0%, ${C.bg} 65%)`,padding:'70px 70px 90px',color:C.text}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
      <div style={{display:'flex',gap:14}}>
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>BRAIN STORY #1</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1953</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={150}>He could never<br/><span style={{color:C.orange}}>remember</span> you</T>
    <P s={50} c={C.mute}>The true story of patient H.M. in 6 slides</P>
    <div style={{height:560,position:'relative'}}><div style={{position:'absolute',left:-80,top:-40}}><Hippo3D width={1100} height={660} glow={1} gone={0} orbit={0.6} sway={false} dist={7.8}/></div></div>
    <T s={70} c={C.orange}>swipe →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <div style={{display:'flex',alignItems:'center',gap:30}}><T s={120}>1953</T>
      <Ph src="hartford.jpg" w={330} h={200} cap="Hartford Hospital · public domain"/><Ph src="scoville.jpg" w={250} h={200} cap="Dr. W. Scoville · public domain" pos="50% 20%"/></div>
    <Box bg={C.card}><P>Henry Molaison was 27. He had severe epilepsy, and medicine could not control his seizures.</P></Box>
    <Box bg={C.card}><P>Surgeon William Scoville removed tissue from the inner part of <b style={{color:C.orange}}>both temporal lobes</b>, including most of both hippocampi.</P></Box>
    <Box bg={C.card}><P>His seizures got better. His personality and IQ stayed the same.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <T s={120}>What he lost</T>
    <Box bg={C.red}><P c="#fff">He could not form new long-term memories of facts and events.</P></Box>
    <Box bg={C.card}><P>Meet him, leave the room, come back, and he would meet you for the first time. Again.</P></Box>
    <Box bg={C.card}><P>Old memories from long before the surgery were mostly still there.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <div style={{display:'flex',alignItems:'center',gap:30}}><T s={110}>The mirror<br/>test</T><Ph src="milner.jpg" w={300} h={300} cap="Brenda Milner, 2014 · Per Henning/NTNU · CC BY 2.0" pos="50% 15%"/></div>
    <Box bg={C.card}><P>Brenda Milner, Montreal Neurological Institute, asked him to trace a star while looking only at its reflection in a mirror.</P></Box>
    <Box bg={C.green}><P c="#0f2a19">Each day he got better at it.</P></Box>
    <Box bg={C.red}><P c="#fff">Each day he said he had never done the task before.</P></Box>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={120}>The lesson</T>
    <Box bg={C.card}><P><b style={{color:C.yellow}}>Remembering what happened</b> needs the hippocampus and nearby medial temporal areas.</P></Box>
    <Box bg={C.card}><P><b style={{color:C.green}}>Learning how to do something</b> uses other brain systems, so his skills could still grow.</P></Box>
    <Box bg={C.card}><P>He died in 2008. His brain was cut into 2,401 slices for study, and his real name was made public.</P></Box>
  </Frame>);
  return (<Frame n={6}>
    <T s={130}>Your turn</T>
    <Box bg={C.card}><P s={54}>Which part did they remove?<br/><b style={{color:C.yellow}}>1 = hippocampus · 2 = frontal lobe</b></P></Box>
    <P s={44} c={C.mute}>Comment your answer. I reply to every one.</P>
    <P s={30} c={C.mute}>Scoville WB, Milner B. Loss of recent memory after bilateral hippocampal lesions. J Neurol Neurosurg Psychiatry 1957;20(1):11-21. doi:10.1136/jnnp.20.1.11</P>
    <T s={70} c={C.orange}>Follow for Brain Story #2</T>
  </Frame>);
};
