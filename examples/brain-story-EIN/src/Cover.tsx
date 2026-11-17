import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
const B="'Barlow', sans-serif";
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:C.bg,fontFamily:H,color:C.text}}>
    <Img src={staticFile('c1_first.jpg')} style={{position:'absolute',left:0,top:330,width:1080,height:1920,objectFit:'cover',filter:'brightness(0.8)'}}/>
    <AbsoluteFill style={{background:'linear-gradient(180deg, #1A1B20 0%, #1A1B20 24%, rgba(26,27,32,.35) 46%, rgba(26,27,32,0) 62%, rgba(26,27,32,.85) 92%)'}}/>
    <div style={{position:'absolute',top:70,left:70,fontWeight:800,fontSize:46}}>#NeuroMot</div>
    <div style={{position:'absolute',top:134,left:66,border:`4px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #7</div>
    <div style={{position:'absolute',top:70,right:60,background:C.red,fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE · 1955</div>
    <div style={{position:'absolute',top:240,left:66,right:40,fontWeight:900,fontSize:178,lineHeight:0.88,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.5)'}}>
      <span style={{color:C.orange}}>Einstein’s</span><br/>brain.<br/>kept 43 years.</div>
    <div style={{position:'absolute',top:885,left:66,fontFamily:B,fontWeight:600,fontSize:46,color:C.text,textShadow:'2px 2px 0 rgba(0,0,0,.6)'}}>He asked to be cremated. One doctor kept it.</div>
    <div style={{position:'absolute',top:1440,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{border:`5px solid ${C.orange}`,background:'rgba(26,27,32,.85)',borderRadius:18,padding:'10px 34px',fontWeight:900,fontSize:56}}>What makes a genius? <span style={{color:C.green}}>1</span> or <span style={{color:C.red}}>2</span></div>
    </div>
  </AbsoluteFill>
);
