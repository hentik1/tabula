// Slot component for droppable slots
import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import slotBg1 from 'assets/slot1.png';
import slotBg2 from 'assets/slot2.png';
import slotBg3 from 'assets/slot3.png';
import slotBg4 from 'assets/slot4.png';
import slotBg5 from 'assets/slot5.png';
import slotBg6 from 'assets/slot6.png';

export interface SlotProps {
  id: string;
  children: React.ReactNode;
  bgIndex: number;
}

export function Slot({ id, children, bgIndex }: SlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const slotBgs = [slotBg1, slotBg2, slotBg3, slotBg4, slotBg5, slotBg6];
  const selectedSlotBg = slotBgs[bgIndex % slotBgs.length];

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '90px',
        height: '108px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${selectedSlotBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'box-shadow 0.2s',
        position: 'relative',
      }}
    >
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
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
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
    </div>
  );
}
