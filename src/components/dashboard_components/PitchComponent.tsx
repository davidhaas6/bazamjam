import { forwardRef, FunctionComponent, useContext } from "react";
import SoundContext from "../../logic/SoundContext";
import { IDashboardComponentProps } from "./DshbComp";


// @ts-ignore
import Essentia from 'essentia.js';
// @ts-ignore
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';

// const essentia = new Essentia(EssentiaWASM); // this works! but you need to do this stuff in another thread


interface PitchComponentProps extends IDashboardComponentProps {
  text?: string;
}

function getPitch(data: Float32Array) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Math.abs(data[i]);
  }
  return sum / data.length;
}

const PitchComponent: FunctionComponent<PitchComponentProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    let { text = "Hi there" } = props;
    console.log("refresh");
    return (
      <div {...props}
        style={{ ...style }}
        className={className + " recorder"}
        ref={ref as React.RefObject<HTMLDivElement>}>

        <SoundContext.Consumer>
          {
            snapshot =>
              <div style={{ textAlign: 'center' }}>

              </div>
          }
        </SoundContext.Consumer>

      </div>
    );
  });

export default PitchComponent;