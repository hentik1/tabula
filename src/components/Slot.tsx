// Slot component for droppable slots
import { useDroppable } from "@dnd-kit/core";
import React from "react";
import slotBg1 from "assets/slot1.png";
import slotBg2 from "assets/slot2.png";
import slotBg3 from "assets/slot3.png";
import slotBg4 from "assets/slot4.png";
import slotBg5 from "assets/slot5.png";
import slotBg6 from "assets/slot6.png";

export interface SlotProps {
  id: string;
  children: React.ReactNode;
  bgIndex: number;
}

export function Slot({ id, children, bgIndex }: SlotProps) {
  const { setNodeRef } = useDroppable({ id });
  const slotBgs = [slotBg1, slotBg2, slotBg3, slotBg4, slotBg5, slotBg6];
  const selectedSlotBg = slotBgs[bgIndex % slotBgs.length];

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "90px",
        height: "108px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${selectedSlotBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {children}
    </div>
  );
}
