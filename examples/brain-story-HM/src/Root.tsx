import React from 'react';
import {Composition} from 'remotion';
import {Video, TOTAL} from './Video';
import {Cover} from './Cover';
import {Slides} from './Slides';
import {Anatomy, ANAT_TOTAL} from './Anatomy';
export const Root: React.FC = () => (
  <>
  <Composition id="Anatomy" component={Anatomy} durationInFrames={ANAT_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="Slides" component={Slides} durationInFrames={6} fps={30} width={1080} height={1440} />
  <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="NeuroMot" component={Video} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
  </>
);
