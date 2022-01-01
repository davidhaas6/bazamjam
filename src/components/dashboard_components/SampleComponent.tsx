import { forwardRef, FunctionComponent, useContext } from "react";
import SoundContext from "../../logic/SoundContext";
import { getRMS, getAmplitude, roundNum } from "../../logic/util/Math";
import { IDashboardComponentProps } from "./DshbComp";

interface SampleComponentProps extends IDashboardComponentProps {
  text?: string;
}


const SampleComponent: FunctionComponent<SampleComponentProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    let { text = "Hi there" } = props;
    // const soundData = useContext(SoundContext).soundData;
    return (
      <div {...props}
        style={{ ...style }}
        className={className + " simple-component"}
        ref={ref as React.RefObject<HTMLDivElement>}>
        <div style={{ textAlign: 'center' }}>
          <SoundContext.Consumer>
            {
              snapshot =>
                snapshot.hasSoundData() ?
                  <div>
                    RMS: {roundNum(getRMS(snapshot.soundData), 3)}
                    <br />
                    Amplitude: {roundNum(getAmplitude(snapshot.soundData), 3)}
                  </div>
                  :
                  <p>Start Recording!</p>



            }
          </SoundContext.Consumer>
        </div>

        {/* <iframe src="https://www.omfgdogs.com/"></iframe> */}
      </div>
    );
  });

export default SampleComponent;