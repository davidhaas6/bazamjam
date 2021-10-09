interface IAudioManagerProps {
  audio?: MediaStream | null;
}

// A string-indexed list of nodes. Essentially a dict
interface INodes {
  [key: string]: AudioNode;
}

// A string-indexed list of nodes. Essentially a dict
interface INodeConnections {
  [key: keyof INodes]: keyof INodes;
}

type clor = number;
var yummy: clor = 2;

class AudioManager {
  // audio state and analysis
  audioContext: AudioContext;

  _nodes: INodes; // essentially a dictionary of nodes
  nodeConnections: INodeConnections;

  analyser?: AnalyserNode | null;
  source?: MediaStreamAudioSourceNode | null;


  audioStream?: MediaStream | null;

  audioActive: boolean = false; // if we're actively processing audio
  readonly FFT_SIZE = 2048; // num bins in fft -- real + image
  readonly SAMPLE_RATE = 16000;


  constructor(props: IAudioManagerProps) {
    this.audioStream = props.audio; // TODO: move audio getting to this class

    this.audioContext = new window.AudioContext({ sampleRate: this.SAMPLE_RATE });

    // BaseAudioContext.onstatechange?

    this._nodes = {};
    this.nodeConnections = {};

    this.addNode(this.createAnalyzerNode(), "analyzer");

  }

  public addNode(node: AudioNode, key: string, conn?: { inputs?: string[], outputs?: string[] }) {
    this._nodes[key] = node;

    // TODO: is there some way to modularize this?
    // also should we throw an error on invalid keys?

    // connect the inputs for this node to it
    if (conn?.inputs != null)
      for (let inputKey of conn.inputs)
        if (inputKey in this._nodes) {
          let inputNode = this._nodes[inputKey];
          inputNode.connect(node);
        }


    // connect this node to the ones it outputs to
    if (conn?.outputs != null)
      for (let outputKey of conn.outputs)
        if (outputKey in this._nodes) {
          let outputNode = this._nodes[outputKey];
          node.connect(outputNode);
        }
  }


  createAnalyzerNode(): AudioNode {
    return new AnalyserNode(this.audioContext,
      { fftSize: this.FFT_SIZE }
    );
  }

  createSourceNode(audioStream: MediaStream) {
    return new MediaStreamAudioSourceNode(this.audioContext,
      { mediaStream: audioStream }
    );
  }

  // monitors for if we should update the state of the audio processing
  checkStatusUpdates() {
    if (this.audioStream != null && !this.audioActive) {  // if we didn't have audio but now we do
      this.startAudio();
    } else if (this.audioStream == null && this.audioActive) {  // if we had audio but now we dont
      this.stopAudio();
    }
  }

  // sets up analysis and source nodes, starts animation frame loop
  startAudio(): void {

    // connect the stream to the analysis node
    let source = this.createSourceNode(this.audioStream!);
    this.addNode(source, "source", { outputs: ["analyzer"] });

    this.audioActive = true;
  }


  stopAudio(): void {
    this.audioActive = false;
  }

  public get nodes() {
    return this._nodes;
  }

}

export default AudioManager;