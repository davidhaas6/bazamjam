import { FunctionComponent, useLayoutEffect, useRef, useState } from "react";


interface ISoundGraphProps {
  soundData: Float32Array;
  isRecording: boolean;
}

interface IDimensions {
  width: number;
  height: number;
}


function draw(context: CanvasRenderingContext2D, audioData: Float32Array,
  width: number, height: number
) {
  let x = 0;
  const noiseFloor = 3;
  const sliceWidth = width / audioData.length;

  context.strokeStyle = '#ffffff';

  // TODO: run a gaussian filter or smtn
  audioData.forEach((sample, i) => {
    let sampleHeight = sample * height/2;
    let y = sampleHeight + height/2;

    let r = sliceWidth * 5;
    context.fillRect(x, y, r, r );

    x += sliceWidth;
  });
}

const SoundGraph: FunctionComponent<ISoundGraphProps> = (props: ISoundGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const [dimensions, setDimensions] = useState<IDimensions>();


  //TODO: Dimensions still don't update right when the canvas
  // is being drawn and the window gets large than smaller

  // holds the timer for setTimeout and clearInterval
  let movement_timer: NodeJS.Timer;

  // the number of ms the window size must stay the same size before the
  // dimension state variable is reset
  const RESET_TIMEOUT = 100;

  const test_dimensions = () => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }

  // This sets the dimensions on the first render
  useLayoutEffect(() => {
    test_dimensions();
  }, []);

  // every time the window is resized, the timer is cleared and set again
  // the net effect is the component will only reset after the window size
  // is at rest for the duration set in RESET_TIMEOUT.  This prevents rapid
  // redrawing of the component for more complex components such as charts
  window.addEventListener('resize', () => {
    clearInterval(movement_timer);
    if (!movement_timer) {
      // clearInterval(movement_timer);

      movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
    }
  });



  // Redraw canvas on new sound data
  let displayGraph = props.isRecording && dimensions != null;
  useLayoutEffect(() => {
    if (displayGraph) {
      let { width, height } = dimensions!;
      const canvas = canvasRef.current?.getContext('2d');

      if (canvas != null) {
        canvasRef.current!.setAttribute("width", width.toString());
        canvasRef.current!.setAttribute("height", height.toString());
        draw(canvas, props.soundData, width, height);
      }
    }
  }, [dimensions?.width, dimensions?.height, props.soundData[0], displayGraph]);



  return (
    <div className="timeDomGraph" ref={containerRef}>
      { // draw if width and height are set
        displayGraph &&
        <canvas ref={canvasRef} width={dimensions!.width} height={dimensions!.height} />
      }
    </div>
  );
}

export default SoundGraph;