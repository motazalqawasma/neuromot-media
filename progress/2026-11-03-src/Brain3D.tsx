import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// Real 3D "x-ray brain": ghost hemispheres with a glowing wireframe, a LOBAR clot near the surface
// (red pulse) and a DEEP basal-ganglia clot. A thin port slides in through a sulcus and the clot shrinks.
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const LOBAR = V(1.25, 1.05, 0.55);
export const DEEP = V(0.45, 0.05, 0.15);
const ENTRY = V(2.9, 2.8, 1.0);

// brain-like hemisphere: sphere with gentle gyri-ish displacement
const hemi = () => {
  const g = new THREE.SphereGeometry(1.0, 96, 64);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 0.035 * Math.sin(v.x * 13 + v.y * 7) * Math.sin(v.y * 11 - v.z * 9) + 0.02 * Math.sin(v.z * 17 + v.x * 5);
    v.multiplyScalar(1 + n);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
};

const Ghost: React.FC<{geo: THREE.BufferGeometry; pos: [number, number, number]; scale: [number, number, number]; o?: number}> = ({geo, pos, scale, o = 1}) => (
  <group position={pos} scale={scale}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.07 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color="#F28C28" wireframe transparent opacity={0.07 * o} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
  </group>
);

export type BrainProps = {
  width: number; height: number;
  tubeIn?: number;      // 0..1 port slides toward the lobar clot
  remove?: number;      // 0..1 lobar clot shrinks (to ~12% volume)
  deep?: number;        // 0..1 deep clot visible
  lobar?: number;       // 0..1 lobar clot visible
  orbit?: number;       // camera angle offset (rad)
  dist?: number;        // camera distance
  sway?: boolean;
};

const Rig: React.FC<{ang: number; dist: number}> = ({ang, dist}) => {
  const {camera} = useThree();
  camera.position.set(Math.sin(ang) * dist, 0.9, Math.cos(ang) * dist);
  camera.lookAt(0.3, 0.35, 0);
  return null;
};
export const camFor = (ang: number, dist: number) => {
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  cam.position.set(Math.sin(ang) * dist, 0.9, Math.cos(ang) * dist);
  cam.lookAt(0.3, 0.35, 0);
  return cam;
};
// project a 3D point to pixel coords inside a canvas of size w×h
export const project = (p: THREE.Vector3, ang: number, dist: number, w: number, h: number) => {
  const cam = camFor(ang, dist); cam.aspect = w / h; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const v = p.clone().project(cam);
  return {x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h};
};
export const brainAngle = (f: number, fps: number, orbit = 0, sway = true) => orbit + (sway ? Math.sin(f / fps * 0.5) * 0.35 : 0);

export const Brain3D: React.FC<BrainProps> = ({width, height, tubeIn = 0, remove = 0, deep = 0, lobar = 1, orbit = 0, dist = 8, sway = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const pulse = (f % 26) / 26;
  const ang = brainAngle(f, fps, orbit, sway);
  const g = useMemo(hemi, []);
  const cereb = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  const stem = useMemo(() => new THREE.CylinderGeometry(0.22, 0.16, 1.4, 24), []);
  const clot = useMemo(() => new THREE.SphereGeometry(0.42, 40, 30), []);
  const ring = useMemo(() => new THREE.SphereGeometry(0.42, 24, 16), []);
  // port (tube) from ENTRY toward LOBAR
  const dir = LOBAR.clone().sub(ENTRY);
  const len = dir.length();
  const tip = ENTRY.clone().add(dir.clone().multiplyScalar(0.25 + 0.68 * tubeIn));
  const mid = ENTRY.clone().add(tip).multiplyScalar(0.5);
  const tubeLen = ENTRY.distanceTo(tip) + 1.6;
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize());
  const back = ENTRY.clone().sub(dir.clone().normalize().multiplyScalar(0.8));
  const midAll = back.clone().add(tip).multiplyScalar(0.5);
  const s = lobar * (1 - 0.5 * remove) * (1 + 0.05 * Math.sin(t * 6)); // radius shrink ~ volume to ~12%
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 0.9, dist]}}>
      <Rig ang={ang} dist={dist}/>
      <ambientLight intensity={0.6}/>
      <directionalLight position={[4, 6, 5]} intensity={1.5}/>
      <directionalLight position={[-5, -2, -4]} intensity={0.6} color="#7a8cff"/>
      {/* hemispheres, cerebellum, brainstem */}
      <Ghost geo={g} pos={[0, 0.45, 0.62]} scale={[2.25, 1.55, 0.95]}/>
      <Ghost geo={g} pos={[0, 0.45, -0.62]} scale={[2.25, 1.55, 0.95]}/>
      <Ghost geo={cereb} pos={[-1.35, -0.85, 0]} scale={[0.85, 0.55, 1.1]} o={0.9}/>
      <mesh geometry={stem} position={[-0.55, -1.25, 0]} rotation={[0, 0, -0.35]}><meshBasicMaterial color="#c9d6e8" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      {/* lobar clot (near the surface) */}
      {lobar > 0.01 && <group position={LOBAR.toArray() as [number, number, number]}>
        <mesh geometry={clot} scale={s}><meshStandardMaterial color="#8b0f1c" emissive="#c0182b" emissiveIntensity={0.55} roughness={0.4}/></mesh>
        <mesh geometry={ring} scale={s * (1 + 1.3 * pulse)}><meshBasicMaterial color="#ff3b3b" transparent opacity={0.45 * (1 - pulse) * lobar} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
        <pointLight color="#ff4a3a" intensity={2.5 * lobar} distance={3}/>
      </group>}
      {/* deep (basal ganglia) clot */}
      {deep > 0.01 && <group position={DEEP.toArray() as [number, number, number]}>
        <mesh geometry={clot} scale={0.85 * deep}><meshStandardMaterial color="#5a1020" emissive="#b01e30" emissiveIntensity={0.7} roughness={0.5} transparent opacity={deep}/></mesh>
        <mesh geometry={ring} scale={0.85 * (1 + 1.2 * pulse) * deep}><meshBasicMaterial color="#ff6b6b" transparent opacity={0.35 * (1 - pulse) * deep} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      </group>}
      {/* the port */}
      {tubeIn > 0.001 && <group position={midAll.toArray() as [number, number, number]} quaternion={q}>
        <mesh><cylinderGeometry args={[0.09, 0.09, back.distanceTo(tip), 24]}/><meshStandardMaterial color="#d9dde6" metalness={0.8} roughness={0.25} emissive="#F28C28" emissiveIntensity={0.15}/></mesh>
        <mesh><cylinderGeometry args={[0.2, 0.2, back.distanceTo(tip), 24]}/><meshBasicMaterial color="#F28C28" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      </group>}
    </ThreeCanvas>
  );
};
