import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig, Easing} from 'remotion';

// "Dr. Mot": original cartoon doctor (Motaz) for #NeuroMot. Clean line-art, dark scrubs,
// stethoscope, smooth eased gestures (arms bend at the elbow, poses blend over time).
export type Pose = 'stand'|'point'|'think'|'shrug'|'cheer'|'facepalm'|'thumbs'|'hold'|'wave';
type Mood = 'smile'|'worried'|'surprised'|'smirk'|'flat';
const INK = '#16171B';
const SKIN = '#FFFFFF';
const SCRUB = '#4A4F5C';
const SCRUB_D = '#3A3E49';
const HAIR = '#22232A';

// per arm: [shoulder angle, elbow angle] in degrees (0 = hanging down, + = outward / up)
const P: Record<Pose,{l:[number,number]; r:[number,number]; tilt:number}> = {
  stand:   {l:[8,10],   r:[8,10],   tilt:0},
  point:   {l:[8,10],   r:[95,90],  tilt:-4},
  think:   {l:[25,120], r:[20,150], tilt:6},
  shrug:   {l:[55,125], r:[55,125], tilt:-6},
  cheer:   {l:[150,165],r:[150,165],tilt:0},
  facepalm:{l:[10,15],  r:[28,160], tilt:10},
  thumbs:  {l:[8,10],   r:[60,140], tilt:-3},
  hold:    {l:[35,100], r:[35,100], tilt:0},
  wave:    {l:[8,10],   r:[150,175],tilt:-4},
};
const rad=(d:number)=>d*Math.PI/180;

export const StickDoc: React.FC<{pose?:Pose; from?:Pose; mood?:Mood; size?:number; flip?:boolean; delay?:number; sweat?:boolean; children?:React.ReactNode}> =
({pose='stand', from='stand', mood='smile', size=420, flip=false, delay=0, sweat=false, children}) => {
  const f = useCurrentFrame()-delay;
  const {fps} = useVideoConfig();
  const enter = spring({frame:f, fps, config:{damping:16, mass:0.8}});           // soft slide-in
  const g = interpolate(f,[4,20],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)}); // blend into pose
  const A=P[from], B=P[pose];
  const mix=(a:number,b:number)=>a+(b-a)*g;
  const breathe = Math.sin(f/14)*3;
  const sway = Math.sin(f/22)*1.5;
  const wiggle = pose==='wave' ? Math.sin(f/4)*14 : pose==='point' ? Math.sin(f/10)*3 : 0;
  const blink = (f%110)>105 ? 0.12 : 1;
  const tilt = mix(A.tilt,B.tilt) + sway;

  const sh = {x:200, y:250+breathe*0.4};
  const arm = (side:number, a:[number,number], b:[number,number]) => {
    const s0 = mix(a[0],b[0]) + (side===1?wiggle:0);
    const e0 = mix(a[1],b[1]) + (side===1?wiggle*0.6:0);
    const sx = sh.x + side*44, sy = sh.y+6;
    const ex = sx + side*Math.sin(rad(s0))*62, ey = sy + Math.cos(rad(s0))*62;
    const hx = ex + side*Math.sin(rad(e0))*58, hy = ey + Math.cos(rad(e0))*58;
    return (<g key={side}>
      <path d={`M${sx} ${sy} Q${ex} ${ey} ${hx} ${hy}`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round"/>
      <path d={`M${sx} ${sy} Q${ex} ${ey} ${hx} ${hy}`} fill="none" stroke={SKIN} strokeWidth={14} strokeLinecap="round"/>
      {/* short scrub sleeve */}
      <path d={`M${sx} ${sy} L${sx+side*Math.sin(rad(s0))*26} ${sy+Math.cos(rad(s0))*26}`} stroke={SCRUB} strokeWidth={30} strokeLinecap="round"/>
      <circle cx={hx} cy={hy} r={13} fill={SKIN} stroke={INK} strokeWidth={4}/>
      {pose==='thumbs' && side===1 && <path d={`M${hx} ${hy-8} l0 -20`} stroke={INK} strokeWidth={9} strokeLinecap="round"/>}
    </g>);
  };
  const brow: Record<Mood,[number,number]> = {smile:[0,0], worried:[-12,10], surprised:[-8,-8], smirk:[6,-6], flat:[0,0]};
  const [bl,br]=brow[mood];
  const mouth: Record<Mood,React.ReactNode> = {
    smile: <path d="M178 186 Q200 206 222 186" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"/>,
    worried: <path d="M182 198 Q200 186 218 198" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"/>,
    surprised: <ellipse cx={200} cy={194} rx={11} ry={14} fill={INK}/>,
    smirk: <path d="M182 192 Q206 200 222 184" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"/>,
    flat: <path d="M184 194 L216 194" stroke={INK} strokeWidth={6} strokeLinecap="round"/>,
  };
  return (
    <svg width={size} height={size*1.3} viewBox="0 0 400 520"
      style={{overflow:'visible', opacity:enter, filter:'drop-shadow(0 0 3px rgba(255,255,255,.55)) drop-shadow(0 0 1px rgba(255,255,255,.8))', transform:`translateY(${(1-enter)*60}px) ${flip?'scaleX(-1)':''}`}}>
      <ellipse cx={200} cy={505} rx={90} ry={12} fill="#000" opacity={0.35}/>
      {/* legs: scrub pants + shoes */}
      <path d={`M176 380 L170 488 M224 380 L230 488`} stroke={INK} strokeWidth={40} strokeLinecap="round"/>
      <path d={`M176 380 L170 488 M224 380 L230 488`} stroke={SCRUB_D} strokeWidth={32} strokeLinecap="round"/>
      <path d="M150 498 Q170 482 186 498 Z M214 498 Q230 482 250 498 Z" fill={INK} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
      {/* torso: scrub top */}
      <g transform={`translate(0 ${breathe*0.4})`}>
        <path d="M152 240 Q200 226 248 240 L262 392 Q200 404 138 392 Z" fill={SCRUB} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
        <path d="M184 238 L200 268 L216 238" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round"/>
        <rect x={218} y={290} width={26} height={20} rx={4} fill="none" stroke={INK} strokeWidth={4}/>
        <path d="M222 290 l0 -10" stroke="#E0263A" strokeWidth={4}/>
        {/* stethoscope */}
        <path d="M170 244 Q160 300 192 318 Q200 322 206 316" fill="none" stroke="#9AA0AE" strokeWidth={6} strokeLinecap="round"/>
        <path d="M230 244 Q240 290 214 312" fill="none" stroke="#9AA0AE" strokeWidth={6} strokeLinecap="round"/>
        <circle cx={208} cy={318} r={9} fill="#C9CDD6" stroke={INK} strokeWidth={3}/>
      </g>
      {arm(-1,A.l,B.l)}{arm(1,A.r,B.r)}
      {/* head */}
      <g transform={`rotate(${tilt} 200 230) translate(0 ${breathe*0.6})`}>
        <rect x={188} y={208} width={24} height={30} fill={SKIN} stroke={INK} strokeWidth={5}/>
        <circle cx={200} cy={150} r={78} fill={SKIN} stroke={INK} strokeWidth={6}/>
        <path d="M124 136 Q126 70 196 66 Q262 64 278 124 Q266 106 242 104 Q236 86 214 92 Q196 80 178 96 Q150 98 124 136 Z" fill={HAIR} stroke={INK} strokeWidth={4} strokeLinejoin="round"/>
        <path d={`M164 ${128+bl} L190 ${124-bl*0.3}`} stroke={INK} strokeWidth={6} strokeLinecap="round"/>
        <path d={`M210 ${124-br*0.3} L236 ${128+br}`} stroke={INK} strokeWidth={6} strokeLinecap="round"/>
        <ellipse cx={177} cy={152} rx={9} ry={12*blink} fill={INK}/>
        <ellipse cx={223} cy={152} rx={9} ry={12*blink} fill={INK}/>
        {blink>0.5 && <><circle cx={180} cy={147} r={3} fill="#fff"/><circle cx={226} cy={147} r={3} fill="#fff"/></>}
        <ellipse cx={160} cy={176} rx={10} ry={6} fill="#F28C28" opacity={0.18}/>
        <ellipse cx={240} cy={176} rx={10} ry={6} fill="#F28C28" opacity={0.18}/>
        {mouth[mood]}
        {sweat && <path d="M282 116 q12 20 0 30 q-12 -10 0 -30 Z" fill="#7CC6FF" opacity={0.55+0.35*Math.sin(f/6)}/>}
      </g>
      {children}
    </svg>
  );
};

// Camera: keyframes [frame, scale, x%, y%] with eased (smooth) moves between them
export const Cam: React.FC<{keys:[number,number,number,number][]; children:React.ReactNode}> = ({keys, children}) => {
  const f=useCurrentFrame();
  const fr=keys.map(k=>k[0]);
  const o={extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const, easing:Easing.inOut(Easing.cubic)};
  const s=interpolate(f,fr,keys.map(k=>k[1]),o);
  const x=interpolate(f,fr,keys.map(k=>k[2]),o);
  const y=interpolate(f,fr,keys.map(k=>k[3]),o);
  return <div style={{position:'absolute',inset:0,transformOrigin:`${x}% ${y}%`,transform:`scale(${s})`}}>{children}</div>;
};
