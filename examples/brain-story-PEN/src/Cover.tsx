import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',blue:'#4FA3FF',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
// Brain Story #5 cover: Penfield's real photo + "stay awake for brain surgery?"
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 66%, #3a1d14 0%, ${C.bg} 62%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',left:260,top:800,width:560,background:'#f4f1ea',padding:'16px 16px 0',borderRadius:8,transform:'rotate(-2deg)',boxShadow:'0 30px 70px rgba(0,0,0,.65)'}}>
      <div style={{width:'100%',height:600,overflow:'hidden'}}><Img src={staticFile('penfield.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 30%',display:'block',filter:'grayscale(1) contrast(1.05)'}}/></div>
      <div style={{fontWeight:900,fontSize:44,color:C.bg,textAlign:'center',padding:'8px 0 2px'}}>Dr. Wilder Penfield</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:17,color:'#666',textAlign:'center',paddingBottom:8}}>US National Library of Medicine · public domain</div>
    </div>
    <div style={{position:'absolute',left:640,top:730,background:'#fff',color:C.bg,fontWeight:900,fontSize:84,padding:'10px 34px',borderRadius:50,transform:'rotate(4deg)',boxShadow:'0 10px 0 #0B0B0E'}}>NO PAIN?</div>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #5</div>
    <div style={{position:'absolute',top:70,right:60,background:C.red,fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE STORY</div>
    <div style={{position:'absolute',top:240,left:66,right:40,fontWeight:900,fontSize:150,lineHeight:0.9,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.45)'}}>Awake for<br/>your <span style={{color:C.orange}}>brain surgery?</span></div>
    <div style={{position:'absolute',top:1520,left:0,right:0,display:'flex',justifyContent:'center',gap:18}}>
      <div style={{background:C.blue,fontWeight:900,fontSize:64,padding:'6px 30px',borderRadius:14}}>1 = YES</div>
      <div style={{background:C.red,fontWeight:900,fontSize:64,padding:'6px 30px',borderRadius:14}}>2 = NO WAY</div>
    </div>
  </AbsoluteFill>
);
