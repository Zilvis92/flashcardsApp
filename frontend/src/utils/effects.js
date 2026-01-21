import confetti from 'canvas-confetti';

export const launchFireworks = () => {
  const end = Date.now() + 3 * 1000;
  const colors = ['#4f46e5', '#10b981', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

export const playSuccessSound = () => {
  const audio = new Audio(window.location.origin + '/successed.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Audio play failed:", e));
};