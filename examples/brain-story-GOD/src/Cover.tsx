import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
const B="'Barlow', sans-serif";
// Brain Story #9: Gray's 726 brain (public domain) with the motor strip glowing + red spot; Godlee photo print (Wellcome, CC BY 4.0)
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 55%, #2A2C34 0%, ${C.bg} 70%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',top:66,left:66,fontWeight:800,fontSize:46,color:'#9A9CA6'}}>#NeuroMot</div>
    <div style={{position:'absolute',top:130,left:62,border:`4px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #9</div>
    <div style={{position:'absolute',top:66,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE · 1884</div>
    <div style={{position:'absolute',top:240,left:62,right:62,fontWeight:900,fontSize:150,lineHeight:0.86,textTransform:'uppercase',textShadow:'0 8px 24px rgba(0,0,0,.6)'}}>
      1884.<br/><span style={{color:C.orange}}>No scans.</span></div>
    <div style={{position:'absolute',top:520,left:66,width:720,fontFamily:B,fontWeight:600,fontSize:44,lineHeight:1.2,color:'#D6D7DC'}}>
      They found the tumour from a <span style={{color:C.yellow}}>twitch</span>.</div>
    <Img src={staticFile('brain_glow.png')} style={{position:'absolute',left:-30,top:700,width:1140,height:1140*810/1400}}/>
    <div style={{position:'absolute',left:688,top:720,width:290,height:290*1251/960,transform:'rotate(4deg)',background:'#fff',padding:'12px 12px 46px',boxShadow:'0 20px 50px rgba(0,0,0,.7)'}}>
      <Img src={staticFile('godlee.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(1) contrast(1.05)'}}/>
      <div style={{position:'absolute',bottom:6,left:0,right:0,textAlign:'center',color:'#222',fontWeight:900,fontSize:30}}>RICKMAN GODLEE</div>
    </div>
    <div style={{position:'absolute',left:300,top:1020,background:C.red,color:'#fff',fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:8}}>MOTOR STRIP</div>
    <div style={{position:'absolute',top:1440,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{border:`5px solid ${C.orange}`,background:'rgba(26,27,32,.92)',color:C.text,borderRadius:18,padding:'10px 30px',fontWeight:900,fontSize:52}}>Doctor's eyes <span style={{color:C.green}}>1</span> or machine <span style={{color:C.red}}>2</span>?</div>
    </div>
  </AbsoluteFill>
);
