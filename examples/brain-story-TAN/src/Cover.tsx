import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',blue:'#4FA3FF',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
// Brain Story #4 cover: Tan's real brain in its jar + "one word for 21 years"
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 68%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:250,top:760,width:580,background:'#f4f1ea',padding:'16px 16px 0',borderRadius:8,transform:'rotate(-2deg)',boxShadow:'0 30px 70px rgba(0,0,0,.65)'}}>
      <div style={{width:'100%',height:640,overflow:'hidden'}}><Img src={staticFile('brain1.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 42%',display:'block'}}/></div>
      <div style={{fontWeight:900,fontSize:44,color:C.bg,textAlign:'center',padding:'8px 0 2px'}}>Tan’s real brain · 1861</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:17,color:'#666',textAlign:'center',paddingBottom:8}}>Musée Dupuytren · photo Selbymay, CC BY-SA 4.0</div>
    </div>
    <div style={{position:'absolute',left:690,top:690,background:'#fff',color:C.bg,fontWeight:900,fontSize:120,padding:'10px 40px',borderRadius:50,transform:'rotate(4deg)',boxShadow:'0 10px 0 #0B0B0E'}}>“TAN”</div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #4</div>
    <div style={{position:'absolute',top:70,right:60,background:C.red,fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE</div>
    <div style={{position:'absolute',top:240,left:66,right:40,fontWeight:900,fontSize:168,lineHeight:0.88,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>One word<br/>for <span style={{color:C.orange}}>21 years</span></div>
    <div style={{position:'absolute',top:1530,left:0,right:0,display:'flex',justifyContent:'center',gap:18}}>
      <div style={{background:C.blue,fontWeight:900,fontSize:58,padding:'6px 26px',borderRadius:14}}>1 = LOSE SPEECH</div>
      <div style={{background:C.red,fontWeight:900,fontSize:58,padding:'6px 26px',borderRadius:14}}>2 = LOSE MOVEMENT</div>
    </div>
  </AbsoluteFill>
);
