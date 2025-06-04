import chest from 'assets/sounds/chest.mp3';
import chestspawn from 'assets/sounds/chestspawn.mp3';
import slot from 'assets/sounds/slot/slot.mp3';
import wooddrop2 from 'assets/sounds/materials/wooddrop2.mp3';
import wooddrop3 from 'assets/sounds/materials/wooddrop3.mp3';
import wooddrop4 from 'assets/sounds/materials/wooddrop4.mp3';
import woodpickup1 from 'assets/sounds/materials/woodpickup1.mp3';
import woodpickup2 from 'assets/sounds/materials/woodpickup2.mp3';
import woodpickup3 from 'assets/sounds/materials/woodpickup3.mp3';

export function playRandomAudio(audioList: string[], volume = 0.7) {
  const idx = Math.floor(Math.random() * audioList.length);
  const audio = new Audio(audioList[idx]);
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}


export function playChest() {
  playRandomAudio([chest], 0.2);
}

export function playSpawnChest() {
  playRandomAudio([chestspawn], 0.2);
}

const wooddropAudioFiles = [wooddrop2, wooddrop3, wooddrop4];
const woodpickupAudioFiles = [woodpickup1, woodpickup2, woodpickup3];

export function playRandomWooddrop() {
  playRandomAudio(wooddropAudioFiles, 0.2);
}

export function playRandomWoodpickup() {
  playRandomAudio(woodpickupAudioFiles, 0.6);
}

export function playSlotSpawn() {
  playRandomAudio([slot], 0.3);
}