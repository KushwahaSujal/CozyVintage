import confetti from 'canvas-confetti';

export function fireGoldenSparkles() {
  confetti({
    particleCount: 35,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#CF9E65', '#B68B58', '#E5C378', '#F6F0E5'],
    ticks: 180,
    gravity: 0.9,
    scalar: 0.9,
  });
}

export function fireCelebrationConfetti() {
  // Two bursts from sides
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#78927A', '#B68B58', '#9D8DF1', '#D48C9A', '#5EA3A3'],
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#78927A', '#B68B58', '#9D8DF1', '#D48C9A', '#5EA3A3'],
  });
}

export function fireWaterSplashParticles() {
  confetti({
    particleCount: 22,
    spread: 45,
    origin: { y: 0.6 },
    colors: ['#5EA3A3', '#A3D9D9', '#78927A', '#FFFFFF'],
    gravity: 1.2,
    scalar: 0.7,
  });
}
