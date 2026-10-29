import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
const C={bg:'#1A1B20',bg2:'#25262E',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',text:'#F2F2F4',mute:'#9C9EA8',card:'#2D2F37',line:'#3A3C45',gray:'#7A7D88',green:'#2DBE6C'};
const H="'Barlow Condensed', sans-serif"; const B="'Barlow', sans-serif";
const T: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=110,c=C.text,children}) =>
  <div style={{fontFamily:H,fontWeight:900,fontSize:s,lineHeight:0.95,color:c,textTransform:'uppercase',textAlign:'center',textShadow:'6px 6px 0 rgba(0,0,0,.4)'}}>{children}</div>;
const L: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=46,c=C.mute,children}) =>
  <div style={{fontFamily:H,fontWeight:800,fontSize:s,color:c,textAlign:'center'}}>{children}</div>;
const Frame: React.FC<{n:number;children:React.ReactNode}> = ({n,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 45%, ${C.bg2} 0%, ${C.bg} 75%)`}}>
    <div style={{position:'absolute',top:44,left:60,fontFamily:H,fontWeight:800,fontSize:40,color:C.mute}}>#NeuroMot</div>
    <div style={{position:'absolute',top:96,left:60,border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:32,padding:'2px 14px',borderRadius:10}}>NEURO PAPER #7</div>
    <div style={{position:'absolute',top:40,right:60,background:C.red,color:'#fff',fontFamily:H,fontWeight:800,fontSize:30,padding:'8px 20px',borderRadius:30,letterSpacing:2}}>HEADACHE · NEUROLOGY 2026</div>
    <div style={{position:'absolute',bottom:40,right:60,fontFamily:H,fontWeight:800,fontSize:36,color:C.mute}}>{n}/6</div>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',padding:'170px 60px 110px',gap:40}}>{children}</AbsoluteFill>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:14,background:`linear-gradient(90deg, ${C.red}, ${C.orange})`}}/>
  </AbsoluteFill>);
const Pill: React.FC<{size?:number; c?:string; rot?:number}> = ({size=60,c=C.red,rot=-35}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform:`rotate(${rot}deg)`}}>
    <rect x={30} y={8} width={40} height={84} rx={20} fill="#F2F2F4"/><path d="M30 50 L70 50 L70 72 A20 20 0 0 1 30 72 Z" fill={c}/></svg>);
const Waffle: React.FC<{v:number;c:string}> = ({v,c}) => (
  <svg width={360} height={360} viewBox="0 0 200 200">{Array.from({length:100},(_,i)=>{const x=(i%10)*20+10,y=Math.floor(i/10)*20+10,fl=Math.max(0,Math.min(1,v-i));
    return <g key={i}><circle cx={x} cy={y} r={7.5} fill={C.line}/>{fl>0&&<circle cx={x} cy={y} r={7.5} fill={c} opacity={fl}/>}</g>;})}</svg>);
const Bar: React.FC<{v:number;c:string;l:string}> = ({v,c,l}) => (
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
    <div style={{fontFamily:H,fontWeight:900,fontSize:110,color:c}}>−{v.toFixed(1)}</div>
    <div style={{width:230,height:v*48,background:c,borderRadius:'12px 12px 0 0'}}/>
    <div style={{fontFamily:H,fontWeight:800,fontSize:46,color:C.text}}>{l}</div>
  </div>);
const slides: React.FC[] = [
  () => <Frame n={1}>
    <T s={124}>Are your painkillers<br/><span style={{color:C.orange}}>causing</span> your<br/>headaches?</T>
    <div style={{display:'flex',gap:18}}>{[C.red,C.orange,C.red,C.orange,C.red].map((c,i)=><Pill key={i} size={110} c={c} rot={-40+i*20}/>)}</div>
    <L s={48} c={C.text}>Medication-overuse headache: a new trial tested 1 drip</L>
    <div style={{background:C.orange,color:'#fff',fontFamily:H,fontWeight:900,fontSize:60,padding:'8px 36px',borderRadius:16}}>SWIPE →</div>
  </Frame>,
  () => <Frame n={2}>
    <T s={100}>The <span style={{color:C.orange}}>RESOLUTION</span> trial</T>
    <div style={{display:'flex',gap:30}}>{[['608','adults'],['76','clinics'],['11','countries']].map(([a,b])=>
      <div key={a} style={{background:C.card,borderRadius:22,padding:'18px 30px',textAlign:'center',border:`3px solid ${C.line}`}}><div style={{fontFamily:H,fontWeight:900,fontSize:100,color:C.orange,lineHeight:1}}>{a}</div><L s={40} c={C.text}>{b}</L></div>)}</div>
    <L s={46} c={C.text}>Chronic migraine + painkillers on ~20 days a month</L>
    <div style={{background:C.text,color:C.bg,fontFamily:H,fontWeight:900,fontSize:56,padding:'12px 30px',borderRadius:20}}>EVERYONE: 10-min talk on overuse</div>
    <L s={50} c={C.text}>then ONE IV drip: <span style={{color:C.orange}}>eptinezumab 100 mg</span> or <span style={{color:C.gray}}>salt water</span></L>
  </Frame>,
  () => <Frame n={3}>
    <T s={92}>Migraine days per month</T>
    <L s={40}>change in weeks 1–4 (start: about 21 days)</L>
    <div style={{display:'flex',gap:110,alignItems:'flex-end'}}><Bar v={6.9} c={C.orange} l="DRUG + TALK"/><Bar v={3.7} c={C.gray} l="SALT + TALK"/></div>
    <div style={{background:C.orange,color:'#fff',fontFamily:H,fontWeight:900,fontSize:62,padding:'6px 30px',borderRadius:18,whiteSpace:'nowrap'}}>−3.2 MORE DAYS WITH THE DRUG</div>
  </Frame>,
  () => <Frame n={4}>
    <T s={96}>Lost <span style={{color:C.orange}}>both</span> diagnoses</T>
    <L s={38}>no longer chronic migraine AND no longer MOH · weeks 1–4</L>
    <div style={{display:'flex',gap:60}}>
      <div style={{textAlign:'center'}}><Waffle v={37.8} c={C.orange}/><T s={110} c={C.orange}>37.8%</T><L s={40} c={C.text}>DRUG + TALK</L></div>
      <div style={{textAlign:'center'}}><Waffle v={18.1} c={'#D9DCE3'}/><T s={110} c={C.mute}>18.1%</T><L s={40} c={C.text}>SALT + TALK</L></div>
    </div>
    <L s={44} c={C.text}>Side effects: 41.9% vs 36.9% · no drug-related serious events</L>
  </Frame>,
  () => <Frame n={5}>
    <T s={140} c={C.red}>The catch</T>
    <div style={{display:'flex',flexDirection:'column',gap:26,width:900}}>
      {['No “drug only” group — we can’t split the credit between drug and talk','Only 12 weeks with placebo','97.8% of patients were in Europe','Funded by the drug maker (H. Lundbeck A/S)'].map(t=>
        <div key={t} style={{display:'flex',gap:20,alignItems:'center',background:C.card,borderRadius:18,padding:'16px 26px'}}><div style={{fontFamily:H,fontWeight:900,fontSize:60,color:C.red}}>✗</div><div style={{fontFamily:H,fontWeight:800,fontSize:46,color:C.text}}>{t}</div></div>)}
    </div>
  </Frame>,
  () => <Frame n={6}>
    <T s={120}>Drug on <span style={{color:C.orange}}>day one?</span></T>
    <div style={{display:'flex',gap:30}}>
      <div style={{background:C.green,color:'#fff',fontFamily:H,fontWeight:900,fontSize:70,padding:'10px 34px',borderRadius:18}}>1 = yes</div>
      <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:70,padding:'10px 34px',borderRadius:18}}>2 = talk first</div>
    </div>
    <L s={56} c={C.yellow}>Comment below · Save this for later 📌</L>
    <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:54,padding:'12px 34px',borderRadius:14}}>FOLLOW #NeuroMot · one paper a day</div>
    <div style={{textAlign:'center',fontFamily:B,fontWeight:600,fontSize:28,color:C.mute,lineHeight:1.4}}>Jensen RH, et al. Neurology 2026;106(8):e214863<br/>doi:10.1212/WNL.0000000000214863<br/><span style={{color:C.yellow}}>For education — not medical advice</span></div>
  </Frame>,
];
export const Slide: React.FC<{i:number}> = ({i}) => {const S=slides[i]; return <S/>;};
