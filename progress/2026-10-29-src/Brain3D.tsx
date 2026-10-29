import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

// Real 3D: a folded brain (two bumpy hemispheres) with glowing amyloid plaques that shrink away as `clear` goes 0 -> 1.
const makeHemi = (side:number) => {
  const g = new THREE.SphereGeometry(1, 128, 96);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);
    // gyri: layered sine folds
    const n = 0.055*Math.sin(v.x*11+v.y*7)*Math.sin(v.y*9-v.z*8) + 0.035*Math.sin(v.z*15+v.x*5) + 0.02*Math.sin(v.y*23);
    v.multiplyScalar(1+n);
    v.x = v.x*0.62 + side*0.66; v.y*=0.78; v.z*=1.12;
    if (v.y < -0.45) v.y = -0.45 + (v.y+0.45)*0.5; // flatter base
    p.setXYZ(i,v.x,v.y,v.z);
  }
  g.computeVertexNormals();
  return g;
};
const PLAQUES = Array.from({length:22},(_,i)=>{
  const a=i*2.399, h=((i*37)%22)/22*1.4-0.5;
  const r=Math.sqrt(1-Math.min(0.9,h*h));
  const side=1;
  return {pos:[side*0.66+Math.cos(a)*0.62*r*1.02, h*0.78, Math.sin(a)*1.12*r*1.02] as [number,number,number], s:0.07+((i*13)%7)*0.012, d:(i%5)/5};
});
const Brain: React.FC<{clear:number; t:number; pills:number}> = ({clear,t,pills}) => {
  const L = useMemo(()=>makeHemi(-1),[]); const R = useMemo(()=>makeHemi(1),[]);
  const mat = {color:'#8E8A92', roughness:0.55, metalness:0.05, emissive:'#2a0d10', emissiveIntensity:0.4};
  return (<group rotation={[0.15,0,0]}>
    <mesh geometry={L}><meshStandardMaterial {...mat}/></mesh>
    <mesh geometry={R}><meshStandardMaterial {...mat}/></mesh>
    {PLAQUES.map((q,i)=>{const k=Math.max(0,Math.min(1,(1-clear)*1.6-q.d*0.6)); const pul=1+0.35*Math.max(0,Math.sin(t*6+i*0.3));
      return k<=0.01?null:(<mesh key={i} position={q.pos} scale={q.s*k*pul}>
        <icosahedronGeometry args={[1,1]}/>
        <meshStandardMaterial color="#F28C28" emissive="#E0263A" emissiveIntensity={1.2} roughness={0.4}/>
      </mesh>);})}
    {Array.from({length:10},(_,i)=>{const a=t*0.9+i*0.628; const r=1.75+0.15*Math.sin(i*1.7); const y=Math.sin(a*1.3+i)*0.55;
      return pills<=0.01?null:(<group key={'p'+i} position={[Math.cos(a)*r,y,Math.sin(a)*r]} rotation={[a*2,a*1.4,i]} scale={0.17*pills}>
        <mesh position={[0,0.5,0]}><capsuleGeometry args={[0.5,0.01,8,16]}/><meshStandardMaterial color="#F2F2F4" roughness={0.3}/></mesh>
        <mesh position={[0,-0.5,0]}><capsuleGeometry args={[0.5,0.01,8,16]}/><meshStandardMaterial color={i%2?'#F28C28':'#E0263A'} roughness={0.3}/></mesh>
      </group>);})}
    <pointLight position={[0,0.6,1.8]} color="#F28C28" intensity={2.5*(1-clear)+0.5} distance={5}/>
  </group>);
};
const Rig: React.FC<{ang:number; dist:number}> = ({ang,dist}) => {
  const {camera}=useThree();
  camera.position.set(Math.sin(ang)*dist, 0.9+Math.sin(ang*0.7)*0.4, Math.cos(ang)*dist);
  camera.lookAt(0,0,0);
  return null;
};
export const Brain3D: React.FC<{width:number; height:number; clear?:number; orbit?:number; zoom?:number; pills?:number}> = ({width,height,clear=0,orbit=1,zoom=1,pills=1}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
  const ang=-0.6+t*0.5*orbit; const dist=5.2/zoom;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov:35, position:[0,1,dist]}}>
      <ambientLight intensity={0.5}/>
      <directionalLight position={[4,6,5]} intensity={1.7}/>
      <directionalLight position={[-5,-2,-4]} intensity={0.6} color="#ff7a3a"/>
      <Rig ang={ang} dist={dist}/>
      <Brain clear={clear} t={t} pills={pills}/>
    </ThreeCanvas>
  );
};
