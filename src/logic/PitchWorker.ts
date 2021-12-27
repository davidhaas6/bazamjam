// essentia-worklet-processor.js
import Essentia from 'essentia.js';
// @ts-ignore
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';

let essentia = new Essentia(EssentiaWASM);

// interface AudioWorkletProcessor {
//   process(inputs: Float32Array[], outputs: any, parameters: any): boolean;
// }

// @ts-ignore
class PitchWorker extends AudioWorkletProcessor {
  private _essentia = essentia;

  constructor() {
    super();
    console.log("constructure");
    console.log('Backend - essentia:' + this._essentia.version + '- http://essentia.upf.edu');
  }

  //System-invoked process callback function.
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: any) {

    // <inputs> and <outputs> will have as many as were specified in the options passed to the AudioWorkletNode constructor, each subsequently spanning potentially multiple channels
    let input = inputs[0];
    let output = outputs[0];

    // convert the input audio frame array from channel 0 to a std::vector<float> type for using it in essentia
    let vectorInput = this._essentia.arrayToVector(input[0]);

    // In this case we compute the Root Mean Square of every input audio frame
    // check https://mtg.github.io/essentia.js/docs/api/Essentia.html#RMS
    let rmsFrame = this._essentia.RMS(vectorInput) // input audio frame

    output[0][0] = rmsFrame.rms;

    return true; // keep the process running
  }
}

console.log("registering");
registerProcessor('pitch-processor', PitchWorker); //