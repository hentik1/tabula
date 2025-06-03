import { useState } from "react";
import "./App.css";
import { Tablet, type TabletProps } from "./Tablet";
import { Slot } from "./Slot";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const NUM_SLOTS = 100;
const SLOT_ID_PREFIX = "slot-";
const width = Math.sqrt(NUM_SLOTS) * 8 + Math.sqrt(NUM_SLOTS) * 80;
const height = width;

const ALL_TABLETS: Array<Omit<TabletProps, "idOverride"> & { id: string }> = [
  { id: "tablet-money-1", label: "1", color: "bg-orange-400", },
  { id: "tablet-money-2", label: "1", color: "bg-orange-400" },
  { id: "tablet-enhancement", label: "E", color: "bg-lime-400" },
];

function App() {
  const [itemsInSlots, setItemsInSlots] = useState<(string | null)[]>(() => {
    const initialItems: (string | null)[] = Array(NUM_SLOTS).fill(null);

    ALL_TABLETS.forEach((tablet, index) => {
      if (index < NUM_SLOTS && index < ALL_TABLETS.length) {
        initialItems[index] = tablet.id;
      }
    });
    return initialItems;
  });

  const slotIds = Array.from(
    { length: NUM_SLOTS },
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

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <div
        className="flex flex-wrap justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {slotIds.map((slotId, index) => {
          const itemIdInSlot = itemsInSlots[index];
          const tabletInfo = ALL_TABLETS.find((t) => t.id === itemIdInSlot);

          return (
            <Slot key={slotId} id={slotId}>
              {tabletInfo && (
                <Tablet
                  id={tabletInfo.id}
                  label={tabletInfo.label}
                  color={tabletInfo.color}
                />
              )}
            </Slot>
          );
        })}
      </div>
    </DndContext>
  );
}

export default App;
