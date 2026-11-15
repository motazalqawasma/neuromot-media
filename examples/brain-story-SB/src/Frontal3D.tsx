import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig, random} from 'remotion';
import * as THREE from 'three';

// x-ray brain (front = +x) with the frontal lobe's white-matter connections: glowing fibers running from the
// prefrontal cortex back to the thalamus on both sides. `cut` (0..1) sweeps a blade through them at x = CUT_X:
// the front part of every fiber goes dark and sparks fly. `glow` lights the fibers; `lobe` tints the frontal lobe.
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const CUT_X = 1.0;
export const FRONT_PT = V(1.75, 0.65, 0.5);
export const THAL_PT = V(0.0, 0.05, 0.25);
export const CUT_PT = V(CUT_X, 0.45, 0.45);
const bumpy = () => {
  const g = new THREE.SphereGeometry(1, 96, 64);
  const p = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 0.035 * Math.sin(v.x * 13 + v.y * 7) * Math.sin(v.y * 11 - v.z * 9) + 0.02 * Math.sin(v.z * 17 + v.x * 5); v.multiplyScalar(1 + n); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g;
};
const Ghost: React.FC<{geo: THREE.BufferGeometry; pos: [number, number, number]; scale: [number, number, number]; o?: number; color?: string}> = ({geo, pos, scale, o = 1, color = '#F28C28'}) => (
  <group position={pos} scale={scale}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.06 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color={color} wireframe transparent opacity={0.065 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
  </group>
);
const Rig: React.FC<{ang: number; dist: number}> = ({ang, dist}) => {
  const {camera} = useThree(); camera.position.set(Math.sin(ang) * dist, 1.2, Math.cos(ang) * dist); camera.lookAt(0.3, 0.2, 0); return null;
};
export const projectFrontal = (p: THREE.Vector3, ang: number, dist: number, w: number, h: number) => {
  const cam = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
  cam.position.set(Math.sin(ang) * dist, 1.2, Math.cos(ang) * dist); cam.lookAt(0.3, 0.2, 0); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const v = p.clone().project(cam); return {x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h};
};
export const frontalAngle = (f: number, fps: number, orbit = 0.9, sway = true) => orbit + (sway ? Math.sin(f / fps * 0.5) * 0.25 : 0);
// fibers: front (prefrontal) start points spread over the frontal pole, end in the thalamus
const makeFibers = () => {
  const out: {curve: THREE.CatmullRomCurve3; side: number}[] = [];
  for (const side of [1, -1]) for (let i = 0; i < 14; i++) {
    const a = random('fa' + side + i), b = random('fb' + side + i), c = random('fc' + side + i);
    const start = V(1.55 + 0.4 * a, 0.0 + 0.95 * b, side * (0.25 + 0.5 * c));
    const mid = V(CUT_X, 0.25 + 0.4 * b, side * (0.3 + 0.25 * c));
    const end = V(0.05 + 0.15 * a, 0.0 + 0.12 * b, side * (0.18 + 0.1 * c));
    out.push({curve: new THREE.CatmullRomCurve3([start, V((start.x + CUT_X) / 2, (start.y + mid.y) / 2 + 0.08, (start.z + mid.z) / 2), mid, V(0.5, (mid.y + end.y) / 2, (mid.z + end.z) / 2), end]), side});
  }
  return out;
};
const Fiber: React.FC<{curve: THREE.CatmullRomCurve3; glow: number; cut: number; t: number; seed: number}> = ({curve, glow, cut, t, seed}) => {
  // split the curve at the cut plane: points with x greater than CUT_X are "front"
  const {front, back} = useMemo(() => {
    const pts = curve.getPoints(60); const f: THREE.Vector3[] = [], b: THREE.Vector3[] = [];
    pts.forEach((p) => (p.x > CUT_X ? f : b).push(p));
    return {front: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(f.length > 1 ? f : [V(CUT_X, 0, 0), V(CUT_X + 0.01, 0, 0)]), 40, 0.026, 6, false),
      back: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(b.length > 1 ? b : [V(0, 0, 0), V(0.01, 0, 0)]), 40, 0.026, 6, false)};
  }, [curve]);
  const pulse = 0.75 + 0.25 * Math.sin(t * 5 + seed * 3);
  const dead = cut; // front part loses its light as the blade passes
  const live = '#ffb347';
  return (<group>
    <mesh geometry={back}><meshBasicMaterial color={live} transparent opacity={(0.25 + 0.75 * glow) * pulse} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <mesh geometry={front}><meshBasicMaterial color={dead > 0.5 ? '#5a6070' : live} transparent opacity={dead > 0.5 ? 0.35 : (0.25 + 0.75 * glow) * pulse * (1 - dead)} toneMapped={false} depthWrite={false}/></mesh>
  </group>);
};
export type FrontalProps = {width: number; height: number; glow?: number; cut?: number; lobe?: number; orbit?: number; dist?: number; sway?: boolean};
export const Frontal3D: React.FC<FrontalProps> = ({width, height, glow = 1, cut = 0, lobe = 0, orbit = 0.9, dist = 8.2, sway = true}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const ang = frontalAngle(f, fps, orbit, sway);
  const geo = useMemo(bumpy, []);
  const cereb = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  const fibers = useMemo(makeFibers, []);
  const sparks = useMemo(() => Array.from({length: 36}, (_, i) => ({p: V(CUT_X, 0.0 + 1.0 * random('sy' + i), (random('sz' + i) - 0.5) * 1.5), d: V(random('dx' + i) - 0.3, random('dy' + i) - 0.4, random('dz' + i) - 0.5).normalize()})), []);
  const bladeY = 1.6 - 2.0 * Math.min(1, cut * 1.2);
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 1.2, dist]}}>
      <Rig ang={ang} dist={dist}/>
      <ambientLight intensity={0.6}/><directionalLight position={[4, 6, 5]} intensity={1.4}/>
      <Ghost geo={geo} pos={[0, 0.45, 0.6]} scale={[2.2, 1.55, 0.95]}/>
      <Ghost geo={geo} pos={[0, 0.45, -0.6]} scale={[2.2, 1.55, 0.95]}/>
      <Ghost geo={cereb} pos={[-1.35, -0.85, 0]} scale={[0.85, 0.55, 1.1]} o={0.8}/>
      {lobe > 0 && <>
        <mesh position={[1.45, 0.5, 0.55]} scale={[0.8, 1.2, 0.85]}><sphereGeometry args={[1, 40, 28]}/><meshBasicMaterial color="#ff6a2a" transparent opacity={0.10 * lobe} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
        <mesh position={[1.45, 0.5, -0.55]} scale={[0.8, 1.2, 0.85]}><sphereGeometry args={[1, 40, 28]}/><meshBasicMaterial color="#ff6a2a" transparent opacity={0.10 * lobe} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      </>}
      <mesh position={[-0.55, -1.25, 0]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.22, 0.16, 1.4, 24]}/><meshBasicMaterial color="#c9d6e8" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      {[1, -1].map((s) => <mesh key={s} position={[0.1, 0.05, s * 0.25]}><sphereGeometry args={[0.2, 24, 16]}/><meshStandardMaterial color="#c0182b" emissive="#ff4a2a" emissiveIntensity={0.5 + 0.5 * glow} transparent opacity={0.9}/></mesh>)}
      {fibers.map((fb, i) => <Fiber key={i} curve={fb.curve} glow={glow} cut={cut} t={t} seed={i}/>)}
      {cut > 0.01 && cut < 0.99 && <><mesh position={[CUT_X, bladeY, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.04, 0.05, 1.7]}/><meshBasicMaterial color="#ffffff" toneMapped={false}/></mesh>
      <mesh position={[CUT_X, bladeY, 0]}><boxGeometry args={[0.06, 0.16, 1.8]}/><meshBasicMaterial color="#ffd23f" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/></mesh></>}
      {cut > 0.3 && cut < 1 && sparks.map((s, i) => { const k = (cut - 0.3) / 0.7; return (
        <mesh key={i} position={s.p.clone().add(s.d.clone().multiplyScalar(k * 0.9)).toArray() as [number, number, number]}><sphereGeometry args={[0.035 * (1 - k), 8, 6]}/><meshBasicMaterial color="#ffd23f" transparent opacity={1 - k} toneMapped={false}/></mesh>); })}
    </ThreeCanvas>
  );
};
