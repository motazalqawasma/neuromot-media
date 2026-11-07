import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow/600.css';

// Original 3D anatomy explainer (sciatica) in an "x-ray body + glowing nerve" style. #NeuroMot
const W = 1080, H = 1920, FPS = 30;
export const ANAT_TOTAL = 16 * FPS;
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const E = Easing.inOut(Easing.cubic);
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// ---------- camera path: [frame, position, target] ----------
const KEYS: [number, THREE.Vector3, THREE.Vector3][] = [
  [0, V(9.5, 2.6, 2.5), V(0, 2.2, -0.4)],
  [120, V(8.0, 1.9, 1.0), V(0, 1.6, -0.4)],
  [165, V(0, 0.8, -36), V(0, -0.2, 0)],
  [225, V(0, 0.8, -33), V(0.3, -0.2, 0)],
  [290, V(4.5, -4.2, -12), V(1.2, -4.6, -0.4)],
  [360, V(4.0, -7.2, -9), V(1.3, -7.8, 0)],
  [410, V(0, 0.3, -36), V(0, -0.2, 0)],
  [480, V(0, 0.3, -34), V(0, -0.2, 0)],
];
export const camAt = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && f > KEYS[i + 1][0]) i++;
  const [f0, p0, t0] = KEYS[i], [f1, p1, t1] = KEYS[i + 1];
  const k = E(Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
  return {pos: p0.clone().lerp(p1, k), tgt: t0.clone().lerp(t1, k)};
};

// ---------- anatomy geometry ----------
const VERT_Y = [4.4, 3.7, 3.0, 2.3, 1.6]; // L1..L5
const CORD = new THREE.CatmullRomCurve3([V(0, 8.2, -0.75), V(0, 6, -0.75), V(0, 4, -0.75), V(0, 2.4, -0.72)]);
const ROOTS: [string, THREE.CatmullRomCurve3][] = [
  ['L4', new THREE.CatmullRomCurve3([V(0, 2.4, -0.72), V(0.45, 2.0, -0.6), V(0.85, 1.0, -0.55), V(1.15, -0.6, -0.55)])],
  ['L5', new THREE.CatmullRomCurve3([V(0, 2.2, -0.72), V(0.35, 1.35, -0.62), V(0.8, 0.4, -0.6), V(1.15, -0.6, -0.55)])],
  ['S1', new THREE.CatmullRomCurve3([V(0, 2.0, -0.72), V(0.25, 0.95, -0.68), V(0.6, 0.2, -0.7), V(1.15, -0.6, -0.55)])],
  ['S2', new THREE.CatmullRomCurve3([V(0, 1.9, -0.75), V(0.2, 0.55, -0.85), V(0.6, -0.1, -0.75), V(1.15, -0.6, -0.55)])],
  ['S3', new THREE.CatmullRomCurve3([V(0, 1.8, -0.78), V(0.15, 0.25, -0.95), V(0.55, -0.35, -0.8), V(1.15, -0.6, -0.55)])],
];
const SCIATIC = new THREE.CatmullRomCurve3([V(1.15, -0.6, -0.55), V(1.3, -1.6, -0.75), V(1.25, -3.2, -0.6), V(1.3, -4.6, -0.5)]);
const TIBIAL = new THREE.CatmullRomCurve3([V(1.3, -4.6, -0.5), V(1.25, -6.2, -0.35), V(1.2, -7.9, -0.2), V(1.25, -8.7, 0.2), V(1.3, -8.9, 1.0)]);
const PERONEAL = new THREE.CatmullRomCurve3([V(1.3, -4.6, -0.5), V(1.75, -5.2, -0.1), V(1.6, -6.5, 0.35), V(1.45, -8.2, 0.6), V(1.4, -8.8, 1.1)]);
export const PTS = {
  disc: V(0.28, 1.25, -0.55), sciatic: V(1.3, -2.4, -0.7), tibial: V(1.22, -7.2, -0.25), foot: V(1.3, -8.85, 0.9), roots: V(0.6, 0.6, -0.7),
};

const Tube: React.FC<{curve: THREE.Curve<THREE.Vector3>; r: number; p: number; color: string; glow?: number}> = ({curve, r, p, color, glow = 0.22}) => {
  const g = useMemo(() => new THREE.TubeGeometry(curve, 160, r, 12, false), [curve, r]);
  const g2 = useMemo(() => new THREE.TubeGeometry(curve, 160, r * 2.6, 12, false), [curve, r]);
  const n = Math.floor((g.index!.count / 6) * Math.max(0, Math.min(1, p))) * 6;
  g.setDrawRange(0, n);
  g2.setDrawRange(0, n);
  return (<group>
    <mesh geometry={g}><meshBasicMaterial color={color} toneMapped={false}/></mesh>
    <mesh geometry={g2}><meshBasicMaterial color={color} transparent opacity={glow} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/></mesh>
  </group>);
};

const Ghost: React.FC<{geo: THREE.BufferGeometry; pos: [number, number, number]; rot?: [number, number, number]; scale?: [number, number, number]}> = ({geo, pos, rot = [0, 0, 0], scale = [1, 1, 1]}) => (
  <group position={pos} rotation={rot} scale={scale}>
    <mesh geometry={geo}><meshBasicMaterial color="#9fb3cc" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh geometry={geo}><meshBasicMaterial color="#c9d6e8" wireframe transparent opacity={0.03} depthWrite={false}/></mesh>
  </group>
);

const Body: React.FC = () => {
  const torso = useMemo(() => new THREE.CapsuleGeometry(1.9, 4.2, 12, 28), []);
  const pelvis = useMemo(() => new THREE.SphereGeometry(2.1, 28, 20), []);
  const thigh = useMemo(() => new THREE.CapsuleGeometry(0.85, 3.4, 10, 20), []);
  const calf = useMemo(() => new THREE.CapsuleGeometry(0.6, 3.3, 10, 20), []);
  const foot = useMemo(() => new THREE.CapsuleGeometry(0.35, 1.1, 8, 16), []);
  const head = useMemo(() => new THREE.SphereGeometry(1.05, 24, 18), []);
  const arm = useMemo(() => new THREE.CapsuleGeometry(0.42, 4.6, 8, 16), []);
  return (<group>
    <Ghost geo={torso} pos={[0, 4.4, 0]} scale={[1, 1, 0.62]}/>
    <Ghost geo={pelvis} pos={[0, 0.2, 0]} scale={[1.05, 0.75, 0.62]}/>
    <Ghost geo={head} pos={[0, 9.4, 0]}/>
    {[-1, 1].map(s => (<group key={s}>
      <Ghost geo={thigh} pos={[s * 1.25, -2.6, -0.1]}/>
      <Ghost geo={calf} pos={[s * 1.25, -6.6, -0.1]}/>
      <Ghost geo={foot} pos={[s * 1.3, -8.95, 0.55]} rot={[Math.PI / 2, 0, 0]}/>
      <Ghost geo={arm} pos={[s * 2.65, 4.0, 0]} rot={[0, 0, s * 0.12]}/>
    </group>))}
  </group>);
};

const Bone = '#e9dcc3';
const Spine: React.FC<{pulse: number; show: number}> = ({pulse, show}) => {
  const body = useMemo(() => new THREE.CylinderGeometry(0.55, 0.55, 0.42, 28), []);
  const proc = useMemo(() => new THREE.BoxGeometry(0.22, 0.3, 0.9), []);
  const trans = useMemo(() => new THREE.BoxGeometry(1.7, 0.16, 0.18), []);
  const disc = useMemo(() => new THREE.CylinderGeometry(0.56, 0.56, 0.18, 28), []);
  const sac = useMemo(() => new THREE.CylinderGeometry(0.5, 0.15, 1.1, 24), []);
  const bulge = useMemo(() => new THREE.SphereGeometry(0.28, 24, 16), []);
  const mat = <meshStandardMaterial color={Bone} roughness={0.55} transparent opacity={show}/>;
  return (<group>
    {VERT_Y.map((y, i) => (<group key={i} position={[0, y, 0]}>
      <mesh geometry={body}>{mat}</mesh>
      <mesh geometry={proc} position={[0, -0.05, -0.95]} rotation={[0.35, 0, 0]}>{mat}</mesh>
      <mesh geometry={trans} position={[0, 0.02, -0.55]}>{mat}</mesh>
      {i < 4 && <mesh geometry={disc} position={[0, -0.35, 0]}><meshStandardMaterial color="#b8c4d6" transparent opacity={0.85 * show}/></mesh>}
    </group>))}
    {/* L5–S1 disc: herniated (purple) */}
    <mesh geometry={disc} position={[0, 1.25, 0]}><meshStandardMaterial color="#9b7cff" emissive="#6a3cff" emissiveIntensity={0.6} transparent opacity={0.95 * show}/></mesh>
    <mesh geometry={bulge} position={[0.22, 1.25, -0.42]} scale={[1, 0.55, 1]}><meshStandardMaterial color="#a98bff" emissive="#7a4dff" emissiveIntensity={0.8} transparent opacity={show}/></mesh>
    {/* red pulse where the disc presses the S1 root */}
    <mesh geometry={bulge} position={PTS.disc.toArray() as [number, number, number]} scale={0.6 + 0.9 * pulse}>
      <meshBasicMaterial color="#ff3b3b" transparent opacity={0.55 * (1 - pulse) * show} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </mesh>
    <mesh geometry={sac} position={[0, 0.45, -0.25]} rotation={[-0.4, 0, Math.PI]}>{mat}</mesh>
  </group>);
};

const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  const c = camAt(f);
  camera.position.copy(c.pos);
  camera.lookAt(c.tgt);
  return null;
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = (f % 24) / 24;
  const cordP = interpolate(f, [150, 200], [0, 1], cl);
  const rootP = (i: number) => interpolate(f, [195 + i * 12, 240 + i * 12], [0, 1], cl);
  const sciP = interpolate(f, [255, 300], [0, 1], cl);
  const legP = interpolate(f, [295, 365], [0, 1], cl);
  const spineShow = 1;
  // traveling "pain" light along the whole path at the end
  const travel = interpolate(f, [400, 470], [0, 1], cl);
  const path = useMemo(() => new THREE.CurvePath<THREE.Vector3>(), []);
  if (path.curves.length === 0) { path.add(ROOTS[2][1]); path.add(SCIATIC); path.add(TIBIAL); }
  const dot = path.getPointAt(Math.min(0.999, travel));
  return (<>
    <Rig/>
    <ambientLight intensity={0.6}/>
    <directionalLight position={[5, 8, 6]} intensity={1.6}/>
    <directionalLight position={[-6, 2, -8]} intensity={0.8} color="#8fb2ff"/>
    <Body/>
    <Spine pulse={pulse} show={spineShow}/>
    <Tube curve={CORD} r={0.07} p={f < 150 ? 1 : cordP} color="#ff7a1a"/>
    {ROOTS.map(([n, c], i) => <Tube key={n} curve={c} r={0.045} p={f < 150 ? (n === 'S1' ? 1 : 0) : rootP(i)} color={n === 'S1' && f < 160 ? '#ff5a3c' : '#ff8a2a'}/>)}
    <Tube curve={SCIATIC} r={0.09} p={sciP} color="#ff7a1a"/>
    <Tube curve={TIBIAL} r={0.06} p={legP} color="#ff7a1a"/>
    <Tube curve={PERONEAL} r={0.05} p={legP} color="#ff9a40" glow={0.18}/>
    {travel > 0 && travel < 1 && <mesh position={dot}><sphereGeometry args={[0.22, 16, 12]}/><meshBasicMaterial color="#ff3b3b" transparent opacity={0.9} toneMapped={false}/></mesh>}
  </>);
};

// ---------- 2D overlays ----------
const proj = (f: number, p: THREE.Vector3) => {
  const c = camAt(f);
  const cam = new THREE.PerspectiveCamera(35, W / H, 0.1, 200);
  cam.position.copy(c.pos); cam.lookAt(c.tgt); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = p.clone().project(cam);
  return {x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, vis: v.z < 1};
};
const Tag: React.FC<{p: THREE.Vector3; text: string; from: number; to: number; dx?: number; dy?: number}> = ({p, text, from, to, dx = 30, dy = -70}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 8, to - 8, to], [0, 1, 1, 0], cl);
  if (o <= 0) return null;
  const {x, y} = proj(f, p);
  return (<>
    <svg style={{position: 'absolute', left: 0, top: 0, opacity: o}} width={W} height={H}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + 30} stroke="#e8edf5" strokeWidth={3}/>
      <circle cx={x} cy={y} r={7} fill="#fff"/>
    </svg>
    <div style={{position: 'absolute', left: x + dx, top: y + dy, opacity: o, background: 'rgba(235,240,248,0.92)', color: '#16171B', fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 40, padding: '6px 18px', borderRadius: 10}}>{text}</div>
  </>);
};
const Legend: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [190, 200, 280, 292], [0, 1, 1, 0], cl);
  const roots = ['L4', 'L5', 'S1', 'S2', 'S3'];
  return (<div style={{position: 'absolute', left: 60, top: 1080, opacity: o, background: 'rgba(20,22,26,0.75)', border: '2px solid rgba(255,255,255,.15)', borderRadius: 18, padding: '20px 30px', fontFamily: "'Barlow', sans-serif", color: '#fff'}}>
    <div style={{fontWeight: 600, fontSize: 40, marginBottom: 10}}>Sciatic nerve roots</div>
    {roots.map((r, i) => {const s = interpolate(f, [198 + i * 12, 206 + i * 12], [0, 1], cl); return (
      <div key={r} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 600, opacity: s, transform: `translateX(${(1 - s) * -20}px)`}}>
        <span style={{width: 34, color: '#9aa3b2'}}>{i + 1}</span><span style={{width: 18, height: 18, borderRadius: 9, background: '#3db2ff', display: 'inline-block'}}/>{r}
      </div>);})}
  </div>);
};
const CAPS: [number, number, string][] = [
  [8, 118, 'Why can a problem in your lower back hurt all the way down to your foot?'],
  [122, 160, 'A slipped disc presses on a nerve root.'],
  [168, 248, 'Trace the nerves from the spine into the leg.'],
  [250, 300, 'Roots L4 to S3 join to form the sciatic nerve —'],
  [302, 398, 'it runs through the buttock and down the leg… all the way to the foot.'],
  [402, 480, 'Pinch it at the spine, feel it in the foot. That’s sciatica.'],
];
const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPS.find(([a, b]) => f >= a && f <= b);
  if (!c) return null;
  const o = interpolate(f, [c[0], c[0] + 8, c[1] - 6, c[1]], [0, 1, 1, 0], cl);
  return <div style={{position: 'absolute', left: 90, right: 90, top: 1470, textAlign: 'center', opacity: o, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 56, lineHeight: 1.18, color: '#f2f4f8', textShadow: '0 2px 12px rgba(0,0,0,.9)'}}>{c[2]}</div>;
};

export const Anatomy: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 10], [0, 1], cl);
  return (<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #1d2026 0%, #0b0c0f 75%)'}}>
    <Audio src={staticFile('anat_sfx.wav')} volume={0.4}/>
    <AbsoluteFill style={{opacity: fadeIn}}>
      <ThreeCanvas width={W} height={H} camera={{fov: 35, near: 0.1, far: 200, position: [7.5, 1.6, 1.5]}}>
        <Scene/>
      </ThreeCanvas>
    </AbsoluteFill>
    <Tag p={PTS.disc} text="Herniated disc (L5–S1)" from={40} to={150} dx={-430} dy={-170}/>
    <Tag p={PTS.sciatic} text="Sciatic nerve" from={262} to={300} dx={60} dy={-60}/>
    <Tag p={PTS.tibial} text="Tibial nerve" from={330} to={400} dx={60} dy={-90}/>
    <Legend/>
    <Caption/>
    <div style={{position: 'absolute', top: 60, left: 64, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 40, color: 'rgba(242,242,244,.7)'}}>#NeuroMot</div>
    <div style={{position: 'absolute', top: 54, right: 64, background: '#E0263A', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 32, padding: '8px 20px', borderRadius: 30, letterSpacing: 2}}>ANATOMY IN 15 s</div>
  </AbsoluteFill>);
};
