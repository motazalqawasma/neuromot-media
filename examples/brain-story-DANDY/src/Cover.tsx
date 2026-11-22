import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
const B="'Barlow', sans-serif";
// Brain Story #10: Gemini zoom keyframe 3 (X-ray with black air-filled ventricles) as background; Dandy portrait (Commons, CC BY-SA 4.0 Ericneuro)
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:C.bg,fontFamily:H,color:C.text}}>
    <Img src={staticFile('cover_bg.jpg')} style={{position:'absolute',left:0,top:0,width:1080,height:1920,objectFit:'cover',objectPosition:'50% 30%'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(26,27,32,.92) 0%, rgba(26,27,32,.55) 30%, rgba(26,27,32,0) 48%, rgba(26,27,32,0) 62%, rgba(26,27,32,.85) 82%, rgba(26,27,32,1) 100%)'}}/>
    <div style={{position:'absolute',top:66,left:66,fontWeight:800,fontSize:46,color:'#B4B6C0'}}>#NeuroMot</div>
    <div style={{position:'absolute',top:130,left:62,border:`4px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:46,padding:'2px 18px',background:'rgba(26,27,32,.6)'}}>BRAIN STORY #10</div>
    <div style={{position:'absolute',top:66,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE · 1918</div>
    <div style={{position:'absolute',top:236,left:62,right:62,fontWeight:900,fontSize:168,lineHeight:0.86,textTransform:'uppercase',textShadow:'0 8px 28px rgba(0,0,0,.85)'}}>
      <span style={{color:C.orange}}>Air.</span><br/>In the brain.</div>
    <div style={{position:'absolute',top:560,left:66,width:900,fontFamily:B,fontWeight:600,fontSize:44,lineHeight:1.2,color:'#E4E5EA',textShadow:'0 4px 14px rgba(0,0,0,.9)'}}>
      The first way to <span style={{color:C.yellow}}>see</span> a brain on X‑ray.</div>
    <div style={{position:'absolute',left:96,top:760,background:C.red,color:'#fff',fontWeight:900,fontSize:36,padding:'4px 16px',borderRadius:8,boxShadow:'0 6px 18px rgba(0,0,0,.6)'}}>AIR = BLACK</div>
    <div style={{position:'absolute',left:770,top:1010,width:250,height:250*674/579,transform:'rotate(4deg)',background:'#fff',padding:'10px 10px 44px',boxShadow:'0 20px 50px rgba(0,0,0,.75)'}}>
      <Img src={staticFile('dandy.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(1) contrast(1.05)'}}/>
      <div style={{position:'absolute',bottom:4,left:0,right:0,textAlign:'center',color:'#222',fontWeight:900,fontSize:28}}>WALTER DANDY</div>
    </div>
    <div style={{position:'absolute',top:1400,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{border:`5px solid ${C.orange}`,background:'rgba(26,27,32,.92)',color:C.text,borderRadius:18,padding:'10px 30px',fontWeight:900,fontSize:54}}>X‑ray <span style={{color:C.green}}>1</span> or MRI <span style={{color:C.red}}>2</span>?</div>
    </div>
  </AbsoluteFill>
);
