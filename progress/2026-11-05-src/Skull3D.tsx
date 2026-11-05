import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// x-ray head: ghost skull + brain; a crescent chronic subdural hematoma on the right side under the skull;
// the middle meningeal artery (MMA) branches on the inner skull; Onyx (white) fills the branches.
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const CSDH_PT = V(-1.9, 1.45, 0.8);
export const MMA_PT = V(-0.4, 0.2, 2.25);

const bumpy = (r: number, amp: number) => {
  const g = new THREE.SphereGeometry(r, 96, 64);
  const p = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = amp * Math.sin(v.x * 13 + v.y * 7) * Math.sin(v.y * 11 - v.z * 9); v.multiplyScalar(1 + n); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g;
};
const Ghost: React.FC<{geo: THREE.BufferGeometry; pos?: [number, number, number]; scale: [number, number, number]; color?: string; o?: number}> = ({geo, pos = [0, 0, 0], scale, color = '#F28C28', o = 1}) => (
  <group position={pos} scale={scale}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.06 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color={color} wireframe transparent opacity={0.07 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
  </group>
);
const Rig: React.FC<{ang: number; dist: number}> = ({ang, dist}) => {
  const {camera} = useThree(); camera.position.set(Math.sin(ang) * dist, 0.9, Math.cos(ang) * dist); camera.lookAt(0, 0.4, 0); return null;
};
export const projectSkull = (p: THREE.Vector3, ang: number, dist: number, w: number, h: number) => {
  const cam = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
  cam.position.set(Math.sin(ang) * dist, 0.9, Math.cos(ang) * dist); cam.lookAt(0, 0.4, 0); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const v = p.clone().project(cam); return {x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h};
};
// a curve lying on the inner skull (radius scale x,y,z = 2.7, 2.55, 2.3), given in angles
const onSkull = (pts: [number, number][], r = 0.93) => new THREE.CatmullRomCurve3(pts.map(([th, ph]) => V(2.7 * r * Math.sin(ph) * Math.sin(th), 0.5 + 2.55 * r * Math.cos(ph), 2.3 * r * Math.sin(ph) * Math.cos(th))));
const MMA_MAIN = onSkull([[-0.5, 2.3], [-0.35, 1.95], [-0.15, 1.6], [0.05, 1.25], [0.25, 0.9]]);
const MMA_A = onSkull([[-0.15, 1.6], [0.25, 1.55], [0.6, 1.4], [0.85, 1.2]]);
const MMA_B = onSkull([[0.05, 1.25], [-0.2, 0.95], [-0.45, 0.75]]);
const Tube: React.FC<{curve: THREE.Curve<THREE.Vector3>; r: number; p: number; color: string; glow?: number}> = ({curve, r, p, color, glow = 0.25}) => {
  const g = useMemo(() => new THREE.TubeGeometry(curve, 120, r, 10, false), [curve, r]);
  const g2 = useMemo(() => new THREE.TubeGeometry(curve, 120, r * 2.4, 10, false), [curve, r]);
  const n = Math.floor((g.index!.count / 6) * Math.max(0, Math.min(1, p))) * 6; g.setDrawRange(0, n); g2.setDrawRange(0, n);
  return (<group><mesh geometry={g}><meshBasicMaterial color={color} toneMapped={false}/></mesh>
    <mesh geometry={g2}><meshBasicMaterial color={color} transparent opacity={glow} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/></mesh></group>);
};

export type SkullProps = {width: number; height: number; blood?: number; artery?: number; onyx?: number; orbit?: number; dist?: number; sway?: boolean};
export const skullAngle = (f: number, fps: number, orbit = 0, sway = true) => orbit + (sway ? Math.sin(f / fps * 0.5) * 0.25 : 0);
export const Skull3D: React.FC<SkullProps> = ({width, height, blood = 1, artery = 0, onyx = 0, orbit = 0.2, dist = 11, sway = true}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const ang = skullAngle(f, fps, orbit, sway);
  const brain = useMemo(() => bumpy(1, 0.035), []);
  const skull = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  // crescent: a thin part of a sphere shell on the front-right convexity
  const shell = useMemo(() => new THREE.SphereGeometry(1, 64, 32, -0.25, 1.4, 0.45, 1.3), []);
  const pulse = (f % 30) / 30;
  const thick = 0.06 + 0.07 * blood;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 0.9, dist]}}>
      <Rig ang={ang} dist={dist}/>
      <ambientLight intensity={0.6}/><directionalLight position={[4, 6, 5]} intensity={1.4}/>
      <Ghost geo={skull} pos={[0, 0.5, 0]} scale={[2.7, 2.55, 2.3]} color="#c9d6e8" o={0.85}/>
      <Ghost geo={brain} pos={[0, 0.45, 0.55]} scale={[2.05, 1.6, 0.95]}/>
      <Ghost geo={brain} pos={[0, 0.45, -0.55]} scale={[2.05, 1.6, 0.95]}/>
      {blood > 0.02 && <group position={[0, 0.5, 0]} scale={[2.7 * (0.93 - thick * 0.5), 2.55 * (0.93 - thick * 0.5), 2.3 * (0.93 - thick * 0.5)]}>
        <mesh geometry={shell}><meshStandardMaterial color="#5a0f18" emissive="#b0182a" emissiveIntensity={0.45 + 0.25 * pulse} transparent opacity={0.55 + 0.35 * blood} side={THREE.DoubleSide} depthWrite={false}/></mesh>
      </group>}
      {artery > 0 && <>
        <Tube curve={MMA_MAIN} r={0.02} p={artery} color="#ff3b3b"/>
        <Tube curve={MMA_A} r={0.016} p={artery} color="#ff3b3b"/>
        <Tube curve={MMA_B} r={0.016} p={artery} color="#ff3b3b"/>
      </>}
      {onyx > 0 && <>
        <Tube curve={MMA_MAIN} r={0.03} p={onyx} color="#ffffff" glow={0.35}/>
        <Tube curve={MMA_A} r={0.024} p={Math.max(0, onyx * 1.4 - 0.4)} color="#ffffff" glow={0.35}/>
        <Tube curve={MMA_B} r={0.024} p={Math.max(0, onyx * 1.4 - 0.4)} color="#ffffff" glow={0.35}/>
      </>}
    </ThreeCanvas>
  );
};
