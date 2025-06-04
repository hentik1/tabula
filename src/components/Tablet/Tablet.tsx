import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import './Tablet.css';
import wood from 'assets/tablets/wood1.png';
import stone from 'assets/tablets/stone.png';
import gold from 'assets/tablets/gold.png';

import { playRandomWoodpickup } from 'components/utils/woodSoundUtils';

export interface TabletProps {
  id: string;
  label: string;
  type?: 'gold' | 'wood' | 'stone';
}

export function Tablet({ id, label, type }: TabletProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const handlePointerDown = (event: React.PointerEvent) => {
    playRandomWoodpickup();
    if (listeners && listeners.onPointerDown) {
      listeners.onPointerDown(event);
    }
  };

  const isDragging = !!transform;
  const tabletImage = type === 'gold' ? gold : type === 'stone' ? stone : wood;
  const style: React.CSSProperties = {
    backgroundImage: `url(${tabletImage})`,
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
