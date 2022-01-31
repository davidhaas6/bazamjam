import { RefObject, useEffect, useRef, useState } from "react";

export function useDidMount() {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  return didMount;
}


// partially from here: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
export interface DrawProps {
  getData?: () => Float32Array;
}
export type DrawFunc = (ctx: CanvasRenderingContext2D, drawProps?: DrawProps) => void;


// Effect that returns a canvas ref animated by draw(), with optional rate limiting 
export function useCanvas(draw: DrawFunc, props?: DrawProps, maxRate?: number): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // TODO: add rate limiting

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let frameCount = 0;
    let frameId: number;

    // render() is the animation loop   --TODO: add rate limiting
    const render = () => {
      if (ctx) {
        frameCount += 1;
        draw(ctx, props);
        frameId = window.requestAnimationFrame(render);
      }

    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [draw]);

  return canvasRef;
}
