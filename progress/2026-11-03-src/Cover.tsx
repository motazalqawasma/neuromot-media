import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
const C={bg:'#1A1B20',bg2:'#25262E',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',text:'#F2F2F4',mute:'#9C9EA8',card:'#2D2F37'};
const H="'Barlow Condensed', sans-serif";
export const BRAIN="M300 70 C200 60 120 110 100 190 C60 210 50 280 80 330 C60 380 90 450 160 460 C200 520 290 530 340 490 C390 530 480 520 510 460 C580 450 610 380 590 330 C620 280 610 210 570 190 C550 110 470 60 370 70 C350 60 320 60 300 70 Z";
// brain with an artery and an aneurysm bulge; bulge = 0..1 size, pulse adds a glow
export const AneurysmBrain: React.FC<{size?:number; bulge?:number; glow?:number; q?:number}> = ({size=880, bulge=1, glow=1, q=0}) => (
  <svg width={size} height={size*0.87} viewBox="40 40 600 520">
    <path d={BRAIN} fill="#2A2C34" stroke={C.text} strokeWidth={9} strokeLinejoin="round"/>
    <path d="M340 80 C330 200 350 330 340 490" fill="none" stroke={C.text} strokeWidth={6} opacity={0.35}/>
    <path d="M300 540 C300 450 310 400 360 350 C400 310 430 290 470 260 C500 238 520 215 545 190" fill="none" stroke="#C9CBD3" strokeWidth={18} strokeLinecap="round"/>
    <path d="M360 350 C330 320 300 300 250 290" fill="none" stroke="#C9CBD3" strokeWidth={12} strokeLinecap="round"/>
    <circle cx={470} cy={238} r={70*bulge} fill={C.orange} opacity={0.25*glow}/>
    <circle cx={470} cy={238} r={40*bulge} fill={C.orange} stroke="#fff" strokeWidth={5}/>
    {q>0 && <text x={540} y={150} fontFamily={H} fontWeight={900} fontSize={130*q} fill={C.yellow}>?</text>}
  </svg>
);
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 45%, ${C.bg2} 0%, ${C.bg} 70%)`,fontFamily:H,color:C.text,alignItems:'center',justifyContent:'space-evenly',padding:'170px 40px 230px'}}>
    <div style={{position:'absolute',top:60,left:70,fontWeight:800,fontSize:44,color:C.mute}}>#NeuroMot</div>
    <div style={{position:'absolute',top:54,right:70,background:C.red,color:'#fff',fontWeight:800,fontSize:34,padding:'8px 22px',borderRadius:30,letterSpacing:2}}>NEUROSURGERY · JAMA NETW OPEN 2025</div>
    <div style={{textAlign:'center',fontWeight:900,fontSize:210,lineHeight:0.9,textTransform:'uppercase',textShadow:'7px 7px 0 rgba(0,0,0,.4)'}}>Will it<br/><span style={{color:C.orange}}>burst?</span></div>
    <div style={{fontWeight:800,fontSize:60,color:C.mute,textAlign:'center'}}>AI predicts aneurysm rupture</div>
    <div style={{position:'relative'}}>
      <AneurysmBrain size={980} q={1}/>
      <div style={{position:'absolute',left:-10,bottom:-20,background:C.card,border:`4px solid ${C.orange}`,borderRadius:26,padding:'14px 30px',textAlign:'center'}}>
        <div style={{fontWeight:900,fontSize:110,color:C.orange,lineHeight:1}}>0.90</div>
        <div style={{fontWeight:800,fontSize:40,color:C.text}}>accuracy score<br/>new hospitals</div>
      </div>
    </div>
    <div style={{fontWeight:800,fontSize:40,color:C.mute,letterSpacing:3}}>FUJIMURA · JAMA NETW OPEN 2025</div>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:18,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
  </AbsoluteFill>
);
