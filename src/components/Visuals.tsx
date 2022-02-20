import { FunctionComponent, useContext } from "react";
import { DrawProps, useCanvas } from "../logic/hooks";
import { AudioManagerContext } from "../routes/App";


// https://medium.com/fender-engineering/near-realtime-animations-with-synchronized-audio-in-javascript-6d845afcf1c5


interface VisualsProps {
  isHidden?: boolean;
}

// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const Visuals: FunctionComponent<VisualsProps> = (props: VisualsProps) => {
  const audioManager = useContext(AudioManagerContext);
  const { isHidden = false } = props;

  const draw = (ctx: CanvasRenderingContext2D, props?: DrawProps) => {
    if (props?.getData == null) return;
    const data = props.getData().reverse();
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const sample_scale = height / 2 + 50;
    const waveWidth = width - 8;

    const sampleWidthPx = waveWidth / data.length;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'black';
    ctx.lineWidth = 1;

    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 16;
    ctx.shadowBlur = 1;
    ctx.shadowColor = '#00000022';

    const getSampleY = (sample: number) => sample * sample_scale + height / 2;

    ctx.beginPath();
    for (let i = 0; i < data.length - 1; i++) {
      const next_x = (i + 1) * sampleWidthPx;
      const next_y = getSampleY(data[i + 1]);

      // ctx.moveTo(i * sampleWidthPx, getSampleY(data[i]));
      ctx.lineTo(next_x, next_y);
    }
    ctx.stroke();

  };

  let canvasRef = useCanvas(draw, { getData: () => audioManager.getTimeData() });

  const cssStyle = "waveform" + (isHidden ? " hidden" : "");
  return (
    <>

      <canvas ref={canvasRef} className={cssStyle}/>
    </>
  );
}

export default Visuals;