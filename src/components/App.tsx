import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import theme from '../theme';
import './App.css';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { ThemeProvider } from '@mui/material/styles';
import type { TabletProps } from 'components/Tablet/Tablet';
import { Tablet } from 'components/Tablet/Tablet';
import { Slot } from 'components/Slot/Slot';
import { playRandomWooddrop } from 'components/utils/woodSoundUtils';
import coins from 'assets/coins.png';
import { Chest } from './Chest/Chest';
import { Inventory } from './Inventory/Inventory';

// Add location to TabletProps
type TabletWithLocation = TabletProps & { location: 'inventory' | number };

const INITIAL_TABLETS: TabletWithLocation[] = [
  { id: 'tablet-money-1', label: '1', type: 'wood', location: 0 },
  { id: 'tablet-money-2', label: '1', type: 'wood', location: 1 },
  { id: 'tablet-money-3', label: '2', type: 'wood', location: 2 },
  { id: 'tablet-money-4', label: '3', type: 'stone', location: 3 },
  { id: 'tablet-enhancement-1', label: 'E', type: 'gold', location: 4 },
];

function App() {
  const NUM_SLOTS = 9;
  const SLOT_ID_PREFIX = 'slot-';
  const [money, setMoney] = useState<number>(0);
  const [tickrate, setTickrate] = useState<number>(1000);
  const [numSlots, setNumSlots] = useState(NUM_SLOTS);
  // Unified tablets state
  const [tablets, setTablets] = useState<TabletWithLocation[]>(INITIAL_TABLETS);
  const width = Math.sqrt(numSlots) * 8 + Math.sqrt(numSlots) * 90;

  const slotIds = Array.from({ length: numSlots }, (_, i) => `${SLOT_ID_PREFIX}${i}`);

  // Inventory: tablets with location 'inventory'
  const inventory = tablets.filter((t) => t.location === 'inventory');
  // Board: tablets with location as a number (slot index)
  const itemsInSlots = Array(numSlots)
    .fill(null)
    .map((_, idx) => {
      const tablet = tablets.find((t) => t.location === idx);
      return tablet ? tablet.id : null;
    });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeItemId = String(active.id);
    const targetSlotId = String(over.id);

    // Inventory drop logic
    if (targetSlotId.startsWith('inv-slot-')) {
      setTablets((prev) =>
        prev.map((t) => (t.id === activeItemId ? { ...t, location: 'inventory' } : t)),
      );
      return;
    }

    const targetSlotIndex = parseInt(targetSlotId.substring(SLOT_ID_PREFIX.length), 10);
    if (isNaN(targetSlotIndex)) return;

    setTablets((prev) => {
      // If slot is occupied, swap
      const tabletInTarget = prev.find((t) => t.location === targetSlotIndex);
      const tabletToMove = prev.find((t) => t.id === activeItemId);
      if (!tabletToMove) return prev;
      // If tablet is already in this slot, do nothing
      if (tabletToMove.location === targetSlotIndex) return prev;
      // If coming from inventory, just place
      if (tabletToMove.location === 'inventory' && !tabletInTarget) {
        playRandomWooddrop();
        return prev.map((t) => (t.id === activeItemId ? { ...t, location: targetSlotIndex } : t));
      }
      // If swapping between slots
      if (typeof tabletToMove.location === 'number' && tabletInTarget) {
        playRandomWooddrop();
        return prev.map((t) => {
          if (t.id === activeItemId) return { ...t, location: targetSlotIndex };
          if (t.id === tabletInTarget.id) return { ...t, location: tabletToMove.location };
          return t;
        });
      }
      // If moving from slot to empty slot
      if (typeof tabletToMove.location === 'number' && !tabletInTarget) {
        playRandomWooddrop();
        return prev.map((t) => (t.id === activeItemId ? { ...t, location: targetSlotIndex } : t));
      }
      // If moving from inventory to occupied slot, do nothing
      return prev;
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
      const tabletInfo = tablets.find((t) => t.id === itemIdInSlot);
      const value = parseInt(tabletInfo?.label ?? '');

      if (!isNaN(value)) {
        setMoney((prev) => prev + value);
      }
    } else {
      hasTicked.current = true;
    }
  }, [tickIndex]);

  // Add tablet from chest
  function handleChestTabletPick(tablet: TabletProps) {
    setTablets((prev) => [...prev, { ...tablet, location: 'inventory' }]);
  }

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
        {/* Chest appears randomly on the screen */}
        <Chest onTabletPick={handleChestTabletPick} />
        <Inventory items={inventory} />
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
            fontSize: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <img src={coins} style={{ width: 30, height: 30 }} />
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
            const tabletInfo = tablets.find((t) => t.id === itemIdInSlot);
            const bgIndex = getSlotBgIndex(slotId);
            const ticked = index === tickIndex;
            return (
              <Slot key={slotId} id={slotId} bgIndex={bgIndex} ticked={ticked}>
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
