import React, { Component } from 'react';
import AudioVisualizer from './AudioVizualizer';
// import AudioVisualiser from './AudioVisualiser';


interface IAudioManagerProps {
  audio: MediaStream 
}

interface IAudioManagerState {
  audioData: Uint8Array,
}

class AudioManager extends React.Component<IAudioManagerProps, IAudioManagerState>  {
  analyser?: AnalyserNode;
  source?: MediaStreamAudioSourceNode;
  audioBuffer?: Uint8Array;
  rafId: number = -1;

  constructor(props: IAudioManagerProps) {
    super(props);

    this.state = {
      audioData: new Uint8Array(0),
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {

      const audioContext: AudioContext = new window.AudioContext(); // window.webkitAudioContext ?
      this.analyser = audioContext.createAnalyser();
      this.audioBuffer = new Uint8Array(this.analyser.frequencyBinCount);

      this.source = audioContext.createMediaStreamSource(this.props.audio);
      this.source.connect(this.analyser);

      this.rafId = requestAnimationFrame(this.tick);

      this.setState({
        audioData: this.audioBuffer!,
      });
    
  }

  tick() {
    if (this.analyser && this.audioBuffer) {
      this.analyser.getByteTimeDomainData(this.audioBuffer);
      this.setState({ audioData: this.audioBuffer });
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser?.disconnect();
    this.source?.disconnect();
  }

  render() {
    // return <div></div>;
    return <AudioVisualizer audioData={this.state.audioData} />;
  }
}

export default AudioManager;
