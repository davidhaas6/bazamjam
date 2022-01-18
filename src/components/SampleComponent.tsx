import { FunctionComponent } from "react";

import SoundContext from "../logic/SoundContext";
import { getRMS, getAmplitude, roundNum } from "../logic/util/Math";
import { IDashboardComponentProps } from "./generic/DshbComp";
import InactiveDisplay from "./generic/InactiveDisplay";

interface SampleComponentProps extends IDashboardComponentProps {
  text?: string;
}

const SampleComponent: FunctionComponent<SampleComponentProps> = (props: SampleComponentProps) => {
    return (
        <div className="simple-component">
          <h4>Sound Stats</h4>
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
                  <InactiveDisplay />
                
            }
          </SoundContext.Consumer>
        </div>
    );
  }
export default SampleComponent;