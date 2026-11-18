import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4'};
const H="'Barlow Condensed', sans-serif";
const B="'Barlow', sans-serif";
// K3 (fully exploded head) shifted right + down, numbers on the layers, hook top-left
const SC=0.8, OX=260, OY=560;
const LAYERS=[{y:265,x:760},{y:505,x:740},{y:745,x:735},{y:900,x:735},{y:1030,x:715},{y:1150,x:720}];
const PARTS=['Scalp','Skull','Dura mater','Arachnoid','Pia mater','Brain'];
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:'#fff',fontFamily:H,color:C.bg}}>
    <Img src={staticFile('k3.jpg')} style={{position:'absolute',left:OX,top:OY,width:1080*SC,height:1920*SC}}/>
    {LAYERS.map((l,i)=>{const y=OY+l.y*SC, x=OX+l.x*SC; return (<React.Fragment key={i}>
      <div style={{position:'absolute',left:x,top:y-2,width:1000-x,height:4,background:'#3A3C45'}}/>
      <div style={{position:'absolute',left:1000,top:y-26,width:52,height:52,borderRadius:26,background:i===2?C.yellow:'#2D2F37',color:i===2?'#000':'#fff',fontWeight:900,fontSize:36,textAlign:'center',lineHeight:'52px'}}>{i+1}</div>
    </React.Fragment>);})}
    <div style={{position:'absolute',top:66,left:66,fontWeight:800,fontSize:46,color:'#55575f'}}>#NeuroMot</div>
    <div style={{position:'absolute',top:130,left:62,border:`4px solid ${C.orange}`,color:C.orange,fontWeight:900,fontSize:46,padding:'2px 18px'}}>BRAIN STORY #8</div>
    <div style={{position:'absolute',top:66,right:60,background:C.red,color:'#fff',fontWeight:900,fontSize:40,padding:'6px 20px',borderRadius:30}}>TRUE CASE · 1910</div>
    <div style={{position:'absolute',top:236,left:62,width:600,fontWeight:900,fontSize:124,lineHeight:0.86,textTransform:'uppercase'}}>
      <span style={{color:C.red}}>NOT</span> in<br/>his brain.<br/><span style={{color:C.orange}}>ON</span> it.</div>
    <div style={{position:'absolute',top:580,left:62,width:400,fontFamily:B,fontWeight:600,fontSize:38,lineHeight:1.2,color:'#2D2F37'}}>A general’s tumor, layer by layer.</div>
    <div style={{position:'absolute',left:44,top:820,width:300,background:'rgba(255,255,255,.92)',border:'2px solid #9C9EA8',borderRadius:10,padding:'12px 18px',fontFamily:B,fontWeight:600,color:'#2D2F37'}}>
      <div style={{fontFamily:H,fontWeight:900,fontSize:30,letterSpacing:2,color:'#555',borderBottom:'2px solid #bbb',paddingBottom:4,marginBottom:6}}>PARTS LIST</div>
      {PARTS.map((p,i)=>(<div key={p} style={{fontSize:30,lineHeight:1.32,display:'flex',gap:12,alignItems:'center'}}>
        <span style={{display:'inline-block',width:36,height:36,borderRadius:18,background:i===2?C.yellow:'#2D2F37',color:i===2?'#000':'#fff',textAlign:'center',fontFamily:H,fontWeight:900,fontSize:28,lineHeight:'36px'}}>{i+1}</span>
        <span style={{fontWeight:i===2?900:600}}>{p}</span></div>))}
    </div>
    <div style={{position:'absolute',top:1440,left:0,right:0,display:'flex',justifyContent:'center'}}>
      <div style={{border:`5px solid ${C.orange}`,background:'rgba(26,27,32,.92)',color:C.text,borderRadius:18,padding:'10px 34px',fontWeight:900,fontSize:54}}>Ever hit your head really hard? <span style={{color:C.green}}>1</span> or <span style={{color:C.red}}>2</span></div>
    </div>
  </AbsoluteFill>
);
