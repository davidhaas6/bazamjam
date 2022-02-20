// essentia-worklet-processor.js

import { EssentiaWASM } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js";
import Essentia from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js";

import { Float32Buffer } from './buffer.js';
let essentia = new Essentia(EssentiaWASM);
console.log("essentia loaded");


function argMax(array) {
  return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

//TODO: decouple buffer and calculations -- make it so you can sample ur algorithms at a custom rate
// TODO: Break algorithms into classes -- they choose their input buffer size etc

// https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern#handling_buffer_size_mismatch

const SAMPLES_PER_CALL = 128; // set by Web Audio API

const MIN_RMS = 0.01;

// algorithm parameters
const FRAME_SIZE = 4096 * 2;
const HOP_SIZE = FRAME_SIZE / 2;
const FRAME_OVERLAP = 0; // percent of overlap between audio frames

const BUFFER_SECONDS = .5; // length of buffer in seconds




// IDEA: what if we just had this class, and it could process different things depending on its message inputs

class AlgoWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.essentia = essentia;
    console.log('Backend - essentia:' + this.essentia.version + '- http://essentia.upf.edu');

    this._algo = 'tonal';
    // TODO: make this a time value via the sampling rate
    this._bufferSize = Math.max(sampleRate * BUFFER_SECONDS, FRAME_SIZE);
    this._buffer = new Float32Buffer(this._bufferSize);
    // console.log(this._bufferSize + " Samples per buffer");

    // controls how often the calculations are performed
    this._calcInterval = Math.floor(this._bufferSize * (1 - FRAME_OVERLAP) / SAMPLES_PER_CALL);
    this._calcCounter = 0;

    // dsp settings
    this.minFreq = 40;
    this.maxFreq = 4000;

    this.tuningFreq = 440;
  }

  //System-invoked process callback function.
  process(inputs, outputs, parameters) {
    if (inputs.length == 0 || inputs[0][0] == null) {
      console.log("no input - length", inputs.length);
      return true;
    }

    // <inputs> and <outputs> will have as many as were specified in the options passed to the AudioWorkletNode constructor, each subsequently spanning potentially multiple channels
    let audioInput = inputs[0][0];

    this._buffer.append(audioInput);

    if (this.isCalculationCall() && !this._buffer.allZero()) {
      // let data = this.getFundFreq();
      let data = this.getAlgorithmData(this._algo);
      this.port.postMessage(data);
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

  // chooses function to call based on 'algo'. does basic common prep too
  getAlgorithmData(algo) {
    let inputSignal = this.essentia.arrayToVector(this._buffer.data);
    const inputRMS = this.essentia.RMS(inputSignal).rms;
    //console.log("RMS: ", inputRMS);

    if (inputSignal.size() !== this._bufferSize || inputRMS < MIN_RMS) {
      //console.log("rms too low");
      return NaN;
    }

    if (algo == 'tonal-info') {
      return this.getTonalInfo(inputSignal);
    } else if (algo == 'chord') {
      return this.getChord(inputSignal)
    } else if (algo == 'f0') {
      return this.getFundFreq(inputSignal);
    }
  }

  getTonalInfo(signal) {
    // https://essentia.upf.edu/reference/std_TonalExtractor.html
    let toneInfo = this.essentia.TonalExtractor(signal, FRAME_SIZE, HOP_SIZE, 440);

    // convert essentia vectors to arrays  TODO: make into own function
    for (let feature in toneInfo) {
      if (toneInfo[feature].size) { // if array
        toneInfo[feature] = this.essentia.vectorToArray(toneInfo[feature]);

        // convert inside of vector to array if necessary
        if (toneInfo[feature][0].size) {
          for (let i in toneInfo[feature]) {
            toneInfo[feature][i] = this.essentia.vectorToArray(toneInfo[feature][i]);
          }
        }
      }
    }
    return toneInfo;
  }


  getChord(signal) {
    // essentia.FrameCutter(signal, FRAME_SIZE, HOP_SIZE, )
    // TODO: do we add a framecutter here?
    let spectrum = this.essentia.Spectrum(signal, [this._bufferSize]);
    let peaks = this.essentia.SpectralPeaks(
      spectrum,
      0.001,          // magnitude threshold
      this.maxFreq,
      60,             // max peaks
      this.minFreq,
      "magnitude",    // sort peaks by
      sampleRate
    );
    let magnitudes = null// TODO;
    let hpcp = this.essentia.hpcp(peaks, magnitudes);

    // https://mtg.github.io/essentia.js/docs/api/Essentia.html#ChordsDetection
  }


  getFundFreq(signal) {
    // Get the predominant frequency. All the magic numbers are the default params    
    const algoOutput = this.essentia.PitchMelodia(
      signal,
      10, 3, FRAME_SIZE, false, .8, HOP_SIZE, 1, 40,  // binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold,
      this.maxFreq, 100, this.minFreq, 20, .9, .9,    // maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, 
      27.5625, 55, sampleRate, 100                    //  pitchContinuity, referenceFrequency, sampleRate, timeContinuity
    );

    const pitchFrames = this.essentia.vectorToArray(algoOutput.pitch);
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

registerProcessor('algo-processor', AlgoWorkletProcessor); // must use the same name we gave our processor in `createEssentiaNode`