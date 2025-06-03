import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import theme from "./theme";
import "./App.css";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ThemeProvider } from "@mui/material/styles";
import type { TabletProps } from "components/Tablet/Tablet";
import { Tablet } from "components/Tablet/Tablet";
import { Slot } from "components/Slot";


const ALL_TABLETS: Array<Omit<TabletProps, "idOverride"> & { id: string }> = [
  { id: "tablet-money-1", label: "1" },
  { id: "tablet-money-2", label: "1" },
  { id: "tablet-enhancement", label: "E" },
];

function App() {
  const NUM_SLOTS = 49;
  const SLOT_ID_PREFIX = "slot-";
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

  const slotIds = Array.from(
    { length: numSlots },
    (_, i) => `${SLOT_ID_PREFIX}${i}`
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeItemId = String(active.id);
    const targetSlotId = String(over.id);

    const targetSlotIndex = parseInt(
      targetSlotId.substring(SLOT_ID_PREFIX.length),
      10
    );

    if (isNaN(targetSlotIndex)) return;

    setItemsInSlots((prevItemsInSlots) => {
      const newItemsInSlots = [...prevItemsInSlots];

      const sourceSlotIndex = prevItemsInSlots.findIndex(
        (itemId) => itemId === activeItemId
      );

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
      hash = ((hash << 5) + hash) + slotId.charCodeAt(i); // hash * 33 + c
    }
    // Use a large prime to shuffle the result
    const shuffled = Math.abs((hash * 2654435761) % 4294967296);
    return shuffled % 6;
  }

  return (
    <ThemeProvider theme={theme}>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <Box sx={{ width: 400, margin: "0 auto", mb: 2 }}>
          <Slider
            value={numSlots}
            min={9}
            max={100}
            step={1}
            marks={[
              { value: 9, label: "9" },
              { value: 49, label: "49" },
              { value: 100, label: "100" },
            ]}
            onChange={(_, value) => {
              if (typeof value === "number") {
                setNumSlots(value);
                setItemsInSlots((prev) => {
                  const newArr = [...prev];
                  if (value > prev.length) {
                    return newArr.concat(Array(value - prev.length).fill(null));
                  } else {
                    return newArr.slice(0, value);
                  }
                });
              }
            }}
            valueLabelDisplay="auto"
            sx={{
              color: "#fff",
              "& .MuiSlider-markLabel": { color: "#fff" },
              "& .MuiSlider-valueLabel": { color: "#fff" },
            }}
          />
        </Box>
        <div
          style={{ width: `${width}px`, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}
        >
          {slotIds.map((slotId, index) => {
            const itemIdInSlot = itemsInSlots[index];
            const tabletInfo = ALL_TABLETS.find((t) => t.id === itemIdInSlot);
            const bgIndex = getSlotBgIndex(slotId);

            return (
              <Slot key={slotId} id={slotId} bgIndex={bgIndex}>
                {tabletInfo && (
                  <Tablet
                    id={tabletInfo.id}
                    label={tabletInfo.label}
                  />
                )}
              </Slot>
            );
          })}
        </div>
      </DndContext>
    </ThemeProvider>
  );
}

export default App;
