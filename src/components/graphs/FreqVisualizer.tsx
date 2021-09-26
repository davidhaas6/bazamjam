import React from "react";

interface IFreqVisualizerProps {
  freqData: Float32Array, // bin magnitudes
  width: number,
  height: number
}

interface IFreqVisualizerState {
  minFreq: number;
}

class IFreqVisualizer extends React.Component<IFreqVisualizerProps, IFreqVisualizerState> {
  canvas: React.RefObject<any>; // todo: what's the type?
  discount: number = 0.8;

  constructor(props: IFreqVisualizerProps) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { freqData, width, height } = this.props;

    const canvas = this.canvas.current;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#000000';

    let barWidth = (width / freqData.length) * 2.5;
    let barHeight;
    let x = 0;

    const minFreq = freqData.reduce((prev,cur) => prev < cur ? prev : cur);
    const zeroMag = minFreq;

    for (const i in freqData) {
      barHeight = (freqData[i] - minFreq)**1.2;

      canvasCtx.fillStyle = `rgb(${barHeight},50,50,${barHeight})`;
      canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight);

      x += barWidth;
    }

  }

  render() {
    return (
      <div>
        <canvas className="timeDomGraph"
          width={this.props.width} height={this.props.height} ref={this.canvas} />
        <p></p>
      </div>
    );
  }
}

export default IFreqVisualizer;