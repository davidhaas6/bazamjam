// a segment of an audio stream

class AudioSnapshot {
    public _soundData?: Float32Array;
    public freqData?: Float32Array;
    // public isRecording: boolean;

    // constructor();
    // constructor(audioSnapshot: AudioSnapshot);
    // constructor(soundData: Float32Array, freqData?: Float32Array);
    // constructor(audioSnapshot?: any, soundData?: Float32Array, freqData?: Float32Array) {
    //     if (audioSnapshot) {
    //         console.log("passed snapshot");
    //         this.soundData = audioSnapshot.soundData;
    //         this.freqData = audioSnapshot.freqData;
    //     } else {
    //         this.soundData = soundData ?? new Float32Array(0);
    //         this.freqData = freqData;
    //     }
    // }

    constructor(soundData?: Float32Array, freqData?: Float32Array) {
        this._soundData = soundData;
        this.freqData = freqData;
        // this.isRecording = false;
    }

    get soundData() {
      return this._soundData ?? new Float32Array(0);
    }

    hasSoundData() {
        return this._soundData && this._soundData.length > 0;
    }

    setSoundData(soundData: Float32Array, copy: boolean = true) {
        if (copy) {
            this._soundData = new Float32Array(soundData);
        }
        else {
            this._soundData = soundData;
        }
    }

    setFreqData(freqData: Float32Array, copy: boolean = true) {
        if (copy) {
            this.freqData = new Float32Array(freqData);
        }
        else {
            this.freqData = freqData;
        }
    }

}
export default AudioSnapshot;

export const emptySnapshot = new AudioSnapshot(new Float32Array(0));

