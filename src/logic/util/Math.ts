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


// https://tonaljs.github.io/tonal/packages_note_build_es5.js.html#line237
var L2 = Math.log(2);
var L440 = Math.log(440);
export function freqToMidi(freq: number): number {
  return (12 * (Math.log(freq) - L440)) / L2 + 69;
};
