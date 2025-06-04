import { useEffect, useRef, useState } from 'react';
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

const ALL_TABLETS: Array<TabletProps> = [
  { id: 'tablet-money-1', label: '1' },
  { id: 'tablet-money-2', label: '1' },
  { id: 'tablet-money-3', label: '2' },
  { id: 'tablet-money-4', label: '3' },
  { id: 'tablet-enhancement-1', label: 'E' },
];

function App() {
  const NUM_SLOTS = 9;
  const SLOT_ID_PREFIX = 'slot-';
  const [money, setMoney] = useState<number>(0);
  const [tickrate, setTickrate] = useState<number>(1000);
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

  function reduceTickrate() {
    setTickrate((prev) => prev * 0.9);
  }

  // Tick
  const [tickIndex, setTickIndex] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTickIndex((prev) => (prev + 1) % numSlots);
    }, tickrate);
    return () => {
      clearInterval(interval);
    };
  }, [numSlots, tickrate]);

  // Money
  const hasTicked = useRef(false);
  useEffect(() => {
    if (hasTicked.current) {
      const itemIdInSlot = itemsInSlots[tickIndex];
      const tabletInfo = ALL_TABLETS.find((t) => t.id === itemIdInSlot);
      const value = parseInt(tabletInfo?.label ?? '');

      if (!isNaN(value)) {
        setMoney((prev) => prev + value);
      }
    } else {
      hasTicked.current = true;
    }
  }, [tickIndex]);

  return (
    <ThemeProvider theme={theme}>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <Box
          sx={{
            position: 'absolute',
            left: '300px',
            top: '10px',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <Button variant="outlined" onClick={addSlot}>
            Add Slots
          </Button>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '100px',
            top: '10px',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <Button variant="outlined" onClick={reduceTickrate}>
            Reduce Tickrate
          </Button>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '1/2',
            top: '50px',
            margin: '0 auto',
            mb: 2,
            color: 'white',
            fontSize: '40px',
          }}
        >
          {money}
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
            const ticked = index === tickIndex;

            return (
              <Slot key={slotId} id={slotId} bgIndex={bgIndex} ticked={ticked}>
                {tabletInfo && <Tablet id={tabletInfo.id} label={tabletInfo.label} />}
              </Slot>
            );
          })}
        </div>
      </DndContext>
    </ThemeProvider>
  );
}

export default App;
