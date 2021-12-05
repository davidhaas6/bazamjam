

class Recorder {
    public recording: Array<number>;
    private fs: number;

    constructor(fs: number) {
        this.recording = [];
        this.fs = fs;
    }

    addData(data: Float32Array) {
        this.recording.push(...Array.from(data));
    }

    getRecording(): Array<number> {
        return this.recording;
    }

    clearRecording() {
        this.recording = [];
    }
}

export default Recorder;