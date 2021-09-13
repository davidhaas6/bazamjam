import React from 'react';

interface IAudioVisualizerProps {
    audioData: Uint8Array,
    width: number,
    height: number
}


class AudioVisualizer extends React.Component<IAudioVisualizerProps> {
    canvas: React.RefObject<any>; // todo: what's the type?

  constructor(props: IAudioVisualizerProps) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { audioData } = this.props;
    const canvas = this.canvas.current;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d');
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    for (const item in audioData) {
      const y = (audioData[item] / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  }

  render() {
    return <canvas className="timeDomGraph" width={this.props.width} height={this.props.height} ref={this.canvas} />;
  }
}

export default AudioVisualizer;
