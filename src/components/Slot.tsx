import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import slotbg from 'assets/slots/slotbg.png';
import slotframe from 'assets/slots/slotframe.png';
import './Slot.css';

export interface SlotProps {
  id: string;
  children: React.ReactNode;
  bgIndex: number;
}

export function Slot({ id, children }: SlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const randomColor = React.useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 80%, 60%, 0.003)`;
  }, []);

  return (
    <div ref={setNodeRef} className="slot-root">
      <img src={slotbg} alt="slot background" className="slot-bg" />
      <div className="slot-overlay" style={{ background: randomColor }} />
      <div className="slot-content">{children}</div>
      <img src={slotframe} alt="slot frame" className="slot-frame" />
      {isOver && <div className="slot-dragover" />}
    </div>
  );
}
