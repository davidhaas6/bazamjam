

// A string-indexed list of nodes. Essentially a dict
interface INodes {
  [key: string]: AudioNode;
}

// 
type nodeKey = keyof INodes;

// A string-indexed list of nodes. Essentially a dict
interface INodeConnections {
  [src: nodeKey]: nodeKey;
}

const emptyBuffer = new Float32Array(0);


class AudioManager {
  // audio state and analysis
  audioContext: AudioContext;

  _nodes: INodes; // essentially a dictionary of nodes
  nodeConnections: INodeConnections;

  analyser?: AnalyserNode | null;
  _timeBuffer: Float32Array;
  _freqBuffer: Float32Array;

  source?: MediaStreamAudioSourceNode | null;


  audioStream?: MediaStream | null;

  audioActive: boolean = false; // if we're actively processing audio
  readonly FFT_SIZE = 2048; // num bins in fft -- real + image
  readonly SAMPLE_RATE = 16000;

  public get nodes() {
    return this._nodes;
  }


  constructor() {
    this._nodes = {};
    this.nodeConnections = {};

    this.audioContext = new window.AudioContext({ sampleRate: this.SAMPLE_RATE });

    // Initialize analyzer node
    this._timeBuffer = new Float32Array(this.FFT_SIZE);
    this._freqBuffer = new Float32Array(this.FFT_SIZE / 2);
    this.addNode(this.createAnalyzerNode(), "analyzer");

    // Lets them be used in callbacks
    this.getTimeData.bind(this);
    this.getFreqData.bind(this);
  }


  /*
  ==== Audio input ===== 
  */

  async startRecording() {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.addAudioStream(stream);
    this.audioActive = true;
  }


  stopRecording(): void {
    this.audioStream?.getTracks().forEach(track => track.stop());
    this.audioActive = false;
  }


  public addAudioStream(stream: MediaStream) {
    this.audioStream = stream;
    if ("source" in this._nodes) return;

    // connect the stream to the analysis node
    let source = this.createSourceNode(this.audioStream);
    this.addNode(source, "source", { outputs: ["analyzer"] });
    // source.mediaStream.getTracks()[0].
  }

  public getTimeData(): Float32Array {
    let analyzer = this._nodes['analyzer'];
    if (analyzer instanceof AnalyserNode) {
      let buf =  new Float32Array(this.FFT_SIZE);
      analyzer.getFloatTimeDomainData(buf);
      console.info({ manager: buf[0] });
      return buf;
    }
    return emptyBuffer;
  }

  public getFreqData(): Float32Array {
    let analyzer = this._nodes.analyzer;
    if (analyzer instanceof AnalyserNode) {
      analyzer.getFloatFrequencyData(this._freqBuffer);
      return this._freqBuffer;
    }
    return emptyBuffer;
  }


  /*
  ==== Audio graph structure ===== 
  */

  public addNode(node: AudioNode, key: string, conn?: { inputs?: string[], outputs?: string[] }) {
    if (key in this._nodes) {
      throw new Error("Key already exists in audio graph");
    }
    this._nodes[key] = node;

    // connect the inputs for this node to it
    if (conn?.inputs) {
      conn.inputs.forEach((inputKey) => this.connectNodes(inputKey, key));
    }

    // connect this node to the ones it outputs to
    if (conn?.outputs) {
      conn.outputs.forEach((outputKey) => this.connectNodes(key, outputKey));
    }
  }

  // conencts two audio nodes -- true on success
  private connectNodes(srcNodeKey: nodeKey, dstNodeKey: nodeKey) {
    if (!(srcNodeKey in this._nodes) && !(dstNodeKey in this._nodes)) {
      throw new Error("At least one provided key is invalid");
    }

    this._nodes[srcNodeKey].connect(this._nodes[dstNodeKey]);
    this.nodeConnections[srcNodeKey] = dstNodeKey;
  }


  /*
  ==== Base nodes ===== 
  */

  private createAnalyzerNode(): AudioNode {

    return new AnalyserNode(this.audioContext,
      { fftSize: this.FFT_SIZE }
    );
  }

  private createSourceNode(audioStream: MediaStream) {
    return new MediaStreamAudioSourceNode(this.audioContext,
      { mediaStream: audioStream }
    );
  }

}

export default AudioManager;