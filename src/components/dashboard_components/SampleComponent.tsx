import { forwardRef, FunctionComponent, useContext } from "react";
import SoundContext from "../../logic/SoundContext";
import { IDashboardComponentProps } from "./DshbComp";

interface SampleComponentProps extends IDashboardComponentProps {
  text?: string;
}

const SampleComponent: FunctionComponent<SampleComponentProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    let { text = "Hi there" } = props;
    // const soundData = useContext(SoundContext).soundData;
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
                {snapshot.soundData.length > 0 &&
                  snapshot.soundData.reduce(
                    (running, cur) => running + Math.abs(cur)
                  ) / snapshot.soundData.length}
              </div>
          }
          {/* <div style={{ textAlign: 'center' }}>
                            {soundData.length > 0 &&
                             soundData.reduce((running, cur) => running + Math.abs(cur)) / soundData.length}
                        </div> */}

        </SoundContext.Consumer>

        {/* <iframe src="https://www.omfgdogs.com/"></iframe> */}
      </div>
    );
  });

export default SampleComponent;