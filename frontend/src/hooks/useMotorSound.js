let audio;

export const startMotor = (speed) => {
  if (!audio) {
    audio = new Audio("/motor.mp3"); // sonido corto y suave
    audio.loop = true;
  }
  audio.volume = Math.min(0.4, speed / 20);
  audio.play();
};

export const stopMotor = () => {
  if (audio) audio.pause();
};
