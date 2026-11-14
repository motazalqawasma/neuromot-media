import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

// x-ray brain (front = +x, up = +y, the person's LEFT = -z). The camera sits on the -z side,
// so we look at the left side of the head and the nose points to the left of the screen.
// `lobe` lights the left frontal lobe, `dark` (0..1) turns it grey, `rod` (0..1) moves a bright
// line (the tamping iron's path) from under the left cheek up and out through the top of the head.
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const G_ORBIT = Math.PI - 0.9;
export const LFRONT_PT = V(1.45, 0.75, -0.55);
export const ROD_A = V(1.75, -2.3, -0.95); // below the left cheek
export const ROD_B = V(1.05, 2.9, -0.2);   // out of the top, near the midline
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
  const {camera} = useThree(); camera.position.set(Math.sin(ang) * dist, 1.2, Math.cos(ang) * dist); camera.lookAt(0.3, 0.2, 0); return null;
};
const Seg: React.FC<{a: THREE.Vector3; b: THREE.Vector3; r: number; color: string; o: number}> = ({a, b, r, color, o}) => {
  const mid = a.clone().add(b).multiplyScalar(0.5); const len = a.distanceTo(b);
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
  return <mesh position={mid.toArray() as [number, number, number]} quaternion={q}><cylinderGeometry args={[r * 0.35, r, len, 16]}/><meshBasicMaterial color={color} transparent opacity={o} toneMapped={false} depthWrite={false}/></mesh>;
};
export const BROCA_PT = V(1.55, -0.25, -0.98); // left inferior frontal gyrus (Broca's area)
export type GageProps = {width: number; height: number; lobe?: number; dark?: number; rod?: number; path?: number; dist?: number; spot?: number; pulse?: number};
export const Gage3D: React.FC<GageProps> = ({width, height, lobe = 1, dark = 0, rod = 0, path = 0, dist = 8.6, spot = 0, pulse = 0}) => {
  const geo = useMemo(bumpy, []);
  const cereb = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  const L = 0.42; // rod length as a share of the path
  const t0 = Math.max(0, rod * (1 + L) - L), t1 = Math.min(1, rod * (1 + L));
  const at = (t: number) => ROD_A.clone().lerp(ROD_B, t);
  const lit = new THREE.Color('#ff6a2a').lerp(new THREE.Color('#5a6070'), dark);
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 1.2, dist]}}>
      <Rig ang={G_ORBIT} dist={dist}/>
      <ambientLight intensity={0.6}/>
      <Ghost geo={geo} pos={[0, 0.45, 0.6]} scale={[2.2, 1.55, 0.95]}/>
      <Ghost geo={geo} pos={[0, 0.45, -0.6]} scale={[2.2, 1.55, 0.95]}/>
      <Ghost geo={cereb} pos={[-1.35, -0.85, 0]} scale={[0.85, 0.55, 1.1]} o={0.8}/>
      <mesh position={[-0.55, -1.25, 0]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.22, 0.16, 1.4, 24]}/><meshBasicMaterial color="#c9d6e8" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      {lobe > 0 && <>
        <mesh position={[1.45, 0.55, -0.55]} scale={[0.82, 1.2, 0.8]}><sphereGeometry args={[1, 40, 28]}/><meshBasicMaterial color={lit} transparent opacity={(0.34 - 0.12 * dark) * lobe} depthWrite={false} blending={dark > 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending}/></mesh>
        <mesh position={[1.45, 0.55, -0.55]} scale={[0.82, 1.2, 0.8]}><sphereGeometry args={[1, 22, 14]}/><meshBasicMaterial color={lit} wireframe transparent opacity={0.45 * lobe} depthWrite={false}/></mesh>
      </>}
      {spot > 0 && <>
        <mesh position={BROCA_PT.toArray() as [number, number, number]} scale={[0.5, 0.36, 0.3]}><sphereGeometry args={[1, 32, 20]}/><meshBasicMaterial color="#E0263A" transparent opacity={0.75 * spot} toneMapped={false} depthWrite={false}/></mesh>
        <mesh position={BROCA_PT.toArray() as [number, number, number]} scale={[0.5 * (1 + 0.5 * pulse), 0.36 * (1 + 0.5 * pulse), 0.3 * (1 + 0.5 * pulse)]}><sphereGeometry args={[1, 32, 20]}/><meshBasicMaterial color="#ff4a4a" transparent opacity={0.35 * spot * (1 - pulse)} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      </>}
      {path > 0 && <Seg a={ROD_A} b={ROD_B} r={0.035} color="#ffd23f" o={0.35 * path}/>}
      {rod > 0 && rod < 1 && t1 > t0 && <>
        <Seg a={at(t0)} b={at(t1)} r={0.085} color="#ffffff" o={1}/>
        <Seg a={at(t0)} b={at(t1)} r={0.2} color="#ffd23f" o={0.3}/>
      </>}
    </ThreeCanvas>
  );
};
