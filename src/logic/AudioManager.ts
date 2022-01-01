import Recorder from "./Recorder";
import { createEssentiaNode, WorkletCallback } from "./util/Worklet";


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


// TODO: Add recording loop in here instead of react components

class AudioManager {
  // audio state and analysis
  audioContext?: AudioContext;

  _nodes: INodes; // essentially a dictionary of nodes
  nodeConnections: INodeConnections;

  analyser?: AnalyserNode | null;
  source?: MediaStreamAudioSourceNode | null;
  audioStream?: MediaStream | null;

  _timeBuffer: Float32Array;
  _freqBuffer: Float32Array;

  _recorder: Recorder;

  audioActive: boolean = false; // if we're actively processing audio
  readonly FFT_SIZE = 2048; // num bins in fft -- real + image
  readonly SAMPLE_RATE = 44100;
  readonly BUFFER_SIZE = this.FFT_SIZE;

  public get nodes() {
    return this._nodes;
  }


  constructor() {
    this._nodes = {};
    this.nodeConnections = {};

    this._timeBuffer = new Float32Array(this.FFT_SIZE);
    this._freqBuffer = new Float32Array(this.FFT_SIZE / 2);

    this._recorder = new Recorder(this.SAMPLE_RATE);
  }

  // Initializes the audio context and nodes. Must be called from a user gesture
  //TODO: How to avoid re-doing this w/ every click?
  private async initAudio(): Promise<boolean> {
    // audio context must be created in a user gesture
    if (this.audioContext == null) {
      this.audioContext = new window.AudioContext({ sampleRate: this.SAMPLE_RATE });
    }

    // Initialize analyzer node

    if (this._nodes['analyzer'] == null) {
      let analyzer = new AnalyserNode(this.audioContext, { fftSize: this.FFT_SIZE });
      this.addNode(analyzer, "analyzer");
    }

    if (this.audioStream == null || !this.audioStream?.active) {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.addSourceNode();
    } else if (this.audioStream?.getTracks().every((track) => track.enabled == false)) {
      this.audioStream?.getTracks().forEach(track => track.enabled = true);
    }


    if (this._nodes['source'] == null) {
      this.addSourceNode();
    }

    // Lets them be used in callbacks
    this.getTimeData.bind(this);
    this.getFreqData.bind(this);

    return true;
  }

  /*
  ==== Audio input ===== 
  */

  async startRecording(): Promise<boolean> {
    let bigIfTrue = await this.initAudio();
    this.audioActive = bigIfTrue;
    return bigIfTrue;
  }


  stopRecording(): void {
    this.audioStream?.getTracks().forEach(track => track.enabled = false);
    this.audioActive = false;
  }


  public getTimeData(): Float32Array {
    let analyzer = this._nodes['analyzer'];
    if (analyzer instanceof AnalyserNode) {
      // TODO: this has weird behavior... doesn't always output right thing
      analyzer.getFloatTimeDomainData(this._timeBuffer);
      return this._timeBuffer;
    }
    return emptyBuffer;
  }

  public getFreqData(): Float32Array {
    let analyzer = this._nodes['analyzer'];
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
    if (this.nodeExists(key)) {
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

  public nodeExists(key: string) {
    return key in this._nodes;
  }

  // conencts two audio nodes -- true on success
  private connectNodes(srcNodeKey: nodeKey, dstNodeKey: nodeKey) {
    if (!(srcNodeKey in this._nodes) && !(dstNodeKey in this._nodes)) {
      throw new Error("At least one provided key is invalid");
    }

    this._nodes[srcNodeKey].connect(this._nodes[dstNodeKey]);
    this.nodeConnections[srcNodeKey] = dstNodeKey;
  }


  private addSourceNode = () => {
    if (this.audioContext && this.audioStream) {
      let source = new MediaStreamAudioSourceNode(this.audioContext, { mediaStream: this.audioStream });
      this.addNode(source, "source", { outputs: ["analyzer"] });
    }
  }

  // Create a worklet node from a AudioWorkletProcessor specified by js_path and connect the 
  // source node to it so it reads from the microphone.
  // can attach additional event listeners to the AudioWorkletNode
  public async addWorklet(name: string, js_path: string, onMessage: WorkletCallback) {
    // don't add the same node twice, nor to a null context
    if (this.audioContext === null || this.nodeExists(name)) {
      console.log("Can't add worklet - " +
        (this.audioContext ? "Node exists" : "Audio context null")
      );
      return;
    }

    // create the node and add it to the graph
    try {
      const node = await createEssentiaNode(this.audioContext!, js_path, name);
      node.port.onmessage = onMessage;

      this.addNode(node, name, { inputs: ["source"] });
    } catch (e) {
      console.log("Error adding worklet node:" + e);
    }
  }

}

export default AudioManager;