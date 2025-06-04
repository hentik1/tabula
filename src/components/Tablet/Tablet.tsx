import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import './Tablet.css';
import woodBg1 from 'assets/tablets/wood1.png';

export interface TabletProps {
  id: string;
  label: string;
  onPickUp?: () => void;
}

export function Tablet({ id, label, onPickUp }: TabletProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // Wrap listeners to call onPickUp on pointerDown
  const handlePointerDown = (event: React.PointerEvent) => {
    if (onPickUp) onPickUp();
    if (listeners && listeners.onPointerDown) {
      listeners.onPointerDown(event);
    }
  };

  const isDragging = !!transform;
  const style: React.CSSProperties = {
    backgroundImage: `url(${woodBg1})`,
    ...(transform && { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }),
    ...(isDragging && { zIndex: 10 }),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className={`tablet-label${isDragging ? ' tablet-label--dragging' : ''}`}
    >
      {label}
    </div>
  );
}
