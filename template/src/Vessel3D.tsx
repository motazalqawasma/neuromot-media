import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// Real 3D: a branching artery with a glowing, pulsing aneurysm; camera orbits.
const Tree: React.FC<{bulge:number; pulse:number; burst:number}> = ({bulge, pulse, burst}) => {
  const main = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,-3.2,0), new THREE.Vector3(0.2,-1.6,0.3), new THREE.Vector3(-0.1,-0.2,0.1),
    new THREE.Vector3(0.6,1.0,-0.2), new THREE.Vector3(1.4,2.0,0.1), new THREE.Vector3(2.0,3.0,0.0)]),[]);
  const br1 = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1,-0.2,0.1), new THREE.Vector3(-1.0,0.6,0.4), new THREE.Vector3(-1.9,1.1,0.2), new THREE.Vector3(-2.7,1.9,-0.2)]),[]);
  const br2 = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.6,1.0,-0.2), new THREE.Vector3(0.2,1.9,-0.6), new THREE.Vector3(-0.3,2.9,-0.4)]),[]);
  const vessel = {color:'#D9DCE4', roughness:0.35, metalness:0.1, emissive:'#3a1015', emissiveIntensity:0.25};
  const s = 0.55*bulge*(1+0.08*pulse);
  return (<group>
    <mesh><tubeGeometry args={[main,120,0.22,24,false]}/><meshStandardMaterial {...vessel}/></mesh>
    <mesh><tubeGeometry args={[br1,80,0.16,20,false]}/><meshStandardMaterial {...vessel}/></mesh>
    <mesh><tubeGeometry args={[br2,60,0.13,20,false]}/><meshStandardMaterial {...vessel}/></mesh>
    {/* aneurysm sac at the bifurcation */}
    <mesh position={[0.95,1.15,0.35]} scale={[s,s*1.08,s]}>
      <sphereGeometry args={[1,48,48]}/>
      <meshStandardMaterial color="#F28C28" emissive="#E0263A" emissiveIntensity={0.35+0.5*pulse+burst} roughness={0.25} metalness={0.05}/>
    </mesh>
    <pointLight position={[0.95,1.15,0.9]} color="#F28C28" intensity={2+4*pulse} distance={4}/>
  </group>);
};
export const Vessel3D: React.FC<{width:number; height:number; bulge?:number; orbit?:number; zoom?:number; burst?:number}> = ({width,height,bulge=1,orbit=1,zoom=1,burst=0}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=f/fps;
  const pulse=Math.abs(Math.sin(t*3.2));
  const ang=t*0.6*orbit;
  const dist=9/zoom;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov:35, position:[Math.sin(ang)*dist, 0.6, Math.cos(ang)*dist]}}
      onCreated={({camera})=>{camera.lookAt(0.4,0.6,0);}}>
      <ambientLight intensity={0.55}/>
      <directionalLight position={[4,6,5]} intensity={1.6}/>
      <directionalLight position={[-5,-2,-4]} intensity={0.5} color="#7a8cff"/>
      <CamRig ang={ang} dist={dist}/>
      <Tree bulge={bulge} pulse={pulse} burst={burst}/>
    </ThreeCanvas>
  );
};
import {useThree} from '@react-three/fiber';
const CamRig: React.FC<{ang:number; dist:number}> = ({ang,dist}) => {
  const {camera}=useThree();
  camera.position.set(Math.sin(ang)*dist, 0.6+Math.sin(ang*0.7)*0.8, Math.cos(ang)*dist);
  camera.lookAt(0.4,0.6,0);
  return null;
};
