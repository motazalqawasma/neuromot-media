import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Pen3D} from './Pen3D';
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
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>BRAIN STORY #5</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE STORY · 1930s</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={130}>Awake for your<br/><span style={{color:C.orange}}>brain surgery?</span></T>
    <div style={{display:'flex',gap:24,alignItems:'center'}}><Ph src="penfield.jpg" w={400} h={480} cap="Dr. Wilder Penfield · US NLM, public domain" pos="50% 30%"/>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <div style={{background:'#4FA3FF',borderRadius:18,padding:'10px 26px',fontFamily:H,fontWeight:900,fontSize:62}}>1 = YES</div>
        <div style={{background:C.red,borderRadius:18,padding:'10px 26px',fontFamily:H,fontWeight:900,fontSize:62}}>2 = NO WAY</div>
        <P s={40} c={C.mute}>Montreal, 1930s</P></div></div>
    <T s={66} c={C.orange}>swipe, then vote 1 or 2 →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <T s={120}>Awake.<br/>On purpose.</T>
    <Box bg={C.card}><P>Neurosurgeon Wilder Penfield operated on patients who were awake. Only the scalp was numbed with local anesthetic.</P></Box>
    <Box bg={C.card}><P>Brain tissue itself has no pain sensors, so the patient could talk to the surgeon during the operation.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <T s={120}>Why?</T>
    <Box bg={C.card}><P>His patients had seizures that no drug could stop. He had to find the exact spot where each seizure started.</P></Box>
    <Box bg={C.orange}><P c="#fff">So he touched the brain with a tiny electric probe and asked: “What do you feel?”</P></Box>
    <P s={36} c={C.mute}>The “Montreal procedure”, Montreal Neurological Institute (founded 1934)</P>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={110}>What they felt</T>
    <Box bg={C.card}><P>A hand twitched. A lip tingled.</P></Box>
    <Box bg={C.card}><P>A few patients heard music or voices. Under 5% relived an old memory.</P></Box>
    <P s={36} c={C.mute}>Penfield & Perot, Brain 1963</P>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <div style={{display:'flex',alignItems:'center',gap:30}}><T s={100}>The<br/>homunculus<br/><span style={{color:C.orange}}>1937</span></T><Ph src="homun.png" w={430} h={420} cap="OpenStax / Wikimedia Commons, CC BY 3.0"/></div>
    <Box bg={C.card}><P>Spot by spot he drew a map of the body on the brain: giant hands, giant lips, tiny legs.</P></Box>
    <Box bg={C.card}><P s={42}><b style={{color:C.orange}}>Motor strip</b>: in front of the central sulcus. <b style={{color:'#4FA3FF'}}>Sensory strip</b>: right behind it.</P></Box>
    <P s={40} c={C.yellow}>Save this for your neuro exam.</P>
  </Frame>);
  return (<Frame n={6}>
    <T s={110}>Your turn</T>
    <Box bg={C.card}><P s={52}>Would you stay awake for your own brain surgery?<br/><b style={{color:C.yellow}}>1 = yes · 2 = no way</b></P></Box>
    <P s={40} c={C.text}>Send this to the friend who faints at a blood test.</P>
    <P s={24} c={C.mute}>Source: Penfield W, Boldrey E. Brain 1937;60(4):389–443, doi:10.1093/brain/60.4.389. Penfield W, Perot P. Brain 1963;86:595–696. For education, not medical advice.</P>
  </Frame>);
};
