import React from 'react';
import { Slot } from './Slot';
import { Tablet, type TabletProps } from './Tablet/Tablet';

export interface InventoryProps {
  items: (TabletProps | null)[];
  onDropToSlot?: (tabletId: string, slotIdx: number) => void;
}

const NUM_INVENTORY_SLOTS = 9;

export function Inventory({ items, onDropToSlot }: InventoryProps) {
  // Always 9 slots, each can be null or a TabletProps
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 12,
        zIndex: 20,
        background: 'rgba(30,30,30,0.7)',
        borderRadius: 12,
        padding: '12px 24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      {Array.from({ length: NUM_INVENTORY_SLOTS }).map((_, idx) => (
        <Slot key={idx} id={`inv-slot-${idx}`} bgIndex={0} ticked={false}>
          {items[idx] ? <Tablet {...items[idx]!} disableDraggable={false} /> : null}
        </Slot>
      ))}
    </div>
  );
}
