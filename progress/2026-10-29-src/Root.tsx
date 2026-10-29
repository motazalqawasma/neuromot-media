import React from 'react';
import {Composition} from 'remotion';
import {Video, TOTAL} from './Video';
import {Cover} from './Cover';
import {Slide} from './Carousel';
export const Root: React.FC = () => (
  <>
  <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="NeuroMot" component={Video} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="Slide" component={Slide as any} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{i:0}} />
  </>
);
