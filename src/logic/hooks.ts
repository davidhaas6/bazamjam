import { RefObject, useEffect, useRef, useState } from "react";

export function useDidMount() {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  return didMount;
}

export function useFreqLog(id: string) {
  useEffect(() => {
    console.time(id);
  }, [id]);
  console.timeLog(id);
}



// partially from here: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
export interface DrawProps {
  getData?: () => Float32Array;
}
export type DrawFunc = (ctx: CanvasRenderingContext2D, drawProps?: DrawProps) => void;


// Effect that returns a canvas ref animated by draw(), with optional rate limiting 
// specify maxRate in hz
export function useCanvas(draw: DrawFunc, props?: DrawProps, maxRate?: number): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const SEC_TO_NANO = 1000000000;
  // TODO: add rate limiting

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');

    let frameId: number;
    let lastFrameTime: DOMHighResTimeStamp;
    let startTime: DOMHighResTimeStamp;

    // render() is the animation loop
    const render = (curTime: DOMHighResTimeStamp) => {
      if (ctx) {
        if (startTime == null) {
          startTime = curTime;
        }

        // rate limit if specififed
        if (maxRate && lastFrameTime) {
          const periodNano = 1 / maxRate * SEC_TO_NANO;
          if ((curTime - lastFrameTime) < periodNano) return;
        }

        draw(ctx, props);

        lastFrameTime = curTime;
        frameId = window.requestAnimationFrame(render); // usually already rate limits to screen refresh rate
      }

    };
    window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [draw, props, maxRate]);

  return canvasRef;
}
