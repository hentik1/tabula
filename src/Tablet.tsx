import { useDraggable } from "@dnd-kit/core";
import React from "react";

export interface TabletProps {
  id: string;
  label: string;
  color: string;
}

export function Tablet({ id, label, color }: TabletProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: "absolute",
        zIndex: 10,
        touchAction: "none",
      }
    : {
        position: "relative", // Default position within the slot
        touchAction: "none",
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center text-white font-bold shadow-md cursor-grab select-none`} // Enhanced styling
    >
      {label}
    </div>
  );
}
