import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:190,top:800,width:700,background:'#f4f1ea',padding:'18px 18px 0',borderRadius:8,transform:'rotate(-2deg)',boxShadow:'0 30px 70px rgba(0,0,0,.65)'}}>
      <div style={{width:'100%',height:640,overflow:'hidden'}}><Img src={staticFile('gage.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 24%',display:'block'}}/></div>
      <div style={{fontWeight:900,fontSize:46,color:C.bg,textAlign:'center',padding:'8px 0 10px'}}>Phineas Gage · 1848</div>
    </div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #3</div>
    <div style={{position:'absolute',top:70,right:60,background:C.red,fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE</div>
    <div style={{position:'absolute',top:230,left:66,right:40,fontWeight:900,fontSize:176,lineHeight:0.88,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>No longer<br/>the <span style={{color:C.orange}}>same<br/>man?</span></div>
    <div style={{position:'absolute',top:1540,left:0,right:0,display:'flex',justifyContent:'center',gap:20}}>
      <div style={{background:C.green,fontWeight:900,fontSize:64,padding:'6px 30px',borderRadius:14}}>1 = YES</div>
      <div style={{background:C.red,fontWeight:900,fontSize:64,padding:'6px 30px',borderRadius:14}}>2 = NO</div>
    </div>
  </AbsoluteFill>
);
