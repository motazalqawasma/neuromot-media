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
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #2b1a16 0%, ${C.bg} 65%)`,padding:'70px 70px 90px',color:C.text}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
      <div style={{display:'flex',gap:14}}>
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>BRAIN STORY #3</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1848</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={150}>Same man<br/><span style={{color:C.orange}}>or not?</span></T>
    <div style={{display:'flex',gap:24,alignItems:'center'}}><Ph src="gage.jpg" w={420} h={520} cap="Phineas Gage · Gage family collection · public domain" pos="50% 22%"/>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <div style={{background:C.green,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:76}}>1 = YES</div>
        <div style={{background:C.red,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:76}}>2 = NO</div>
        <P s={40} c={C.mute}>Vermont, 1848</P></div></div>
    <T s={70} c={C.orange}>swipe, then vote 1 or 2 →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <T s={120}>13 Sep 1848</T>
    <Box bg={C.card}><P>Phineas Gage was a railroad foreman near Cavendish, Vermont. He packed blasting powder into rock with an iron rod.</P></Box>
    <Box bg={C.card}><P>The powder exploded. The rod, 3 ft 7 in (1.1 m) long and about 13 pounds, went in under his left cheekbone and out through the top of his head.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <div style={{display:'flex',alignItems:'center',gap:30}}><T s={120}>He<br/>survived</T><Ph src="ironskull.jpg" w={330} h={470} cap="the iron and his skull · J.B.S. Jackson 1870 · public domain" pos="50% 100%"/></div>
    <Box bg={C.card}><P>He may not even have lost consciousness. His doctor, John Martyn Harlow, treated him in Cavendish.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={120}>But he changed</T>
    <Box bg={C.green}><P c="#fff">Before: careful, a great planner.</P></Box>
    <Box bg={C.red}><P c="#fff">After: rude, impatient, full of plans he never finished.</P></Box>
    <P s={44} c={C.mute}>His friends said he was “no longer Gage” (Harlow, 1868).</P>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={110}>The neurology</T>
    <div style={{height:430,position:'relative'}}><div style={{position:'absolute',left:40,top:-40}}><Gage3D width={860} height={520} lobe={1} dark={1} path={1}/></div></div>
    <Box bg={C.card}><P>The iron destroyed part of his LEFT frontal lobe: the part that plans and holds you back.</P></Box>
    <P s={40} c={C.yellow}>📌 Save this. It’s on every neuro exam.</P>
  </Frame>);
  return (<Frame n={6}>
    <T s={110}>The twist</T>
    <Box bg={C.card}><P>Later he drove stagecoaches in Valparaíso, Chile, for about 7 years. A job that needs planning.</P></Box>
    <Box bg={C.card}><P s={54}>Was he still the same man?<br/><b style={{color:C.yellow}}>1 = yes · 2 = no</b></P></Box>
    <P s={40} c={C.mute}>Send this to your study partner and see if they agree.</P>
    <P s={26} c={C.mute}>Sources: Harlow JM, Publ Mass Med Soc 1868;2:327–347. Macmillan M, An Odd Kind of Fame (2000). Photos: Wikimedia Commons, public domain.</P>
  </Frame>);
};
