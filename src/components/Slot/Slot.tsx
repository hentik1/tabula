import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import slotbg from 'assets/slots/slotbg.png';
import slotframe from 'assets/slots/slotframe.png';
import { SpriteEffect, playSlotSpawn } from 'components/utils/utils';
import smokeSprite from 'assets/effects/smoke.png';
import './Slot.css';

export interface SlotProps {
  id: string;
  children: React.ReactNode;
  bgIndex: number;
  ticked: boolean;
  justAdded?: boolean;
}

function SmokeEffect() {
  React.useEffect(() => {
    playSlotSpawn();
  }, []);
  return (
    <SpriteEffect
      sprite={smokeSprite}
      frameWidth={260}
      frameHeight={260}
      numFrames={8}
      frameDuration={1000 / 24}
      style={{ opacity: 0.5 }}
    />
  );
}

export function Slot({ id, children, ticked, justAdded }: SlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [showSmoke, setShowSmoke] = React.useState(false);
  const randomColor = React.useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 80%, 60%, 0.003)`;
  }, []);

  React.useEffect(() => {
    if (justAdded) {
      setShowSmoke(true);
      const timer = setTimeout(() => setShowSmoke(false), 350);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

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
