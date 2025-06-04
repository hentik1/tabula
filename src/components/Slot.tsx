import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import slotbg from 'assets/slots/slotbg.png';
import slotframe from 'assets/slots/slotframe.png';

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
    <div
      ref={setNodeRef}
      style={{
        width: '90px',
        height: '108px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={slotbg}
        alt="slot background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: randomColor,
          opacity: 0.8,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* Children content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
      {/* Slot frame layer */}
      <img
        src={slotframe}
        alt="slot frame"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
      {/* Drag-over effect (optional, above frame) */}
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(75, 74, 72, 0.31)',
            borderRadius: '8px',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
