import React from 'react';
import {Composition} from 'remotion';
import {Video, TOTAL} from './Video';
import {Banner} from './Banner';
import {Cover} from './Cover';
export const Root: React.FC = () => (
  <>
  <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="NeuroMot" component={Video} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
  </>
);
