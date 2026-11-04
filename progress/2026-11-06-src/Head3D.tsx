import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// x-ray head: ghost skull + brain, glowing thalamic target (Vim).
// dbs: an electrode slides in from the top to the target (one or both sides).
// fus: many ultrasound beams converge through the closed skull onto one spot.
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const VIM_L = V(0.15, 0.15, 0.42);
export const VIM_R = V(0.15, 0.15, -0.42);

const bumpy = (r: number, amp: number) => {
  const g = new THREE.SphereGeometry(r, 96, 64);
  const p = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = amp * Math.sin(v.x * 13 + v.y * 7) * Math.sin(v.y * 11 - v.z * 9);
    v.multiplyScalar(1 + n); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
};
const Ghost: React.FC<{geo: THREE.BufferGeometry; pos?: [number, number, number]; scale: [number, number, number]; color?: string; o?: number}> = ({geo, pos = [0, 0, 0], scale, color = '#F28C28', o = 1}) => (
  <group position={pos} scale={scale}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.06 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color={color} wireframe transparent opacity={0.07 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
  </group>
);
const camFor = (ang: number, dist: number) => {
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  cam.position.set(Math.sin(ang) * dist, 0.8, Math.cos(ang) * dist); cam.lookAt(0, 0.4, 0); return cam;
};
export const projectHead = (p: THREE.Vector3, ang: number, dist: number, w: number, h: number) => {
  const cam = camFor(ang, dist); cam.aspect = w / h; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const v = p.clone().project(cam); return {x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h};
};
const Rig: React.FC<{ang: number; dist: number}> = ({ang, dist}) => {
  const {camera} = useThree();
  camera.position.set(Math.sin(ang) * dist, 0.8, Math.cos(ang) * dist); camera.lookAt(0, 0.4, 0); return null;
};
const Electrode: React.FC<{target: THREE.Vector3; p: number}> = ({target, p}) => {
  const entry = V(target.x - 0.2, 3.4, target.z * 1.25);
  const dir = target.clone().sub(entry); const len = dir.length();
  const tip = entry.clone().add(dir.clone().multiplyScalar(p));
  const top = entry.clone().sub(dir.clone().normalize().multiplyScalar(0.6));
  const mid = top.clone().add(tip).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize());
  const L = top.distanceTo(tip);
  if (p <= 0.001) return null;
  return (<group>
    <group position={mid.toArray() as [number, number, number]} quaternion={q}>
      <mesh><cylinderGeometry args={[0.045, 0.045, L, 16]}/><meshStandardMaterial color="#dfe3ea" metalness={0.85} roughness={0.25}/></mesh>
      <mesh><cylinderGeometry args={[0.13, 0.13, L, 16]}/><meshBasicMaterial color="#9fd0ff" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    </group>
    {p > 0.98 && [0, 1, 2, 3].map(i => <mesh key={i} position={target.clone().sub(dir.clone().normalize().multiplyScalar(i * 0.12)).toArray() as [number, number, number]}><sphereGeometry args={[0.06, 12, 8]}/><meshBasicMaterial color="#6fd3ff"/></mesh>)}
  </group>);
};
const Beams: React.FC<{target: THREE.Vector3; p: number; t: number}> = ({target, p, t}) => {
  const n = 14;
  const items = useMemo(() => Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2; const b = 0.35 + 0.5 * ((i * 7) % n) / n;
    return V(Math.cos(a) * Math.cos(b) * 3.4, 0.4 + Math.sin(b) * 3.0, Math.sin(a) * Math.cos(b) * 3.4);
  }), []);
  if (p <= 0.001) return null;
  return (<group>
    {items.map((src, i) => {
      const end = src.clone().lerp(target, Math.min(1, p * 1.1));
      const mid = src.clone().add(end).multiplyScalar(0.5); const L = src.distanceTo(end);
      const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), end.clone().sub(src).normalize());
      return (<group key={i} position={mid.toArray() as [number, number, number]} quaternion={q}>
        <mesh><cylinderGeometry args={[0.02, 0.07, L, 8]}/><meshBasicMaterial color="#F28C28" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      </group>);
    })}
    {p > 0.9 && <mesh position={target.toArray() as [number, number, number]} scale={1 + 0.25 * Math.sin(t * 8)}><sphereGeometry args={[0.16, 20, 14]}/><meshBasicMaterial color="#ffb347" toneMapped={false}/></mesh>}
    {p > 0.9 && <pointLight position={target.toArray() as [number, number, number]} color="#ff8a2a" intensity={4} distance={3}/>}
  </group>);
};

export type HeadProps = {width: number; height: number; dbs?: number; dbs2?: number; fus?: number; orbit?: number; dist?: number; sway?: boolean; targets?: number};
export const headAngle = (f: number, fps: number, orbit = 0, sway = true) => orbit + (sway ? Math.sin(f / fps * 0.5) * 0.3 : 0);
export const Head3D: React.FC<HeadProps> = ({width, height, dbs = 0, dbs2 = 0, fus = 0, orbit = 0.9, dist = 11, sway = true, targets = 1}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const ang = headAngle(f, fps, orbit, sway);
  const brain = useMemo(() => bumpy(1, 0.035), []);
  const skull = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  const pulse = (f % 26) / 26;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 0.8, dist]}}>
      <Rig ang={ang} dist={dist}/>
      <ambientLight intensity={0.6}/><directionalLight position={[4, 6, 5]} intensity={1.4}/>
      <Ghost geo={skull} pos={[0, 0.5, 0]} scale={[2.75, 2.6, 2.3]} color="#c9d6e8" o={0.8}/>
      <Ghost geo={brain} pos={[0.1, 0.55, 0.55]} scale={[2.2, 1.6, 0.95]}/>
      <Ghost geo={brain} pos={[0.1, 0.55, -0.55]} scale={[2.2, 1.6, 0.95]}/>
      <Ghost geo={skull} pos={[-1.2, -0.9, 0]} scale={[0.8, 0.5, 1.0]} o={0.8}/>
      {[VIM_L, VIM_R].slice(0, targets === 2 ? 2 : 1).map((v, i) => (
        <group key={i} position={v.toArray() as [number, number, number]}>
          <mesh><sphereGeometry args={[0.13, 20, 14]}/><meshBasicMaterial color="#E0263A" toneMapped={false}/></mesh>
          <mesh scale={1 + 1.4 * pulse}><sphereGeometry args={[0.13, 20, 14]}/><meshBasicMaterial color="#ff3b3b" transparent opacity={0.5 * (1 - pulse)} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
        </group>))}
      <Electrode target={VIM_L} p={dbs}/>
      <Electrode target={VIM_R} p={dbs2}/>
      <Beams target={VIM_L} p={fus} t={t}/>
    </ThreeCanvas>
  );
};
