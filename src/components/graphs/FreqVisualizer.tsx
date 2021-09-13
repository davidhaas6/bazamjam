import React from "react";

interface IFreqVisualizerProps {
    freqData: Float32Array,
    width: number,
    height: number
}

interface IFreqVisualizerState {

}

class IFreqVisualizer extends React.Component<IFreqVisualizerProps, IFreqVisualizerState> {
    canvas: React.RefObject<any>; // todo: what's the type?

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

        for (const i in freqData) {
            console.log(freqData[i])
            barHeight = freqData[i]/2;
    
            canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x,height-barHeight/2,barWidth,barHeight);
    
            x += barWidth + 1;
          }
        
    }

    render() {
        return <canvas className="timeDomGraph" width={this.props.width} height={this.props.height} ref={this.canvas} />;
    }
}

export default IFreqVisualizer;