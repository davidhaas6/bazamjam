import { FunctionComponent, useEffect, useRef, useState } from "react";


interface ISoundGraphProps {
  soundData: Float32Array;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.group("soundgraph");

  //TODO: this isn't getting called...

  let updateKey = props.soundData[0];
  useEffect(() => {
    const canvas = canvasRef.current?.getContext('2d');
    if (canvas != null) {
      draw(canvas, props.soundData);
    }
    console.debug("updated! ",props.soundData);
  }, [updateKey]);

  console.info({ updateKey });

  console.groupEnd();
  return (<div>
    <canvas className="timeDomGraph" ref={canvasRef} width={200} height={200} />;
  </div>);
}

export default SoundGraph;