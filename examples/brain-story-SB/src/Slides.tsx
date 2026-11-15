import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Split3D} from './Split3D';
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
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>BRAIN STORY #6</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE STORY · 1962</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
const Hand: React.FC<{n:string;l:string;c:string}> = ({n,l,c}) => <div style={{background:c,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:66,color:'#fff'}}>{n} = {l}</div>;
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={130}>Your phone is in<br/><span style={{color:C.orange}}>which hand?</span></T>
    <div style={{display:'flex',gap:30,alignItems:'center'}}>
      <Ph src="gray_above.jpg" w={420} h={460} cap="corpus callosum from above · Gray’s Anatomy 1918, public domain"/>
      <div style={{display:'flex',flexDirection:'column',gap:22}}><Hand n="1" l="LEFT" c="#4FA3FF"/><Hand n="2" l="RIGHT" c={C.red}/><P s={38} c={C.mute}>no wrong answer</P></div></div>
    <T s={66} c={C.orange}>swipe: why it matters →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <T s={120}>Los Angeles,<br/><span style={{color:C.orange}}>1962</span></T>
    <Box bg={C.card}><P>A WWII veteran known as W.J. had seizures that nothing could stop.</P></Box>
    <Ph src="gray_sagittal.jpg" w={520} h={300} cap="the corpus callosum · Gray’s Anatomy 1918, public domain" pos="50% 35%"/>
    <Box bg={C.card}><P s={42}>Surgeons Philip Vogel and Joseph Bogen cut the bridge between his two brain halves: the corpus callosum, about 200 million nerve fibers.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <T s={120}>He seemed normal</T>
    <Box bg={C.card}><P>The seizures calmed down. In everyday life he looked completely normal.</P></Box>
    <div style={{display:'flex',gap:26,alignItems:'center'}}><Ph src="gazzaniga.jpg" w={300} h={340} cap="Michael Gazzaniga · via Wikipedia" pos="50% 30%"/>
    <Box bg={C.orange} w={560}><P s={42} c="#fff">Then Michael Gazzaniga, a young scientist in Roger Sperry’s lab at Caltech, flashed pictures to one brain half at a time.</P></Box></div>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={110}>“I saw nothing”</T>
    <Box bg={C.card}><P>Pictures sent to the RIGHT half: he said he saw nothing.</P></Box>
    <Box bg={C.card}><P>But his LEFT hand pointed at the right answer anyway. His left hand knew something his mouth didn’t.</P></Box>
    <P s={36} c={C.mute}>Gazzaniga, Bogen & Sperry, PNAS 1962</P>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={110}>Exam classic</T>
    <Box bg={C.card}><P s={48}>Each hand is run by the <b style={{color:C.orange}}>OPPOSITE</b> brain half.</P></Box>
    <Box bg={C.card}><P s={48}>Speech usually lives in the <b style={{color:'#4FA3FF'}}>LEFT</b> half, so the right half “saw” but could not say it.</P></Box>
    <div style={{display:'flex',gap:24,alignItems:'center'}}><Ph src="sperry.jpg" w={220} h={250} cap="Roger Sperry · via Wikipedia" pos="50% 25%"/>
    <Box bg={C.red} w={640}><P s={42} c="#fff">1981: Roger Sperry won the Nobel Prize for this work on the two brain halves.</P></Box></div>
    <P s={40} c={C.yellow}>Save this for your neuro exam.</P>
  </Frame>);
  return (<Frame n={6}>
    <T s={110}>Your turn</T>
    <Box bg={C.card}><P s={52}>Which hand is holding your phone right now?<br/><b style={{color:C.yellow}}>1 = left · 2 = right</b></P></Box>
    <P s={40} c={C.text}>Send this to your left-handed friend.</P>
    <P s={24} c={C.mute}>Source: Gazzaniga MS, Bogen JE, Sperry RW. Some functional effects of sectioning the cerebral commissures in man. PNAS 1962;48(10):1765–1769, doi:10.1073/pnas.48.10.1765. Wolman, Nature 2012; nobelprize.org. Photos: Gray’s Anatomy 1918 (public domain); Gazzaniga and Sperry via Wikipedia, used for education. For education, not medical advice.</P>
  </Frame>);
};
