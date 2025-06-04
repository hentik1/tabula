import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import theme from './theme';
import './App.css';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { ThemeProvider } from '@mui/material/styles';
import type { TabletProps } from 'components/Tablet/Tablet';
import { Tablet } from 'components/Tablet/Tablet';
import { Slot } from 'components/Slot';
import { playRandomWooddrop } from 'components/utils/woodSoundUtils';

const ALL_TABLETS: Array<Omit<TabletProps, 'idOverride'> & { id: string }> = [
  { id: 'tablet-money-1', label: '1', type: 'gold' },
  { id: 'tablet-money-2', label: '1', type: 'wood' },
  { id: 'tablet-money-3', label: '2', type: 'stone' },
  { id: 'tablet-money-4', label: '3', type: 'wood' },
];

function App() {
  const NUM_SLOTS = 9;
  const SLOT_ID_PREFIX = 'slot-';
  const [numSlots, setNumSlots] = useState(NUM_SLOTS);
  const [itemsInSlots, setItemsInSlots] = useState<(string | null)[]>(() => {
    const initialItems: (string | null)[] = Array(NUM_SLOTS).fill(null);
    ALL_TABLETS.forEach((tablet, index) => {
      if (index < NUM_SLOTS && index < ALL_TABLETS.length) {
        initialItems[index] = tablet.id;
      }
    });
    return initialItems;
  });
  const width = Math.sqrt(numSlots) * 8 + Math.sqrt(numSlots) * 90;

  const slotIds = Array.from({ length: numSlots }, (_, i) => `${SLOT_ID_PREFIX}${i}`);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeItemId = String(active.id);
    const targetSlotId = String(over.id);

    const targetSlotIndex = parseInt(targetSlotId.substring(SLOT_ID_PREFIX.length), 10);

    if (isNaN(targetSlotIndex)) return;

    setItemsInSlots((prevItemsInSlots) => {
      const newItemsInSlots = [...prevItemsInSlots];

      const sourceSlotIndex = prevItemsInSlots.findIndex((itemId) => itemId === activeItemId);

      if (sourceSlotIndex === -1 || sourceSlotIndex === targetSlotIndex) {
        return prevItemsInSlots;
      }

      const itemInTargetSlot = newItemsInSlots[targetSlotIndex];
      newItemsInSlots[targetSlotIndex] = activeItemId;
      newItemsInSlots[sourceSlotIndex] = itemInTargetSlot;

      playRandomWooddrop();

      return newItemsInSlots;
    });
  }

  function getSlotBgIndex(slotId: string) {
    // Pseudo-random but stable per slot, using a better hash
    let hash = 5381;
    for (let i = 0; i < slotId.length; i++) {
      hash = (hash << 5) + hash + slotId.charCodeAt(i); // hash * 33 + c
    }
    // Use a large prime to shuffle the result
    const shuffled = Math.abs((hash * 2654435761) % 4294967296);
    return shuffled % 6;
  }

  function addSlot() {
    setNumSlots((prev) => (prev < 99 ? prev + 1 : 100));
    setItemsInSlots((prev) => {
      const newArr = [...prev];
      if (NUM_SLOTS > prev.length) {
        return newArr.concat(Array(NUM_SLOTS - prev.length).fill(null));
      } else {
        return newArr.slice(0, NUM_SLOTS);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <Box
          sx={{
            position: 'absolute',
            left: '1/2',
            top: '10px',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <Button variant="outlined" onClick={addSlot}>
            Add Slots
          </Button>
        </Box>
        <div
          style={{
            width: `${width}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {slotIds.map((slotId, index) => {
            const itemIdInSlot = itemsInSlots[index];
            const tabletInfo = ALL_TABLETS.find((t) => t.id === itemIdInSlot);
            const bgIndex = getSlotBgIndex(slotId);

            return (
              <Slot key={slotId} id={slotId} bgIndex={bgIndex}>
                {tabletInfo && <Tablet {...tabletInfo} />}
              </Slot>
            );
          })}
        </div>
      </DndContext>
    </ThemeProvider>
  );
}

export default App;
