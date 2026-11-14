import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// x-ray brain seen from the side/front with both hippocampi (seahorse-shaped curved tubes) deep in the
// medial temporal lobes. `glow` lights them, `gone` removes them (fade + shrink into sparks).
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const HIPPO_L = V(0.15, -0.25, 0.55);
export const HIPPO_R = V(0.15, -0.25, -0.55);
const bumpy = () => {
  const g = new THREE.SphereGeometry(1, 96, 64);
  const p = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 0.035 * Math.sin(v.x * 13 + v.y * 7) * Math.sin(v.y * 11 - v.z * 9) + 0.02 * Math.sin(v.z * 17 + v.x * 5); v.multiplyScalar(1 + n); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g;
};
const Ghost: React.FC<{geo: THREE.BufferGeometry; pos: [number, number, number]; scale: [number, number, number]; o?: number}> = ({geo, pos, scale, o = 1}) => (
  <group position={pos} scale={scale}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.06 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color="#F28C28" wireframe transparent opacity={0.065 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
  </group>
);
const Rig: React.FC<{ang: number; dist: number}> = ({ang, dist}) => {
  const {camera} = useThree(); camera.position.set(Math.sin(ang) * dist, 1.0, Math.cos(ang) * dist); camera.lookAt(0, 0.1, 0); return null;
};
export const projectHippo = (p: THREE.Vector3, ang: number, dist: number, w: number, h: number) => {
  const cam = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
  cam.position.set(Math.sin(ang) * dist, 1.0, Math.cos(ang) * dist); cam.lookAt(0, 0.1, 0); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const v = p.clone().project(cam); return {x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h};
};
export const hippoAngle = (f: number, fps: number, orbit = 0, sway = true) => orbit + (sway ? Math.sin(f / fps * 0.5) * 0.3 : 0);
const seahorse = (side: number) => new THREE.CatmullRomCurve3([
  V(1.05, -0.55, 0.62 * side), V(0.75, -0.42, 0.6 * side), V(0.35, -0.3, 0.56 * side), V(-0.05, -0.18, 0.52 * side), V(-0.4, 0.0, 0.48 * side), V(-0.6, 0.25, 0.42 * side), V(-0.55, 0.45, 0.36 * side),
]);
const Hippo: React.FC<{side: number; glow: number; gone: number; t: number}> = ({side, glow, gone, t}) => {
  const curve = useMemo(() => seahorse(side), [side]);
  const g = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.13, 16, false), [curve]);
  const g2 = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.3, 16, false), [curve]);
  const sparks = useMemo(() => Array.from({length: 40}, (_, i) => ({p: curve.getPoint(i / 39), d: V(Math.sin(i * 7.3), Math.cos(i * 3.1), Math.sin(i * 1.7)).normalize()})), [curve]);
  const o = 1 - gone;
  return (<group>
    {o > 0.02 && <group scale={1 - 0.3 * gone}>
      <mesh geometry={g}><meshStandardMaterial color="#c0182b" emissive="#ff4a2a" emissiveIntensity={0.4 + 0.8 * glow} transparent opacity={o} roughness={0.4}/></mesh>
      <mesh geometry={g2}><meshBasicMaterial color="#ff6a2a" transparent opacity={0.18 * glow * o * (0.8 + 0.2 * Math.sin(t * 6))} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    </group>}
    {gone > 0.02 && gone < 0.98 && sparks.map((s, i) => (
      <mesh key={i} position={s.p.clone().add(s.d.clone().multiplyScalar(gone * 1.2)).toArray() as [number, number, number]}>
        <sphereGeometry args={[0.04 * (1 - gone), 8, 6]}/><meshBasicMaterial color="#ffb347" transparent opacity={1 - gone} toneMapped={false}/>
      </mesh>))}
    {gone >= 0.98 && <mesh geometry={g}><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} depthWrite={false}/></mesh>}
  </group>);
};
export type HippoProps = {width: number; height: number; glow?: number; gone?: number; orbit?: number; dist?: number; sway?: boolean};
export const Hippo3D: React.FC<HippoProps> = ({width, height, glow = 1, gone = 0, orbit = 0.6, dist = 8.5, sway = true}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const ang = hippoAngle(f, fps, orbit, sway);
  const geo = useMemo(bumpy, []);
  const cereb = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 1, dist]}}>
      <Rig ang={ang} dist={dist}/>
      <ambientLight intensity={0.6}/><directionalLight position={[4, 6, 5]} intensity={1.4}/>
      <Ghost geo={geo} pos={[0, 0.45, 0.6]} scale={[2.2, 1.55, 0.95]}/>
      <Ghost geo={geo} pos={[0, 0.45, -0.6]} scale={[2.2, 1.55, 0.95]}/>
      <Ghost geo={cereb} pos={[-1.35, -0.85, 0]} scale={[0.85, 0.55, 1.1]} o={0.8}/>
      <mesh position={[-0.55, -1.25, 0]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.22, 0.16, 1.4, 24]}/><meshBasicMaterial color="#c9d6e8" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      <Hippo side={1} glow={glow} gone={gone} t={t}/>
      <Hippo side={-1} glow={glow} gone={gone} t={t}/>
      {glow > 0 && gone < 0.5 && <pointLight position={[0.2, -0.2, 0]} color="#ff5a2a" intensity={2.5 * glow} distance={3}/>}
    </ThreeCanvas>
  );
};
