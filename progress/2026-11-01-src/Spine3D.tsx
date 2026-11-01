import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';

// Real 3D: a cervical spine (7 vertebrae + discs) with the spinal cord inside; the narrowed level glows and pulses.
const LEVELS = 7;
const Vertebra: React.FC<{y:number; i:number; t:number}> = ({y,i,t}) => {
  const hot = i===3 || i===4;
  const mat = {color: '#B9B3AA', roughness: 0.6, metalness: 0.05, emissive: hot ? '#5a1408' : '#1a0a06', emissiveIntensity: hot ? 0.6+0.4*Math.sin(t*5) : 0.3};
  return (<group position={[0,y,0]}>
    {/* body */}
    <mesh position={[0,0,0.55]}><cylinderGeometry args={[0.55,0.58,0.42,40]}/><meshStandardMaterial {...mat}/></mesh>
    {/* arch around the canal */}
    <mesh rotation={[Math.PI/2,0,0]} position={[0,0,-0.15]}><torusGeometry args={[0.42,0.12,16,40,Math.PI]}/><meshStandardMaterial {...mat}/></mesh>
    {/* spinous process */}
    <mesh position={[0,-0.05,-0.85]} rotation={[0.35,0,0]}><boxGeometry args={[0.16,0.18,0.62]}/><meshStandardMaterial {...mat}/></mesh>
    {/* transverse processes */}
    <mesh position={[0.62,0,0.15]}><boxGeometry args={[0.5,0.16,0.22]}/><meshStandardMaterial {...mat}/></mesh>
    <mesh position={[-0.62,0,0.15]}><boxGeometry args={[0.5,0.16,0.22]}/><meshStandardMaterial {...mat}/></mesh>
    {/* disc below */}
    {i<LEVELS-1 && <mesh position={[0,-0.33,0.55]}><cylinderGeometry args={[0.5,0.5,0.2,40]}/><meshStandardMaterial color="#5B6A7A" roughness={0.4}/></mesh>}
  </group>);
};
const Spine: React.FC<{t:number; squeeze:number}> = ({t,squeeze}) => {
  const top = (LEVELS-1)*0.66/2;
  return (<group rotation={[0.08,0,0.05]}>
    {Array.from({length:LEVELS},(_,i)=><Vertebra key={i} i={i} y={top-i*0.66} t={t}/>)}
    {/* spinal cord: glowing tube, narrowed at the stenosis */}
    {Array.from({length:40},(_,k)=>{const y=top+0.5-k*0.13; const d=Math.abs(y-(top-3.5*0.66)); const narrow=1-squeeze*0.45*Math.max(0,1-d/0.7);
      return <mesh key={k} position={[0,y,-0.15]}><sphereGeometry args={[0.22*narrow,20,14]}/>
        <meshStandardMaterial color="#F28C28" emissive={d<0.7?'#E0263A':'#F28C28'} emissiveIntensity={d<0.7?1.2+0.6*Math.sin(t*5):0.7} roughness={0.35}/></mesh>;})}
    <pointLight position={[0,top-3.5*0.66,0.6]} color="#E0263A" intensity={3} distance={3}/>
  </group>);
};
const Rig: React.FC<{ang:number; dist:number}> = ({ang,dist}) => {
  const {camera}=useThree();
  camera.position.set(Math.sin(ang)*dist, 0.4+Math.sin(ang*0.7)*0.3, Math.cos(ang)*dist);
  camera.lookAt(0,0,0);
  return null;
};
export const Spine3D: React.FC<{width:number; height:number; zoom?:number; squeeze?:number}> = ({width,height,zoom=1,squeeze=1}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
  const ang=-1.2+t*0.45; const dist=10.5/zoom;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov:35, position:[0,0.5,dist]}}>
      <ambientLight intensity={0.45}/>
      <directionalLight position={[4,6,5]} intensity={1.6}/>
      <directionalLight position={[-5,-2,-4]} intensity={0.7} color="#ff7a3a"/>
      <Rig ang={ang} dist={dist}/>
      <Spine t={t} squeeze={squeeze}/>
    </ThreeCanvas>
  );
};
