import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import {Hippo3D} from './Hippo3D';
const C={bg:'#1A1B20',bg2:'#25262E',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',text:'#F2F2F4',mute:'#9C9EA8',card:'#2D2F37'};
const H="'Barlow Condensed', sans-serif";
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 66%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:-40,top:1010}}><Hippo3D width={1160} height={980} glow={1} gone={0} orbit={0.6} sway={false} dist={8.2}/></div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46,color:C.text}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px',color:C.text}}>BRAIN STORY #1</div>
    <div style={{position:'absolute',top:220,left:66,right:40,fontWeight:900,fontSize:176,lineHeight:0.88,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>He could<br/>never <span style={{color:C.orange}}>remember</span><br/>you</div>
    <div style={{position:'absolute',top:860,left:70,fontWeight:800,fontSize:56,color:C.text}}>1953 · the patient called H.M.</div>
    <div style={{position:'absolute',top:950,left:66,background:'rgba(26,27,32,.85)',border:`5px solid ${C.orange}`,padding:'10px 30px',fontWeight:900,fontSize:68,color:C.orange}}>Which part did they remove?</div>
    <div style={{position:'absolute',top:1720,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:48,padding:'8px 26px',borderRadius:14}}>1 = hippocampus · 2 = frontal lobe</div>
  </AbsoluteFill>
);
