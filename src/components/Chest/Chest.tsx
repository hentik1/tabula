import { useState, useEffect, useRef, useCallback } from 'react';
import chestClosed from 'assets/chest/chestclosed.png';
import chestOpen from 'assets/chest/chestopen.png';
import Fade from '@mui/material/Fade';
import { Tablet } from '../Tablet/Tablet';
import type { TabletProps } from '../Tablet/Tablet';
import './Chest.css';
import { playChest, playSpawnChest } from 'components/utils/utils';

const getRandomPosition = () => {
  const padding = 40; // Prevents chest from being cut off
  const width = window.innerWidth - 120 - padding;
  const height = window.innerHeight - 120 - padding;
  const left = Math.random() * width + padding / 2;
  const top = Math.random() * height + padding / 2;
  return { left, top };
};

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
    if (spawnCleanupRef.current) spawnCleanupRef.current(); // Clean up any previous spawn
    spawnCleanupRef.current = startChestSpawn();
    return () => {
      mountedRef.current = false;
      if (spawnCleanupRef.current) spawnCleanupRef.current();
    };
  }, [startChestSpawn]);

  useEffect(() => {
    if (!visible) {
      setOpen(false);
      if (mountedRef.current) {
        if (spawnCleanupRef.current) spawnCleanupRef.current(); // Clean up previous spawn
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
          <div className="chest-reward-row">
            {rewardTablets.map((tablet) => (
              <div
                key={tablet.id}
                className="chest-reward-tablet"
                onClick={() => {
                  onTabletPick(tablet);
                  setVisible(false); // Hide chest and trigger respawn
                }}
              >
                <Tablet {...tablet} disableDraggable />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
