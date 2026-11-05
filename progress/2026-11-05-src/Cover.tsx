import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import {Skull3D} from './Skull3D';
const C={bg:'#1A1B20',bg2:'#25262E',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',text:'#F2F2F4',mute:'#9C9EA8',card:'#2D2F37'};
const H="'Barlow Condensed', sans-serif";
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 62%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:-40,top:960}}><Skull3D width={1160} height={960} blood={1} artery={1} onyx={0.7} orbit={0.2} sway={false} dist={12.5}/></div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46,color:C.text}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px',color:C.text}}>NEURO PAPER #10</div>
    <div style={{position:'absolute',top:220,left:66,right:40,fontWeight:900,fontSize:168,lineHeight:0.88,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>Drain it…<br/>or also <span style={{color:C.orange}}>block</span><br/>the artery?</div>
    <div style={{position:'absolute',top:700,left:70,fontWeight:800,fontSize:52,color:C.text}}>Chronic subdural bleed · 186 patients</div>
    <div style={{position:'absolute',top:790,left:66,background:'rgba(26,27,32,.85)',border:`5px solid ${C.orange}`,padding:'10px 30px',fontWeight:900,fontSize:72,color:C.orange}}>Came back: 28% <span style={{color:C.text}}>vs</span> 4.3%</div>
    <div style={{position:'absolute',top:925,left:70,fontWeight:800,fontSize:40,color:C.mute}}>Shankar · JAMA 2026</div>
    <div style={{position:'absolute',top:1000,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:44,padding:'8px 24px',borderRadius:14}}>YOU'RE THE SURGEON · CASE 1</div>
  </AbsoluteFill>
);
