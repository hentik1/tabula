import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import React from 'react';

interface SettingsProps {
  volume: number;
  setVolume: (v: number) => void;
  open: boolean;
  anchorEl: HTMLElement | null;
  onOpen: (e: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
}

export function Settings({ volume, setVolume, open, anchorEl, onOpen, onClose }: SettingsProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 24,
        zIndex: 200,
      }}
    >
      <IconButton
        aria-label="settings"
        onClick={onOpen}
        sx={{ color: 'white', background: 'rgba(30,30,30,0.7)' }}
        size="medium"
      >
        <SettingsIcon fontSize="medium" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            background: 'rgba(30,30,30,0.95)',
            color: 'white',
            p: 2,
            borderRadius: 2,
            minWidth: 220,
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, minWidth: 90 }}>Music Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: 120 }}
            />
            <span style={{ fontSize: 14, width: 32, textAlign: 'right' }}>
              {Math.round(volume * 100)}
            </span>
          </div>
        </div>
      </Popover>
    </div>
  );
}
