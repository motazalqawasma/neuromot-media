import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {random} from 'remotion';
import * as THREE from 'three';

// x-ray brain seen from BEHIND and a little above (front = +x, up = +y, the person's LEFT = -z),
// so the person's left half is on the LEFT of the screen. Two hemispheres + the corpus callosum
// (a band of glowing fibers joining them). `cut` (0..1) breaks every fiber in the middle with sparks
// and moves the halves a little apart. `left`/`right` light one hemisphere (blue / orange).
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export const SPLIT_ORBIT = -Math.PI / 2;
const bumpy = () => {
  const g = new THREE.SphereGeometry(1, 96, 64);
  const p = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 0.035 * Math.sin(v.x * 13 + v.y * 7) * Math.sin(v.y * 11 - v.z * 9) + 0.02 * Math.sin(v.z * 17 + v.x * 5); v.multiplyScalar(1 + n); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g;
};
const Rig: React.FC<{ang: number; dist: number; h: number}> = ({ang, dist, h}) => {
  const {camera} = useThree(); camera.position.set(Math.sin(ang) * dist, h, Math.cos(ang) * dist); camera.lookAt(0, 0.3, 0); return null;
};
export const projectSplit = (p: THREE.Vector3, ang: number, dist: number, h: number, w: number, hh: number) => {
  const cam = new THREE.PerspectiveCamera(35, w / hh, 0.1, 100);
  cam.position.set(Math.sin(ang) * dist, h, Math.cos(ang) * dist); cam.lookAt(0, 0.3, 0); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const v = p.clone().project(cam); return {x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * hh};
};
const Half: React.FC<{geo: THREE.BufferGeometry; z: number; glow: number; color: string}> = ({geo, z, glow, color}) => (
  <group position={[0, 0.45, z]} scale={[2.2, 1.45, 0.74]}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color="#F28C28" wireframe transparent opacity={0.065} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    {glow > 0 && <mesh geometry={geo}><meshBasicMaterial color={color} transparent opacity={0.16 * glow} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>}
    {glow > 0 && <mesh geometry={geo} scale={[1.002, 1.002, 1.002]}><meshBasicMaterial color={color} wireframe transparent opacity={0.5 * glow} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>}
  </group>
);
export type SplitProps = {width: number; height: number; bridge?: number; cut?: number; left?: number; right?: number; dist?: number; orbit?: number; camH?: number; pulse?: number};
export const Split3D: React.FC<SplitProps> = ({width, height, bridge = 0, cut = 0, left = 0, right = 0, dist = 9, orbit = SPLIT_ORBIT, camH = 5.5, pulse = 0}) => {
  const geo = useMemo(bumpy, []);
  const fibers = useMemo(() => Array.from({length: 26}, (_, i) => {
    const x = -1.25 + 2.5 * (i / 25) + (random('fx' + i) - 0.5) * 0.08;
    const y = 0.15 + 0.22 * Math.sin((i / 25) * Math.PI) + (random('fy' + i) - 0.5) * 0.06;
    return {x, y, lift: 0.18 + random('fl' + i) * 0.1};
  }), []);
  const gap = 0.22 * cut; // halves drift apart
  const zL = -0.78 - gap, zR = 0.78 + gap;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, camH, dist]}}>
      <Rig ang={orbit} dist={dist} h={camH}/>
      <ambientLight intensity={0.6}/>
      <Half geo={geo} z={zL} glow={left} color="#4FA3FF"/>
      <Half geo={geo} z={zR} glow={right} color="#F28C28"/>
      {bridge > 0 && fibers.map((fb, i) => {
        const a = V(fb.x, fb.y, zL + 0.42), m = V(fb.x, fb.y + fb.lift, 0), b = V(fb.x, fb.y, zR - 0.42);
        const pts = new THREE.CatmullRomCurve3([a, m, b]).getPoints(24);
        const halfA = pts.slice(0, 12 + 1), halfB = pts.slice(12);
        const shrink = cut; // each half retracts toward its own side
        const take = (arr: THREE.Vector3[], fromStart: boolean) => { const n = Math.max(2, Math.round(arr.length * (1 - 0.55 * shrink))); return fromStart ? arr.slice(0, n) : arr.slice(arr.length - n); };
        const col = cut > 0.05 ? '#9aa3b5' : '#FFD23F';
        const op = (0.85 - 0.45 * cut) * bridge * (0.75 + 0.25 * Math.sin(pulse * 6.28 + i));
        const mk = (arr: THREE.Vector3[], k: string) => {
          if (arr.length < 2) return null;
          const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arr), 16, 0.028, 6, false);
          return <mesh key={k} geometry={tube}><meshBasicMaterial color={col} transparent opacity={op} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>;
        };
        return cut <= 0 ? mk(pts, 'f' + i) : <React.Fragment key={'g' + i}>{mk(take(halfA, true), 'a' + i)}{mk(take(halfB, false), 'b' + i)}</React.Fragment>;
      })}
      {cut > 0 && cut < 1 && fibers.map((fb, i) => i % 2 === 0 ? (
        <mesh key={'s' + i} position={[fb.x + (random('sx' + i) - 0.5) * 0.6 * cut, fb.y + fb.lift + 0.5 * cut * random('sy' + i), (random('sz' + i) - 0.5) * 0.9 * cut]} scale={[1 - cut, 1 - cut, 1 - cut]}>
          <sphereGeometry args={[0.07, 10, 8]}/><meshBasicMaterial color="#FFD23F" transparent opacity={0.9} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending}/>
        </mesh>) : null)}
    </ThreeCanvas>
  );
};
