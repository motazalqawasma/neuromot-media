import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
const B="'Barlow', sans-serif";
// Brain Story #11: Gemini keyframe 3 (glass head, brain arteries filled white like an angiogram) as background; Moniz portrait (Commons File:Moniz.jpg, public domain)
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:C.bg,fontFamily:H,color:C.text}}>
    <Img src={staticFile('cover_bg.jpg')} style={{position:'absolute',left:0,top:0,width:1080,height:1920,objectFit:'cover',objectPosition:'50% 40%'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(26,27,32,.93) 0%, rgba(26,27,32,.6) 30%, rgba(26,27,32,0) 46%, rgba(26,27,32,0) 62%, rgba(26,27,32,.85) 80%, rgba(26,27,32,1) 100%)'}}/>
    <div style={{position:'absolute',top:66,left:66,fontWeight:800,fontSize:46,color:'#B4B6C0'}}>#NeuroMot</div>
    <div style={{position:'absolute',top:130,left:62,border:`4px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:46,padding:'2px 18px',background:'rgba(26,27,32,.6)'}}>BRAIN STORY #11</div>
    <div style={{position:'absolute',top:66,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE · 1927</div>
    <div style={{position:'absolute',top:236,left:62,right:62,fontWeight:900,fontSize:168,lineHeight:0.86,textTransform:'uppercase',textShadow:'0 8px 28px rgba(0,0,0,.85)'}}>
      <span style={{color:C.orange}}>Dye.</span><br/>In the brain.</div>
    <div style={{position:'absolute',top:560,left:66,width:920,fontFamily:B,fontWeight:600,fontSize:46,lineHeight:1.2,color:'#E4E5EA',textShadow:'0 4px 14px rgba(0,0,0,.9)'}}>
      Then a <span style={{color:C.yellow}}>Nobel</span>… for something else.</div>
    <div style={{position:'absolute',left:96,top:770,background:C.red,color:'#fff',fontWeight:900,fontSize:36,padding:'4px 16px',borderRadius:8,boxShadow:'0 6px 18px rgba(0,0,0,.6)'}}>ARTERIES = WHITE</div>
    <div style={{position:'absolute',left:770,top:1000,width:250,height:250*891/638,transform:'rotate(4deg)',background:'#fff',padding:'10px 10px 44px',boxShadow:'0 20px 50px rgba(0,0,0,.75)'}}>
      <Img src={staticFile('moniz.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(1) contrast(1.05)'}}/>
      <div style={{position:'absolute',bottom:4,left:0,right:0,textAlign:'center',color:'#222',fontWeight:900,fontSize:28}}>EGAS MONIZ</div>
    </div>
    <div style={{position:'absolute',top:1400,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{border:`5px solid ${C.orange}`,background:'rgba(26,27,32,.92)',color:C.text,borderRadius:18,padding:'10px 30px',fontWeight:900,fontSize:54}}>NOBEL 1949: <span style={{color:C.red}}>FOR WHAT?</span></div>
    </div>
  </AbsoluteFill>
);
