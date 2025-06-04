import wooddrop2 from 'assets/sounds/materials/wooddrop2.mp3';
import wooddrop3 from 'assets/sounds/materials/wooddrop3.mp3';
import wooddrop4 from 'assets/sounds/materials/wooddrop4.mp3';
import woodpickup1 from 'assets/sounds/materials/woodpickup1.mp3';
import woodpickup2 from 'assets/sounds/materials/woodpickup2.mp3';
import woodpickup3 from 'assets/sounds/materials/woodpickup3.mp3';
import { playRandomAudio } from './utils';

const wooddropAudioFiles = [wooddrop2, wooddrop3, wooddrop4];
const woodpickupAudioFiles = [woodpickup1, woodpickup2, woodpickup3];

export function playRandomWooddrop() {
  playRandomAudio(wooddropAudioFiles, 0.2);
}

export function playRandomWoodpickup() {
  playRandomAudio(woodpickupAudioFiles, 0.6);
}