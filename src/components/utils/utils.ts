import React from 'react';
import chest from 'assets/sounds/chest/chest.mp3';
import chestspawn from 'assets/sounds/chest/chestspawn.mp3';
import slot from 'assets/sounds/slot/slot.mp3';
import wooddrop2 from 'assets/sounds/materials/wooddrop2.mp3';
import wooddrop3 from 'assets/sounds/materials/wooddrop3.mp3';
import wooddrop4 from 'assets/sounds/materials/wooddrop4.mp3';
import woodpickup1 from 'assets/sounds/materials/woodpickup1.mp3';
import woodpickup2 from 'assets/sounds/materials/woodpickup2.mp3';
import woodpickup3 from 'assets/sounds/materials/woodpickup3.mp3';
import fire from 'assets/sounds/fire/fire.mp3';
import tabletpick from 'assets/sounds/chest/tabletpick.mp3';

// Pre-initialize Audio objects
const chestAudio = new Audio(chest);
const chestspawnAudio = new Audio(chestspawn);
const slotAudio = new Audio(slot);
const wooddropAudios = [new Audio(wooddrop2), new Audio(wooddrop3), new Audio(wooddrop4)];
const woodpickupAudios = [new Audio(woodpickup1), new Audio(woodpickup2), new Audio(woodpickup3)];
const fireAudio = new Audio(fire);
const tabletpickAudio = new Audio(tabletpick);

export function playAudio(audioObj: HTMLAudioElement, volume = 0.7) {
  audioObj.currentTime = 0;
  audioObj.volume = volume;
  audioObj.play();
}

export function playRandomAudio(audioObjs: HTMLAudioElement[], volume = 0.7) {
  const idx = Math.floor(Math.random() * audioObjs.length);
  const audio = audioObjs[idx];
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}

export function playChest() {
  playAudio(chestAudio, 0.2);
}

export function playSpawnChest() {
  playAudio(chestspawnAudio, 0.2);
}

export function playRandomWooddrop() {
  playRandomAudio(wooddropAudios, 0.1);
}

export function playRandomWoodpickup() {
  playRandomAudio(woodpickupAudios, 0.1);
}

export function playSlotSpawn() {
  playAudio(slotAudio, 0.3);
}

export function playFire() {
  playAudio(fireAudio, 0.2);
}

export function stopFire() {
  fireAudio.pause();
  fireAudio.currentTime = 0;
}

export function playTabletPick() {
  playAudio(tabletpickAudio, 0.5);
}

// General SpriteEffect component for sprite sheet animations
export interface SpriteEffectProps {
  sprite: string;
  frameWidth: number;
  frameHeight: number;
  numFrames: number;
  frameDuration: number; // ms per frame
  loop?: boolean;
  style?: React.CSSProperties;
}

export function SpriteEffect({ sprite, frameWidth, frameHeight, numFrames, frameDuration, loop = false, style }: SpriteEffectProps) {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    if (loop) {
      const interval = window.setInterval(() => {
        setFrame((f) => (f + 1) % numFrames);
      }, frameDuration);
      return () => window.clearInterval(interval);
    } else if (frame < numFrames - 1) {
      const timeout = window.setTimeout(() => setFrame(frame + 1), frameDuration);
      return () => window.clearTimeout(timeout);
    }
  }, [frame, numFrames, frameDuration, loop]);
  if (!loop && frame >= numFrames) return null;
  return React.createElement(
    'div',
    {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: frameWidth,
        height: frameHeight,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
        opacity: 0.5,
        ...style,
      },
    },
    React.createElement(
      'div',
      {
        style: {
          width: frameWidth,
          height: frameHeight,
          overflow: 'hidden',
          position: 'relative',
        },
      },
      React.createElement('img', {
        src: sprite,
        alt: 'sprite',
        style: {
          position: 'absolute',
          left: -frameWidth * frame,
          top: 0,
          width: frameWidth * numFrames,
          height: frameHeight,
          imageRendering: 'auto',
          pointerEvents: 'none',
        },
        draggable: false,
      })
    )
  );
}