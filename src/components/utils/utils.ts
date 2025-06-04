export function playRandomAudio(audioList: string[], volume = 0.7) {
  const idx = Math.floor(Math.random() * audioList.length);
  const audio = new Audio(audioList[idx]);
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}