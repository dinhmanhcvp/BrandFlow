import React from 'react';
import { CameraRig, Shot } from './CameraRig';
import { DeviceFrame } from '../motion/DeviceFrame';
import { FxStage } from './FxStage';
import { useCurrentFrame, interpolate } from 'remotion';

export const SceneShell: React.FC<{
 screen: React.ReactNode;
 tilt: 'hero' | 'soft' | 'flat';
 shots: Shot[];
 children?: React.ReactNode;
}> = ({ screen, tilt, shots, children }) => {
 const frame = useCurrentFrame();
 return (
  <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>

   <CameraRig shots={shots}>
    {/* Device Frame creates the tilt depending on the camera rig base. Wait, the CameraRig currently just scales and translates. It doesn't handle the 3D tilt? */}
    {/* Dynamic 3D Orbit Effect */}
    <div style={{ 
     transform: tilt === 'flat' ? 'none' : 
           `rotateX(${tilt === 'hero' ? 15 : 5}deg) rotateY(${Math.sin(frame / 40) * (tilt === 'hero' ? 15 : 5)}deg) rotateZ(${tilt === 'hero' ? 2 : 0}deg)`,
     transformStyle: 'preserve-3d',
     width: '100%',
     height: '100%',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center'
    }}>
     <DeviceFrame className="w-[1440px] h-[900px]">
      <FxStage width={1440} height={900}>
       {screen}
       {/* Overlays (PopCard, FocusMask, Cursor, Flare, etc) go here so they share FxStage coordinate system */}
       {children}
      </FxStage>
     </DeviceFrame>
    </div>
   </CameraRig>

   {/* Vignette */}
   <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.35) 150%)' }} />
  </div>
 );
};
