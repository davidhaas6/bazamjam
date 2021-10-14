import { FunctionComponent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";


interface ISoundGraphProps {
  soundData: Float32Array;
  isRecording: boolean;
}

interface IDimensions {
  width: number;
  height: number;
}

const toPower = (db: number) => 10^(db/10);

function draw(context: CanvasRenderingContext2D, audioData: Float32Array,
  width: number, height: number
) {
  let x = 0;
  const sliceWidth = width / audioData.length;

  context.lineWidth = 2;
  context.strokeStyle = '#000000';
  context.clearRect(0, 0, width, height);
  context.strokeStyle = '#ffffff';
  // context.fillRect(20, 20, width, height);


  // TODO: filter data
  for (const idx in audioData) {
    const y = audioData[idx] * height + height/2;
    // if (idx == "100")
    //   console.log(idx, y);
    let r = sliceWidth * 5;
    context.fillRect(x, y, r, r);
    // context.ellipse(x,y,r,r,0,0,0);
    x += sliceWidth;
  }


}

const SoundGraph: FunctionComponent<ISoundGraphProps> = (props: ISoundGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const [dimensions, setDimensions] = useState<IDimensions>();

  // holds the timer for setTimeout and clearInterval
  let movement_timer: NodeJS.Timer;

  // the number of ms the window size must stay the same size before the
  // dimension state variable is reset
  const RESET_TIMEOUT = 100;

  const test_dimensions = () => {
    // For some reason targetRef.current.getBoundingClientRect was not available
    // I found this worked for me, but unfortunately I can't find the
    // documentation to explain this experience
    // console.log("updating w/h");

    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
      // console.log(containerRef.current.offsetWidth,
      //   containerRef.current.offsetHeight);

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



  // let width = containerRef?.current?.offsetWidth;
  // let height = containerRef?.current?.offsetHeight;
  if (dimensions != null) {
    // console.log("timegraph rendered", dimensions);
  }


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
      // console.log("drew canvase");

    }
    // console.log('w/h: ', {
    //   width: containerRef.current?.offsetWidth,
    //   height: containerRef.current?.offsetHeight
    // })
  }, [dimensions?.width, dimensions?.height, props.soundData[0]]);



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