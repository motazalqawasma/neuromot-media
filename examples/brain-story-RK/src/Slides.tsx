import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Frontal3D} from './Frontal3D';
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
        <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10}}>BRAIN STORY #2</div>
        <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1941</div>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:36}}>{children}</div>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1}>
    <T s={140}>Awake while they<br/><span style={{color:C.orange}}>cut her brain</span></T>
    <P s={48} c={C.mute}>The true story of Rosemary Kennedy, 1941, in 6 slides</P>
    <div style={{display:'flex',gap:24,alignItems:'center'}}><Ph src="rosemary_f.jpg" w={380} h={420} cap="Rosemary Kennedy, 1931 · R. Sears / JFK Library · public domain" />
      <div style={{height:420,width:520,position:'relative'}}><div style={{position:'absolute',left:-120,top:-60}}><Frontal3D width={760} height={560} glow={1} cut={0.4} lobe={0.8} orbit={0.9} sway={false} dist={7.6}/></div></div></div>
    <T s={70} c={C.orange}>swipe →</T>
  </Frame>);
  if(f===1) return (<Frame n={2}>
    <T s={120}>Who was she?</T>
    <Box bg={C.card}><P>Rosemary was born in 1918, the third of 9 Kennedy children. Her brother John F. Kennedy later became president.</P></Box>
    <Box bg={C.card}><P>She learned more slowly than her brothers and sisters. Today she would get support. In the 1930s, families often hid it.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3}>
    <div style={{display:'flex',alignItems:'center',gap:30}}><T s={110}>November<br/>1941</T><Ph src="fw1941.jpg" w={330} h={330} cap="Freeman & Watts, 1941 · public domain"/></div>
    <Box bg={C.card}><P>At 23, her father arranged a new operation, a prefrontal lobotomy. Her mother was not told.</P></Box>
    <Box bg={C.card}><P>Walter Freeman (neurologist) and James Watts (neurosurgeon) went in through the top of her head while she was awake.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={120}>What they cut</T>
    <Box bg={C.red}><P c="#fff">The connections between the frontal lobe and the deep brain (thalamus).</P></Box>
    <Box bg={C.card}><P>The frontal lobe helps us plan, decide and start our words. While they cut, she was asked to pray and sing. Then her words stopped.</P></Box>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={120}>After</T>
    <Box bg={C.card}><P>She could not walk or speak clearly. She later walked again with a limp, but never spoke clearly again.</P></Box>
    <div style={{display:'flex',alignItems:'center',gap:30}}><Ph src="eunice_f.jpg" w={300} h={330} cap="Eunice Kennedy Shriver, 1982 · public domain" pos="50% 25%"/>
      <Box bg={C.card} w={560}><P s={40}>She lived 63 more years, mostly in a home in Wisconsin, and died in 2005 at 86. Her sister Eunice founded the Special Olympics in 1968.</P></Box></div>
  </Frame>);
  return (<Frame n={6}>
    <T s={130}>Your turn</T>
    <Box bg={C.card}><P s={54}>What did they cut?<br/><b style={{color:C.yellow}}>1 = frontal lobe connections · 2 = the brainstem</b></P></Box>
    <P s={44} c={C.mute}>Comment your answer. I reply to every one.</P>
    <P s={28} c={C.mute}>Sources: Larson KC. Rosemary: The Hidden Kennedy Daughter (2015). Freeman W, Watts JW. Psychosurgery (1942). Photos: Wikimedia Commons, public domain.</P>
    <T s={70} c={C.orange}>Follow for Brain Story #3</T>
  </Frame>);
};
