import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import './Tablet.css';
import woodBg1 from 'assets/tablets/wood1.png';

export interface TabletProps {
  id: string;
  label: string;
}

export function Tablet({ id, label }: TabletProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: 'absolute',
        touchAction: 'none',
        backgroundImage: `url(${woodBg1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '80px',
        height: '96px',
        cursor: 'grabbing',
      }
    : {
        position: 'relative',
        touchAction: 'none',
        backgroundImage: `url(${woodBg1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '80px',
        height: '96px',
        cursor: 'pointer',
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={
        'rounded-lg flex items-center justify-center font-bold shadow-md cursor-grab select-none tablet-label'
      }
    >
      {label}
    </div>
  );
}
