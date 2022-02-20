// a worklet to record audio data. saves it to buffer and other apps can subscribe to it at variable frequency
const fs = require('fs');
import { Float32Buffer } from './buffer.js';


const SAMPLES_PER_CALL = 128; // set by Web Audio API

const SAVE_HZ = 1;


class RecordingProcessor extends AudioWorkletProcessor {

  constructor() {
    super();

    // TODO: make this a time value via the sampling rate
    this._bufferSize = sampleRate / SAVE_HZ;
    this._buffer = new Float32Buffer(this._bufferSize);
    // console.log(this._bufferSize + " Samples per buffer");

    // controls how often the calculations are performed
    this._calcInterval = Math.floor(this._bufferSize / SAMPLES_PER_CALL);
    this._calcCounter = 0;
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

    if (this.isCalculationCall()) {
      // append to file
      // open the file in writing mode, adding a callback function where we do the actual writing
      fs.open(path, 'w', function (err, fileDescriptor) {
        if (err) {
          throw 'could not open file: ' + err;
        }

        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(fileDescriptor, buffer, 0, buffer.length, null, function (err) {
          if (err) throw 'error writing file: ' + err;
          fs.close(fileDescriptor, function () {
            console.log('wrote the file successfully');
          });
        });
      });
    }

    this._calcCounter++;
    return true; // keep the process running
  }

  // we only calculate after we've recieved enough new samples to process
  // this frequency is determined by the buffer size and the frame overlap.
  // this function returns true if it is time to calculate
  isCalculationCall() {
    let isCalcStep = (this._calcCounter % this._calcInterval) === 0;
    return this._calcCounter > 0 && isCalcStep && !this._buffer.allZero();
  }

  sendEmpty() {
    this.port.postMessage("");
  }
}

// registerProcessor('pitch-processor', PitchWorkletProcessor); // must use the same name we gave our processor in `createEssentiaNode`