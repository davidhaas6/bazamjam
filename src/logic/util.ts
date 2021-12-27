export function roundNum(value: number, places: number) {
  var multiplier = Math.pow(10, places);

  return (Math.round(value * multiplier) / multiplier);
}

export function getRMS(signal: Float32Array): number {
  let squareMean = signal.reduce((acc, val) => acc + val * val, 0) / signal.length;
  return Math.sqrt(squareMean);
}

export function getAmplitude(signal: Float32Array): number {
  let arr = Array.from(signal);
  return Math.max(...arr) - Math.min(...arr);
}