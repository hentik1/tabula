import chest from 'assets/sounds/chest.mp3';
import chestspawn from 'assets/sounds/chestspawn.mp3';
import slot from 'assets/sounds/slot/slot.mp3';
import wooddrop2 from 'assets/sounds/materials/wooddrop2.mp3';
import wooddrop3 from 'assets/sounds/materials/wooddrop3.mp3';
import wooddrop4 from 'assets/sounds/materials/wooddrop4.mp3';
import woodpickup1 from 'assets/sounds/materials/woodpickup1.mp3';
import woodpickup2 from 'assets/sounds/materials/woodpickup2.mp3';
import woodpickup3 from 'assets/sounds/materials/woodpickup3.mp3';

// Pre-initialize Audio objects
const chestAudio = new Audio(chest);
const chestspawnAudio = new Audio(chestspawn);
const slotAudio = new Audio(slot);
const wooddropAudios = [new Audio(wooddrop2), new Audio(wooddrop3), new Audio(wooddrop4)];
const woodpickupAudios = [new Audio(woodpickup1), new Audio(woodpickup2), new Audio(woodpickup3)];

export function playAudio(audioObj: HTMLAudioElement, volume = 0.7) {
  audioObj.currentTime = 0;
  audioObj.volume = volume;
  audioObj.play();
}

export function playRandomAudio(audioObjs: HTMLAudioElement[], volume = 0.7) {
  const idx = Math.floor(Math.random() * audioObjs.length);
  const audio = audioObjs[idx];
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}

export function playChest() {
  playAudio(chestAudio, 0.2);
}

export function playSpawnChest() {
  playAudio(chestspawnAudio, 0.2);
}

export function playRandomWooddrop() {
  playRandomAudio(wooddropAudios, 0.1);
}

export function playRandomWoodpickup() {
  playRandomAudio(woodpickupAudios, 0.1);
}

export function playSlotSpawn() {
  playAudio(slotAudio, 0.3);
}