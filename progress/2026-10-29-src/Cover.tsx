import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import {Brain3D} from './Brain3D';
const C={bg:'#1A1B20',bg2:'#25262E',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',text:'#F2F2F4',mute:'#9C9EA8',card:'#2D2F37'};
const H="'Barlow Condensed', sans-serif";
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 52%, #3a1c1c 0%, ${C.bg2} 35%, ${C.bg} 75%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',top:60,left:70,fontWeight:800,fontSize:44,color:C.mute}}>#NeuroMot</div>
    <div style={{position:'absolute',top:116,left:70,border:`3px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:36,padding:'2px 16px',borderRadius:10,letterSpacing:1}}>NEURO PAPER #7</div>
    <div style={{position:'absolute',top:54,right:70,background:C.red,color:'#fff',fontWeight:800,fontSize:34,padding:'8px 22px',borderRadius:30,letterSpacing:2}}>HEADACHE · NEUROLOGY 2026</div>
    <div style={{position:'absolute',top:290,left:0,right:0,textAlign:'center',fontWeight:900,fontSize:140,lineHeight:0.92,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>
      Are your painkillers<br/><span style={{color:C.orange}}>causing</span> your<br/>headaches?</div>
    <div style={{position:'absolute',top:800,left:0}}><Brain3D width={1080} height={600} zoom={1.15} orbit={0}/></div>
    <div style={{position:'absolute',top:1370,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{background:C.card,border:`5px solid ${C.orange}`,borderRadius:26,padding:'14px 40px',textAlign:'center',boxShadow:'0 14px 0 #0B0B0E'}}>
        <div style={{fontWeight:900,fontSize:104,color:C.orange,lineHeight:1}}>37.8% <span style={{color:C.mute,fontSize:64}}>vs</span> 18.1%</div>
        <div style={{fontWeight:800,fontSize:44,color:C.text}}>lost both diagnoses · 1 drip vs salt water</div>
      </div>
    </div>
    <div style={{position:'absolute',top:1580,left:0,right:0,textAlign:'center',fontWeight:800,fontSize:40,color:C.mute,letterSpacing:3}}>JENSEN ET AL. · NEUROLOGY 2026</div>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:18,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
  </AbsoluteFill>
);
