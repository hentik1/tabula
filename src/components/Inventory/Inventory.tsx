import { useState } from 'react';
import { Slot } from '../Slot/Slot';
import { Tablet, type TabletProps } from '../Tablet/Tablet';
import './Inventory.css';

export interface InventoryProps {
  items: (TabletProps | null)[];
  onDropToSlot?: (tabletId: string, slotIdx: number) => void;
}

const NUM_INVENTORY_SLOTS = 8;

export function Inventory({ items }: InventoryProps) {
  // Add state for number of slots
  const [numSlots, setNumSlots] = useState(NUM_INVENTORY_SLOTS);
  const columns = 2;
  const rows = Math.ceil(numSlots / columns);

  return (
    <>
      <div className="inventory-slider-container">
        <input
          type="range"
          min={2}
          max={16}
          step={2}
          value={numSlots}
          onChange={(e) => setNumSlots(Number(e.target.value))}
          className="inventory-slider"
        />
        <span className="inventory-slider-label">Slots: {numSlots}</span>
      </div>
      <div
        className="inventory-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: numSlots }).map((_, idx) => (
          <Slot key={idx} id={`inv-slot-${idx}`} bgIndex={0} ticked={false}>
            {items[idx] ? <Tablet {...items[idx]!} disableDraggable={false} /> : null}
          </Slot>
        ))}
      </div>
    </>
  );
}
