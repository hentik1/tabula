// Tablet component for draggable tablets
import { useDraggable } from "@dnd-kit/core";
import React from "react";
import "./Tablet.css";
import woodBg1 from "assets/wood1.png";
import woodBg2 from "assets/wood2.png";
import woodBg3 from "assets/wood3.png";

export interface TabletProps {
  id: string;
  label: string;
}

// Deterministic hash function for string to int
function hashStringToInt(str: string, max: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

export function Tablet({ id, label }: TabletProps) {
  const woodBgs = [woodBg1, woodBg2, woodBg3];
  const selectedWoodBg = woodBgs[hashStringToInt(id, woodBgs.length)];
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` ,
        position: "absolute",
        zIndex: 10,
        touchAction: "none",
        backgroundImage: `url(${selectedWoodBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "80px",
        height: "96px",
      }
    : {
        position: "relative",
        touchAction: "none",
        backgroundImage: `url(${selectedWoodBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "80px",
        height: "96px",
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={"rounded-lg flex items-center justify-center font-bold shadow-md cursor-grab select-none tablet-label"}
    >
      {label}
    </div>
  );
}
