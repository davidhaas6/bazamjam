

class AudioSnapshot {
    public soundData: Float32Array;;
    public freqData?: Float32Array;

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

    constructor(soundData: Float32Array, freqData?: Float32Array) {
        this.soundData = soundData;
        this.freqData = freqData;

    }


    setSoundData(soundData: Float32Array, copy: boolean = true) {
        if (copy) {
            this.soundData = new Float32Array(soundData);
        }
        else {
            this.soundData = soundData;
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