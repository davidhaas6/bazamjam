import { FunctionComponent, useEffect, useRef, useState } from "react";


interface ISoundGraphProps {
  audioCallback: () => Float32Array;
  updateFreq: number; // Hz to update the sound data at
}


function draw(context: CanvasRenderingContext2D, audioData: Float32Array) {
  let width = 200;
  let height = 200;
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

const SoundGraph: FunctionComponent<ISoundGraphProps> = (props: ISoundGraphProps) => {
  const [soundData, setSoundData] = useState(new Float32Array(0));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start timer on first render
  useEffect(() => {
    setInterval(() => setSoundData(props.audioCallback()), 1000 * 1 / props.updateFreq);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current?.getContext('2d');
    if (canvas != null) {
      draw(canvas, soundData);
    }
    console.debug("dd",soundData);
  }, [soundData]);

  console.info({ component: soundData[0] });

  return (<div>
    <canvas className="timeDomGraph" ref={canvasRef} width={200} height={200} />;
  </div>);
}

export default SoundGraph;