import { FunctionComponent, useContext } from "react";
import { DrawProps, useCanvas } from "../logic/hooks";
import { AudioManagerContext } from "../routes/App";


// https://medium.com/fender-engineering/near-realtime-animations-with-synchronized-audio-in-javascript-6d845afcf1c5


interface VisualsProps {

}

// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const Visuals: FunctionComponent<VisualsProps> = (props: VisualsProps) => {
  const audioManager = useContext(AudioManagerContext);

  const draw = (ctx: CanvasRenderingContext2D, props?: DrawProps) => {
    if (props?.getData == null) return;
    const data = props.getData();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(data[0] * 100) ** 2, 0, 2 * Math.PI);
    // ctx.
    ctx.fill();

  };

  let canvasRef = useCanvas(draw, { getData: () => audioManager.getTimeData() });

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Visuals;