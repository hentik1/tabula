import { useDroppable } from "@dnd-kit/core";
import React from "react";

export interface SlotProps {
  id: string;
  label: string;
  color: string;
}

export function Slot({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-20 border-2 border-amber-400 flex items-center justify-center m-1 transition-colors ${ // Added transition-colors
        isOver ? "bg-yellow-200" : "bg-gray-50" // Enhanced visual feedback
      }`}
    >
      {children}
    </div>
  );
}