import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
const C={bg:'#1A1B20',bg2:'#25262E',red:'#E0263A',orange:'#F28C28',text:'#F2F2F4',mute:'#9C9EA8',card:'#2D2F37'};
const H="'Barlow Condensed', sans-serif";
const BRAIN="M300 70 C200 60 120 110 100 190 C60 210 50 280 80 330 C60 380 90 450 160 460 C200 520 290 530 340 490 C390 530 480 520 510 460 C580 450 610 380 590 330 C620 280 610 210 570 190 C550 110 470 60 370 70 C350 60 320 60 300 70 Z";
export const Banner: React.FC = () => {
  const pvs=Array.from({length:22},(_,i)=>({x:200+((i*53)%260),y:200+((i*37)%170),r:(i*29)%180}));
  return (<AbsoluteFill style={{background:`radial-gradient(circle at 70% 50%, ${C.bg2} 0%, ${C.bg} 70%)`,fontFamily:H,color:C.text}}>
    <div style={{position:'absolute',top:40,left:60,fontWeight:800,fontSize:40,color:C.mute}}>#NeuroMot</div>
    <div style={{position:'absolute',top:36,right:60,background:C.red,color:'#fff',fontWeight:800,fontSize:34,padding:'8px 22px',borderRadius:30,letterSpacing:2}}>NEUROLOGY · LANCET NEUROL 2022</div>
    <div style={{position:'absolute',left:60,top:150,width:700}}>
      <div style={{fontWeight:900,fontSize:130,lineHeight:0.92,textTransform:'uppercase',textShadow:'6px 6px 0 rgba(0,0,0,.4)'}}>MRI finds<br/><span style={{color:C.orange}}>more CAA</span></div>
      <div style={{display:'flex',alignItems:'baseline',gap:22,marginTop:34}}>
        <span style={{fontWeight:900,fontSize:96,color:'#8a8d98'}}>70.8%</span>
        <span style={{fontWeight:900,fontSize:70,color:C.mute}}>→</span>
        <span style={{fontWeight:900,fontSize:120,color:C.red}}>79.8%</span>
      </div>
      <div style={{fontWeight:800,fontSize:40,color:C.mute,marginTop:4}}>SENSITIVITY · BOSTON CRITERIA v2.0</div>
    </div>
    <svg style={{position:'absolute',right:70,top:140}} width={560} height={500} viewBox="40 40 600 520">
      <path d={BRAIN} fill="#2A2C34" stroke={C.orange} strokeWidth={12}/>
      <path d="M340 80 C330 200 350 330 340 490" fill="none" stroke={C.orange} strokeWidth={7} opacity={0.5}/>
      <path d="M120 200 C110 260 120 320 150 380" stroke={C.orange} strokeWidth={20} fill="none" strokeLinecap="round"/>
      {pvs.map((d,i)=><rect key={i} x={d.x} y={d.y} width={34} height={8} rx={4} fill="#4C8DF6" transform={`rotate(${d.r} ${d.x+17} ${d.y+4})`}/>)}
      {Array.from({length:10},(_,i)=><circle key={i} cx={380+((i*71)%170)} cy={200+((i*43)%200)} r={14} fill={C.text}/>)}
    </svg>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:16,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
  </AbsoluteFill>);
};
