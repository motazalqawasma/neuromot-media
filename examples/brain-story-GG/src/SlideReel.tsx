import React from 'react';
import {AbsoluteFill, Img, Sequence, Audio, staticFile, useCurrentFrame, interpolate} from 'remotion';
// Facebook slideshow reel: cover first (0.4 s), then the 6 carousel slides, ~2.6 s each, slow zoom + slide-in
export const PER = 78; const COVER = 12;
export const REEL_TOTAL = COVER + 6 * PER;
const Slide: React.FC<{i:number}> = ({i}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, PER], [1.0, 1.06]); const inP = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (<AbsoluteFill style={{background:'#1A1B20', alignItems:'center', justifyContent:'center'}}>
    <Img src={staticFile(`slides/s${i + 1}.jpg`)} style={{width:1080, height:1440, transform:`translateX(${(1 - inP) * 120}px) scale(${z})`, opacity:inP}}/>
    <div style={{position:'absolute', bottom:330, left:0, right:0, display:'flex', justifyContent:'center', gap:14}}>
      {Array.from({length:6}, (_, k) => <div key={k} style={{width:k === i ? 44 : 16, height:16, borderRadius:8, background:k === i ? '#F28C28' : '#555'}}/>)}
    </div>
  </AbsoluteFill>);
};
export const SlideReel: React.FC = () => (<AbsoluteFill style={{background:'#1A1B20'}}>
  <Sequence from={0} durationInFrames={COVER}><Img src={staticFile('cover.png')} style={{width:1080, height:1920}}/></Sequence>
  <Sequence from={COVER}><Audio src={staticFile('reel_sfx.wav')} volume={0.5}/></Sequence>
  {Array.from({length:6}, (_, i) => <Sequence key={i} from={COVER + i * PER} durationInFrames={PER}><Slide i={i}/></Sequence>)}
</AbsoluteFill>);
