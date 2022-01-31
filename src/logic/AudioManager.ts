import PubSub from "./PubSub";
import { createEssentiaNode, WorkletCallback } from "./util/Worklet";


// A string-indexed list of nodes. Essentially a dict
interface INodes {
  [key: string]: AudioNode;
}

// 
type NodeKey = keyof INodes;

// A string-indexed list of nodes. Essentially a dict
interface INodeConnections {
  [src: NodeKey]: NodeKey;
}

const emptyBuffer = new Float32Array(0);


// TODO: Add recording loop in here instead of react components

class AudioManager {
  // audio state and analysis
  audioContext?: AudioContext;

  _nodes: INodes; // essentially a dictionary of nodes
  nodeGraph: Map<NodeKey, NodeKey[]>;

  audioStream?: MediaStream | null;

  _timeBuffer: Float32Array;
  _freqBuffer: Float32Array;

  pubsub: PubSub;

  audioActive: boolean = false; // if we're actively processing audio

  readonly FFT_SIZE = 8192; // num bins in fft -- real + image
  readonly SAMPLE_RATE = 44100;
  readonly BUFFER_SIZE = this.FFT_SIZE;

  public get nodes() {
    return this._nodes;
  }


  constructor(pubsub: PubSub) {
    this._nodes = {};
    this.nodeGraph = new Map<NodeKey, NodeKey[]>();

    this._timeBuffer = new Float32Array(this.FFT_SIZE);
    this._freqBuffer = new Float32Array(this.FFT_SIZE / 2);

    this.pubsub = pubsub;
  }

  // Initializes the audio context and nodes. Must be called from a user gesture
  //TODO: How to avoid re-doing this w/ every click?
  private async initAudio(): Promise<boolean> {
    // audio context must be created in a user gesture
    if (this.audioContext == null) {
      this.audioContext = new window.AudioContext({ sampleRate: this.SAMPLE_RATE });
    }

    // Initialize analyzer node
    if (!this.nodeExists('analyzer')) {
      let analyzer = new AnalyserNode(this.audioContext, { fftSize: this.FFT_SIZE });
      this.addNode(analyzer, "analyzer");
    }

    // grab user audio stream
    if (this.audioStream == null) {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      let srcNode = this.newSourceNode(this.audioContext, this.audioStream);
      if (!this.nodeExists('source')) {
        this.addNode(srcNode, "source", { outputs: ['analyzer'] });
      }
      else { // Replace node
        this.replaceNode("source", srcNode);
      }
    } else {
      this.setTracksEnabled(true);
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
    this.audioActive = await this.initAudio();
    this.pubsub.publish('audio-active', this.audioActive);

    return this.audioActive;
  }

  stopRecording(): void {
    this.audioActive = false;
    this.setTracksEnabled(false);
    this.pubsub.publish('audio-active', this.audioActive);
  }

  private setTracksEnabled(enabled: boolean) {
    this.audioStream?.getAudioTracks().forEach(element => element.enabled = enabled);
  }


  public getTimeData(): Float32Array {
    let analyzer = this._nodes['analyzer'] as AnalyserNode;
    if (analyzer) {
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

  public addNode(node: AudioNode, key: string, conn?: { inputs?: NodeKey[], outputs?: NodeKey[] }) {
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

  public nodeExists(key: any) {
    return key in this._nodes;
  }

  // conencts two audio nodes -- true on success
  private connectNodes(srcNodeKey: NodeKey, dstNodeKey: NodeKey) {
    if (!this.nodeExists(srcNodeKey) || !this.nodeExists(dstNodeKey)) {
      throw new Error("At least one provided key is invalid");
    }

    // connect in webaudio graph
    this._nodes[srcNodeKey].connect(this._nodes[dstNodeKey]);

    // connect in persistent graph
    if (!this.nodeGraph.has(srcNodeKey)) {
      this.nodeGraph.set(srcNodeKey, []);
    }

    // add if not already in graph
    if (!this.nodeGraph.get(srcNodeKey)?.includes(dstNodeKey)) {
      this.nodeGraph.get(srcNodeKey)?.push(dstNodeKey);
    }

    console.log(`added  ${srcNodeKey} --> ${dstNodeKey}`);
  }

  // replaces an audionode in the graph
  private replaceNode(nodeKey: NodeKey, newNode: AudioNode) {
    if (!this.nodeExists(nodeKey as string)) {
      throw new Error("Node key does not exist in audio graph");
    }

    // disconnect old node from WebAudio graph
    this._nodes[nodeKey].disconnect();

    let inputNodes = this.getInputNodesFor(nodeKey);
    let outputNodes = this.nodeGraph.get(nodeKey);

    delete this._nodes[nodeKey];

    this.addNode(newNode, nodeKey as string, {
      outputs: outputNodes,
      inputs: inputNodes
    });

    this._nodes[nodeKey] = newNode;
  }


  // finds the nodes nodeKey is a destination to
  private getInputNodesFor(nodeKey: NodeKey): NodeKey[] {
    let srcNodes: NodeKey[] = [];
    this.nodeGraph.forEach((value, key) => {
      let validNodes = value.filter((dstNodeKey) => dstNodeKey == nodeKey) as NodeKey[];
      if (validNodes !== null)
        srcNodes.push(...validNodes);
    });

    return srcNodes;
  }

  private newSourceNode = (ctx: AudioContext, stream: MediaStream) => {
    return ctx.createMediaStreamSource(stream);
  }


  // Create a worklet node from a AudioWorkletProcessor specified by js_path and connect the 
  // source node to it so it reads from the microphone.
  // can attach additional event listeners to the AudioWorkletNode
  public async addWorklet(name: string, js_path: string, onMessage: WorkletCallback) {
    // don't add the same node twice, nor to a null context
    if (!this.audioContext || this.nodeExists(name)) {
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
      // TODO: delete node connections for worker if it exists
      console.log("Error adding worklet node:" + e);
    }
  }

}

export default AudioManager;