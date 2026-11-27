import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
const B="'Barlow', sans-serif";
// Brain Story #12: Harvey Cushing portrait (Commons File:HarveyCushing.JPG, public domain) as background.
// No Gemini keyframe this time (built-in browser lost on the STEP 1 night).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:C.bg,fontFamily:H,color:C.text}}>
    <Img src={staticFile('cushing.jpg')} style={{position:'absolute',left:-120,top:520,width:1320,height:1580,objectFit:'cover',objectPosition:'50% 20%',filter:'grayscale(1) contrast(1.08) brightness(.9)'}}/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 60% 62%, rgba(224,38,58,0) 0%, rgba(224,38,58,.10) 45%, rgba(26,27,32,0) 70%)'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(26,27,32,1) 0%, rgba(26,27,32,1) 27%, rgba(26,27,32,.55) 40%, rgba(26,27,32,0) 52%, rgba(26,27,32,0) 64%, rgba(26,27,32,.88) 80%, rgba(26,27,32,1) 100%)'}}/>
    <div style={{position:'absolute',top:66,left:66,fontWeight:800,fontSize:46,color:'#B4B6C0'}}>#NeuroMot</div>
    <div style={{position:'absolute',top:130,left:62,border:`4px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:46,padding:'2px 18px',background:'rgba(26,27,32,.6)'}}>BRAIN STORY #12</div>
    <div style={{position:'absolute',top:66,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE · 1926</div>
    <div style={{position:'absolute',top:236,left:62,right:62,fontWeight:900,fontSize:150,lineHeight:0.88,textTransform:'uppercase',textShadow:'0 8px 28px rgba(0,0,0,.85)'}}>
      The enemy:<br/><span style={{color:C.red}}>Blood.</span></div>
    <div style={{position:'absolute',top:520,left:66,width:920,fontFamily:B,fontWeight:600,fontSize:46,lineHeight:1.2,color:'#E4E5EA',textShadow:'0 4px 14px rgba(0,0,0,.9)'}}>
      The fix? An <span style={{color:C.yellow}}>electric knife</span>… sold for 1 dollar.</div>
    <div style={{position:'absolute',left:690,top:820,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%, #F6E7A8 0%, #E0B84A 45%, #9C7A22 100%)',border:'8px solid #7A5C14',boxShadow:'0 24px 60px rgba(0,0,0,.8), inset 0 0 30px rgba(0,0,0,.35)',display:'flex',alignItems:'center',justifyContent:'center',transform:'rotate(-8deg)'}}>
      <div style={{fontWeight:900,fontSize:170,color:'#5A420C',textShadow:'0 2px 0 rgba(255,240,190,.6)'}}>$1</div>
    </div>
    <div style={{position:'absolute',left:66,top:1240,background:'rgba(26,27,32,.85)',color:'#D8D9DE',fontFamily:B,fontWeight:600,fontSize:30,padding:'6px 14px',borderRadius:8}}>Harvey Cushing · father of neurosurgery</div>
    <div style={{position:'absolute',top:1400,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{border:`5px solid ${C.orange}`,background:'rgba(26,27,32,.92)',color:C.text,borderRadius:18,padding:'10px 30px',fontWeight:900,fontSize:54}}>CUT + SEAL: <span style={{color:C.orange}}>WHO BUILT IT?</span></div>
    </div>
  </AbsoluteFill>
);
