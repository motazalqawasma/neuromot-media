import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
import {Split3D} from './Split3D';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',blue:'#4FA3FF',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
// Brain Story #6 cover: split brain 3D + "two minds in one head?"
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 58%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:40,top:640}}><Split3D width={1000} height={720} bridge={1} cut={0.6} left={0.9} right={0.9} dist={8.6}/></div>
    <div style={{position:'absolute',left:70,top:1300,fontWeight:900,fontSize:56,color:C.blue}}>LEFT HALF</div>
    <div style={{position:'absolute',right:70,top:1300,fontWeight:900,fontSize:56,color:C.orange}}>RIGHT HALF</div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #6</div>
    <div style={{position:'absolute',top:70,right:60,background:C.red,fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE STORY · 1962</div>
    <div style={{position:'absolute',top:250,left:66,right:40,fontWeight:900,fontSize:160,lineHeight:0.9,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>Two minds<br/><span style={{color:C.orange}}>in one head?</span></div>
    <div style={{position:'absolute',top:1440,left:0,right:0,textAlign:'center',fontWeight:900,fontSize:60}}>Your phone is in which hand?</div>
    <div style={{position:'absolute',top:1525,left:0,right:0,display:'flex',justifyContent:'center',gap:18}}>
      <div style={{background:C.blue,fontWeight:900,fontSize:64,padding:'6px 30px',borderRadius:14}}>1 = LEFT</div>
      <div style={{background:C.red,fontWeight:900,fontSize:64,padding:'6px 30px',borderRadius:14}}>2 = RIGHT</div>
    </div>
    <div style={{position:'absolute',top:1640,left:0,right:0,textAlign:'center',fontFamily:B,fontWeight:600,fontSize:26,color:'#aaa'}}>Gazzaniga, Bogen & Sperry · PNAS 1962</div>
  </AbsoluteFill>
);
