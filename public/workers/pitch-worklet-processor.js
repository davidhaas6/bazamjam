// essentia-worklet-processor.js
// https://github.com/MTG/essentia.js/tree/dev/examples/rms-rt
// https://mtg.github.io/essentia.js/docs/api/tutorial-2.%20Real-time%20analysis.html
import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";
import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";

import { Float32Buffer } from './buffer.js';
let essentia = new Essentia(EssentiaWASM);
console.log("essentia loaded");


function argMax(array) {
  return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

// https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern#handling_buffer_size_mismatch

const SAMPLES_PER_CALL = 128; // set by Web Audio API

const MIN_RMS = 0.01;
const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;
const BUFFER_SECONDS = 0.2; // length of buffer in seconds
const FRAME_OVERLAP = 0.3; // percent of overlap between audio frames



class PitchWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.essentia = essentia;
    console.log('Backend - essentia:' + this.essentia.version + '- http://essentia.upf.edu');

    // TODO: make this a time value via the sampling rate
    this._bufferSize = sampleRate * BUFFER_SECONDS;
    this._buffer = new Float32Buffer(this._bufferSize);
    // console.log(this._bufferSize + " Samples per buffer");

    // controls how often the calculations are performed
    this._calcInterval = Math.floor(this._bufferSize * (1 - FRAME_OVERLAP) / SAMPLES_PER_CALL);
    this._calcCounter = 0;

    // dsp settings
    this.minFreq = 40;
    this.maxFreq = 4000;
  }

  //System-invoked process callback function.
  process(inputs, outputs, parameters) {
    if (inputs.length == 0 || inputs[0][0] == null) {
      console.log("no input");
      return true;
    }
    console.log("processing");
    // <inputs> and <outputs> will have as many as were specified in the options passed to the AudioWorkletNode constructor, each subsequently spanning potentially multiple channels
    let audioInput = inputs[0];

    this._buffer.append(audioInput[0]);

    if (this.isCalculationCall() && !this._buffer.allZero()) {
      let pitch = this.getFundFreq();
      this.port.postMessage(pitch);
    }

    this._calcCounter++;
    return true; // keep the process running
  }

  // we only calculate after we've recieved enough new samples to process
  // this frequency is determined by the buffer size and the frame overlap.
  // this function returns true if it is time to calculate
  isCalculationCall() {
    let isCalcStep = (this._calcCounter % this._calcInterval) === 0;
    return this._calcCounter > 0 && isCalcStep;
  }

  getFundFreq() {
    let inputSignal = this.essentia.arrayToVector(this._buffer.data);
    if (inputSignal.size() !== this._bufferSize) {
      console.log(inputSignal);
      console.log("vector len: " + inputSignal.length);
      console.log("buffer data len: " + this._buffer.data.length);
      return NaN;
    }

    if(this.essentia.RMS(inputSignal) < MIN_RMS) {
      return NaN;
    }

    // Get the predominant frequency. All the magic numbers are the default params    
    const algoOutput = this.essentia.PitchMelodia(
      inputSignal,  // input                          // signal,
      10, 3, FRAME_SIZE, false, .8, HOP_SIZE, 1, 40,  // binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold,
      this.maxFreq, 100, this.minFreq, 20, .9, .9,    // maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, 
      27.5625, 55, sampleRate, 100                    //  pitchContinuity, referenceFrequency, sampleRate, timeContinuity
    );

    const pitchFrames = essentia.vectorToArray(algoOutput.pitch);
    // const confidenceFrames = essentia.vectorToArray(algoOutput.pitchConfidence);
    
    // average frame-wise pitches in pitch before writing to SAB
    const numVoicedFrames = pitchFrames.filter(p => p > 0).length;
    // const numFrames = pitchFrames.length;
    const meanPitch = pitchFrames.reduce((acc, val) => acc + val, 0) / numVoicedFrames;
    // const meanConfidence = confidenceFrames.reduce((acc, val) => acc + val, 0) / numVoicedFrames;


    return meanPitch;
  }

  sendEmpty() {
    this.port.postMessage("");
  }
}

registerProcessor('pitch-processor', PitchWorkletProcessor); // must use the same name we gave our processor in `createEssentiaNode`