// essentia-worklet-processor.js
// https://github.com/MTG/essentia.js/tree/dev/examples/rms-rt
// https://mtg.github.io/essentia.js/docs/api/tutorial-2.%20Real-time%20analysis.html
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";
import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";

import { Float32Buffer } from './buffer.js';
let essentia = new Essentia(EssentiaWASM);
console.log("essentia loaded");


// https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern#handling_buffer_size_mismatch

const SAMPLES_PER_CALL = 128; // set by Web Audio API

const FFT_SIZE = 2048;
const BUFFER_SECONDS = 0.4;
const FRAME_OVERLAP = 0; // percent of overlap between audio frames

class PitchWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.essentia = essentia;
    console.log('Backend - essentia:' + this.essentia.version + '- http://essentia.upf.edu');

    // TODO: make this a time value via the sampling rate
    this._bufferSize = sampleRate * BUFFER_SECONDS;
    this._buffer = new Float32Buffer(this._bufferSize);
    console.log(this._bufferSize + " Samples per buffer");

    // controls how often the calculations are performed
    this._calcInterval = Math.floor(this._bufferSize * (1 - FRAME_OVERLAP) / SAMPLES_PER_CALL);
    this._calcCounter = 0;
  }

  //System-invoked process callback function.
  process(inputs, outputs, parameters) {

    // <inputs> and <outputs> will have as many as were specified in the options passed to the AudioWorkletNode constructor, each subsequently spanning potentially multiple channels
    let audioInput = inputs[0];

    this._buffer.append(audioInput[0]);

    if (this.isCalculationCall() && !this._buffer.allZero()) {
      let pitch = this.getFundFreq();

      // console.log(pyin);
      // console.log(pitch + " Hz");
      // console.log(pyin);
      this.port.postMessage(pitch);
    }

    this._calcCounter++;
    return true; // keep the process running
  }

  // we only calculate after we've recieved enough new samples to process
  // this frequency is determined by the buffer size and the frame overlap.
  // this function returns true if it is time to calculate
  isCalculationCall() {
    let isCalcStep = (this._calcCounter % this._calcInterval) == 0;
    return this._calcCounter > 0 && isCalcStep;
  }

  getFundFreq() {
    let vectorInput = this.essentia.arrayToVector(this._buffer.data);

    // https://mtg.github.io/essentia.js/docs/api/Essentia.html#PitchYinProbabilistic
    let yinOutput = this.essentia.PitchYinProbabilistic( 
      vectorInput, FFT_SIZE, 1024, 0.005, 'negative', false, sampleRate
    );
    // let yinOutput = PitchYinFFT();
    let pitchArr = this.essentia.vectorToArray(yinOutput.pitch);
    let pitch = Math.max(...pitchArr);

    return pitch;
  }

  sendEmpty() {
    this.port.postMessage("");
  }
}

console.log("here");

registerProcessor('pitch-processor', PitchWorkletProcessor); // must use the same name we gave our processor in `createEssentiaNode`