import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import slotbg from 'assets/slots/slotbg.png';
import slotframe from 'assets/slots/slotframe.png';
import smokeSprite from 'assets/effects/smoke.png';
import './Slot.css';
import { playSlotSpawn } from 'components/utils/utils';

export interface SlotProps {
  id: string;
  children: React.ReactNode;
  bgIndex: number;
  ticked: boolean;
}

// SmokeEffect: animates the smoke sprite sheet once
function SmokeEffect() {
  const [frame, setFrame] = React.useState(0);
  const numFrames = 8;
  const frameWidth = 260;
  const frameHeight = 260;
  const frameDuration = 1000 / 24; // ~24fps
  React.useEffect(() => {
    playSlotSpawn();
  }, []);
  React.useEffect(() => {
    if (frame >= numFrames - 1) return;
    const interval = setInterval(() => {
      setFrame((f) => {
        if (f < numFrames - 1) return f + 1;
        clearInterval(interval);
        return f;
      });
    }, frameDuration);
    return () => {
      clearInterval(interval);
    };
  }, [frame]);
  // Hide after last frame
  if (frame >= numFrames) return null;
  return (
    <div
      className="smoke-effect"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: frameWidth,
        height: frameHeight,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        overflow: 'hidden',
        opacity: 0.5,
      }}
    >
      <div
        style={{
          width: frameWidth,
          height: frameHeight,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={smokeSprite}
          alt="smoke"
          style={{
            position: 'absolute',
            left: -frameWidth * frame,
            top: 0,
            width: frameWidth * numFrames,
            height: frameHeight,
            imageRendering: 'auto',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

let hasRenderedOnce = false;

export function Slot({ id, children, ticked }: SlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [showSmoke, setShowSmoke] = React.useState(false);
  const randomColor = React.useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 80%, 60%, 0.003)`;
  }, []);

  React.useEffect(() => {
    if (!hasRenderedOnce) {
      hasRenderedOnce = true;
      setShowSmoke(false);
      return;
    }
    setShowSmoke(true);
    const timer = setTimeout(() => setShowSmoke(false), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={setNodeRef} className="slot-root">
      <img src={slotbg} alt="slot background" className="slot-bg" />
      <div className="slot-overlay" style={{ background: randomColor }} />
      {showSmoke && <SmokeEffect />}
      <div className="slot-content">{children}</div>
      <img src={slotframe} alt="slot frame" className="slot-frame" />
      {isOver && <div className="slot-dragover" />}
      {ticked && <div className="slot-ticked" />}
    </div>
  );
}
