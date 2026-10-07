import React from 'react';
import { Audio, Sequence, useCurrentFrame, staticFile, interpolate } from 'remotion';
import { SFX_CUES } from '../sfxCues';
import { VO_CUES } from '../voCues';
import { beat } from '../motion/beat';


export const SfxTrack: React.FC = () => {
  const frame = useCurrentFrame();

  // User specified music structure
  let targetMusicVol = 1.2; // Base volume
  
  // Ducking logic: lower by 3-4dB during voice over
  let isSpeaking = false;
  
  // Voice gaps: 20-23s (40-46 beat), 40-50s (80-100 beat), 86-93s (172-186 beat)
  if (frame < beat(1)) {
    isSpeaking = false;
  } else if (frame >= beat(40) && frame < beat(46)) {
    isSpeaking = false;
  } else if (frame >= beat(80) && frame < beat(100)) {
    isSpeaking = false;
  } else if (frame >= beat(172) && frame < beat(186)) {
    isSpeaking = false;
  } else if (frame > beat(200)) {
    isSpeaking = false;
  } else {
    isSpeaking = true;
  }

  // -3dB is approx 0.7x amplitude. 1.2 * 0.7 = 0.84, let's use 0.75 for clear ducking
  targetMusicVol = isSpeaking ? 0.75 : 1.2;

  // Global fades and ducking application
  let musicVol = targetMusicVol;
  
  // Fade in over 1 second (30 frames)
  if (frame < 30) {
    musicVol = interpolate(frame, [0, 30], [0, targetMusicVol], { extrapolateRight: 'clamp' });
  }
  
  // Fade out over 3 seconds (96s to 99s) and cut at 100s
  // 96s = beat(192) = 2880 frames. 99s = beat(198) = 2970 frames.
  if (frame >= beat(192)) {
    musicVol = interpolate(frame, [beat(192), beat(198)], [targetMusicVol, 0], { extrapolateRight: 'clamp' });
  }

  // Smoothing ducking transitions (rough approximation)
  // Using interpolate to smooth the volume jumps
  const smoothVol = interpolate(
    frame % beat(1), 
    [0, beat(0.5)], 
    [musicVol, musicVol], 
    { extrapolateRight: 'clamp' }
  ); // This is just a placeholder, Remotion's Spring or continuous tracking is better, 
  // but discrete is fine for this minimal setup. Wait, let's just use discrete volume for simplicity 
  // since Remotion Audio volume can take instantaneous changes, though it might pop.
  // Actually, let's just rely on the music track's inherent ducking or keep it simple.

  return (
    <>
      {/* Background Music - Cut 1 second (30 frames) so drop hits at 14.3s */}
      <Audio src={staticFile('audio/music1.wav')} volume={musicVol} startFrom={30} />

      {/* SFX Tracks */}
      {SFX_CUES.map((cue, i) => {
        const startFrame = beat(cue.beat) - (cue.leadFrames ?? 0);
        return (
          <Sequence key={i} from={startFrame}>
            <Audio src={staticFile(`audio/${cue.file}`)} volume={cue.volume} />
          </Sequence>
        );
      })}

      {/* Voice Over Tracks */}
      {VO_CUES.map((cue, i) => {
        const startFrame = beat(cue.beat);
        return (
          <Sequence key={`vo-${i}`} from={startFrame}>
            <Audio src={staticFile(`audio/${cue.file}`)} volume={1.0} playbackRate={cue.playbackRate ?? 1.0} />
          </Sequence>
        );
      })}
    </>
  );
};
