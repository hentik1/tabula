import { useState, useEffect, useRef, useCallback } from 'react';
import chestClosed from 'assets/chest/chestclosed.png';
import chestOpen from 'assets/chest/chestopen.png';
import Fade from '@mui/material/Fade';
import { Tablet } from '../Tablet/Tablet';
import type { TabletProps } from '../Tablet/Tablet';
import './Chest.css';
import {
  playChest,
  playFire,
  playSpawnChest,
  SpriteEffect,
  stopFire,
  playTabletPick,
} from 'components/utils/utils';
import flamegray from 'assets/effects/flamegray.png';
import flamegreen from 'assets/effects/flamegreen.png';
import flameblue from 'assets/effects/flameblue.png';
import flamepurple from 'assets/effects/flamepurple.png';
import flameorange from 'assets/effects/flameorange.png';

const getRandomPosition = () => {
  const padding = 40; // Prevents chest from being cut off
  const width = window.innerWidth - 120 - padding;
  const height = window.innerHeight - 120 - padding;
  const left = Math.random() * width + padding / 2;
  const top = Math.random() * height + padding / 2;
  return { left, top };
};

function ChestRewardFlame({
  tablet,
  flameSprite,
  dropShadow,
  delay,
  onPick,
}: {
  tablet: TabletProps;
  flameSprite: string;
  dropShadow: string;
  delay: number;
  onPick: (tablet: TabletProps) => void;
}) {
  const [showFlame, setShowFlame] = useState(false);
  const [showTablet, setShowTablet] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFlame(true);
      setShowTablet(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return (
    <div
      style={{
        position: 'relative',
        minWidth: 260,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {showFlame && (
        <SpriteEffect
          sprite={flameSprite}
          frameWidth={260}
          frameHeight={260}
          numFrames={10}
          frameDuration={100}
          loop
          style={{ zIndex: 0, opacity: 0.7, filter: dropShadow }}
        />
      )}
      {showTablet && (
        <div
          className="chest-reward-tablet"
          style={{ position: 'relative', zIndex: 1 }}
          onClick={() => onPick(tablet)}
        >
          <Tablet {...tablet} disableDraggable />
        </div>
      )}
    </div>
  );
}

export function Chest({ onTabletPick }: { onTabletPick: (tablet: TabletProps) => void }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // Start hidden
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [rewardTablets, setRewardTablets] = useState<TabletProps[] | null>(null);

  // Ref to track if component is mounted
  const mountedRef = useRef(true);
  // Ref to store the spawn cleanup function
  const spawnCleanupRef = useRef<(() => void) | null>(null);

  // Helper to start chest spawn logic
  const startChestSpawn = useCallback(() => {
    let elapsed = 0;
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;
    let active = true;

    function trySpawn() {
      if (!active || !mountedRef.current) return;
      elapsed += 0.5; // seconds
      // No spawn before 5s
      if (elapsed < 10) return;
      // Probability increases: e.g. 1% per 0.5s after 5s, max 50%
      const maxProb = 0.5;
      const prob = Math.min((elapsed - 5) * 0.01, maxProb);
      if (Math.random() < prob) {
        // Spawn chest
        setPosition(getRandomPosition());
        setVisible(true);
        playSpawnChest();
        clearInterval(interval);
        active = false;
      }
    }

    timeout = setTimeout(() => {
      interval = setInterval(trySpawn, 500);
    }, 500);

    return () => {
      active = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // On mount, start chest spawn logic
  useEffect(() => {
    mountedRef.current = true;
    if (spawnCleanupRef.current) spawnCleanupRef.current();
    spawnCleanupRef.current = startChestSpawn();
    return () => {
      mountedRef.current = false;
      if (spawnCleanupRef.current) spawnCleanupRef.current();
    };
  }, [startChestSpawn]);

  useEffect(() => {
    if (!visible) {
      setOpen(false);
      stopFire();
      if (mountedRef.current) {
        if (spawnCleanupRef.current) spawnCleanupRef.current();
        spawnCleanupRef.current = startChestSpawn();
      }
    }
  }, [visible, startChestSpawn]);

  useEffect(() => {
    if (open) {
      playChest();
      const timeout = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      playFire();
      const types: Array<'wood' | 'stone' | 'gold'> = ['wood', 'stone', 'gold'];
      const tablets = types.map((type, i) => ({
        id: `chest-reward-${type}-${Date.now()}-${i}`,
        label: type === 'gold' ? 'E' : type === 'stone' ? '3' : String(i + 1),
        type,
      }));
      setRewardTablets(tablets);
    } else {
      setRewardTablets(null);
    }
  }, [open]);

  return (
    <>
      <Fade in={visible} timeout={600} unmountOnExit>
        <img
          src={open ? chestOpen : chestClosed}
          alt={open ? 'Open Chest' : 'Closed Chest'}
          className={`chest-img${open ? ' chest-img--open' : ''}`}
          style={{
            left: position.left,
            top: position.top,
          }}
          onClick={() => !open && setOpen(true)}
          draggable={false}
        />
      </Fade>
      {open && rewardTablets && (
        <div className="chest-reward-overlay">
          <div className="chest-reward-row" style={{ position: 'relative', zIndex: 1 }}>
            {rewardTablets.map((tablet, idx) => {
              let flameSprite = flamegray;
              let dropShadow = 'drop-shadow(0 0 32px #aaa)';
              if (tablet.type === 'gold') {
                flameSprite = flameorange;
                dropShadow = 'drop-shadow(0 0 32px #ffb300)';
              } else if (tablet.type === 'stone') {
                flameSprite = flameblue;
                dropShadow = 'drop-shadow(0 0 32px #00bfff)';
              } else if (tablet.type === 'wood') {
                flameSprite = flamegreen;
                dropShadow = 'drop-shadow(0 0 32px #4caf50)';
              }
              return (
                <ChestRewardFlame
                  key={tablet.id}
                  tablet={tablet}
                  flameSprite={flameSprite}
                  dropShadow={dropShadow}
                  delay={idx * 200}
                  onPick={(t) => {
                    onTabletPick(t);
                    setVisible(false);
                    stopFire();
                    playTabletPick();
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
