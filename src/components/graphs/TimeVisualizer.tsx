import React from 'react';

interface ITimeVisualizerProps {
  audioData: Uint8Array,
  width: number,
  height: number
}


class TimeVisualizer extends React.Component<ITimeVisualizerProps> {
  canvas: React.RefObject<any>; // todo: what's the type?

  constructor(props: ITimeVisualizerProps) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { audioData, width, height } = this.props;
    const canvas = this.canvas.current;

    const context = canvas.getContext('2d');
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    for (const idx in audioData) {
      const y = (audioData[idx] / 255.0) * height;
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

export default TimeVisualizer;
