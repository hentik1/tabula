import chest from 'assets/sounds/chest.mp3';
import chestspawn from 'assets/sounds/chestspawn.mp3';
import { playRandomAudio } from './utils';

export function playChest() {
  playRandomAudio([chest], 0.2);
}

export function playSpawnChest() {
  playRandomAudio([chestspawn], 0.2);
}
