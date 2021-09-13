import React from 'react';
import AudioVisualizer from './AudioVizualizer';
// import AudioVisualiser from './AudioVisualiser';

// https://www.twilio.com/blog/audio-visualisation-web-audio-api--react

interface IAudioManagerProps {
  audio?: MediaStream | null;
}

interface IAudioManagerState {
  timeData: Uint8Array,
  freqData: Float32Array
}

class AudioManager extends React.Component<IAudioManagerProps, IAudioManagerState>  {
  // audio state and analysis
  audioContext?: AudioContext;
  analyser?: AnalyserNode | null;
  source?: MediaStreamAudioSourceNode | null;

  audioActive: boolean = false; // if we're actively processing audio
  readonly FFT_SIZE = 2048; // num bins in fft -- real + image

  // audio data buffers
  timeDomainBuffer?: Uint8Array;
  freqDomainBuffer?: Float32Array;

  // the id for the latest animation frame request
  framReqID: number = 0;


  constructor(props: IAudioManagerProps) {
    super(props);

    this.timeDomainBuffer = new Uint8Array(this.FFT_SIZE);
    this.freqDomainBuffer = new Float32Array(this.FFT_SIZE / 2);
    this.state = {
      timeData: this.timeDomainBuffer,
      freqData: this.freqDomainBuffer,
    };

    this.tick = this.tick.bind(this);
  }

  // sets up analysis and source nodes, starts animation frame loop
  startAudio(): void {
    if (this.props.audio == null) return;

    // retain audio context
    if (this.audioContext == null) {
      this.audioContext = new window.AudioContext();
    }

    // set up the analysis node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.FFT_SIZE;

    // connect the stream to the analysis node
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);

    this.audioActive = true;
    this.framReqID = requestAnimationFrame(this.tick); // start animation loop
  }


  stopAudio(): void {
    // disconnect and delete the audio nodes
    this.analyser?.disconnect();
    this.source?.disconnect();
    this.analyser = null;
    this.source = null;

    this.audioActive = false;
    cancelAnimationFrame(this.framReqID); // stop animation loop
  }

  // monitors for if we should update the state of the audio processing
  checkStatusUpdates() {
    if (this.props.audio != null && !this.audioActive) {  // if we didn't have audio but now we do
      this.startAudio();
    } else if (this.props.audio == null && this.audioActive) {  // if we had audio but now we dont
      this.stopAudio();
    }
  }

  // done each animation tick -- i think before each frame render
  // TODO: see if you can put the audio data extraction in a timer
  tick(time: number) {
    if (this.analyser && this.timeDomainBuffer && this.freqDomainBuffer) {

      // get data 
      this.analyser.getByteTimeDomainData(this.timeDomainBuffer);
      this.analyser.getFloatFrequencyData(this.freqDomainBuffer);
      this.setState({
        timeData: this.timeDomainBuffer,
        freqData: this.freqDomainBuffer
      });

      // updates an onscreen animation and retriggers this function --  oneshot
      this.framReqID = requestAnimationFrame(this.tick);
    }
  }

  render() {
    this.checkStatusUpdates();
    return <AudioVisualizer audioData={this.state.timeData} width={300} height={300}/>;
  }


  componentDidMount() {
    this.checkStatusUpdates();
  }

  componentWillUnmount() {
    this.stopAudio();
  }
}

export default AudioManager;
