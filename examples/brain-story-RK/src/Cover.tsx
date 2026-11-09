import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Frontal3D} from './Frontal3D';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:-40,top:1000}}><Frontal3D width={1160} height={920} glow={1} cut={0.4} lobe={0.8} orbit={0.9} sway={false} dist={7.6}/></div>
    <div style={{position:'absolute',right:50,top:560,width:330,background:'#f4f1ea',padding:'12px 12px 0',borderRadius:6,transform:'rotate(4deg)',boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{width:'100%',height:380,overflow:'hidden'}}><Img src={staticFile('rosemary_f.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 40%',display:'block',filter:'grayscale(1)'}}/></div>
      <div style={{fontWeight:900,fontSize:36,color:C.bg,textAlign:'center',padding:'6px 0 8px'}}>Rosemary, 1931</div>
    </div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #2</div>
    <div style={{position:'absolute',top:220,left:66,right:40,fontWeight:900,fontSize:160,lineHeight:0.88,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>Awake while<br/>they cut<br/><span style={{color:C.orange}}>her brain</span></div>
    <div style={{position:'absolute',top:740,left:70,width:560,fontWeight:800,fontSize:52}}>1941 · JFK’s sister, Rosemary</div>
    <div style={{position:'absolute',top:880,left:66,background:'rgba(26,27,32,.85)',border:`5px solid ${C.orange}`,padding:'10px 26px',fontWeight:900,fontSize:62,color:C.orange}}>What did they cut?</div>
    <div style={{position:'absolute',top:1700,right:50,background:C.red,color:'#fff',fontWeight:900,fontSize:44,padding:'8px 22px',borderRadius:14}}>1 = frontal lobe connections · 2 = brainstem</div>
  </AbsoluteFill>
);
