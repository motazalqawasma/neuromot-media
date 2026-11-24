import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cover} from './Cover';
const R: React.FC = () => (<Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />);
registerRoot(R);
