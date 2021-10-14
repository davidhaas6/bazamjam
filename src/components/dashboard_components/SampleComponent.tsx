import { forwardRef, FunctionComponent } from "react";
import { IDashboardComponentProps } from "./DshbComp";

interface SampleComponentProps extends IDashboardComponentProps {
  text?: string;
}

const SampleComponent: FunctionComponent<SampleComponentProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    let { text = "Hi there" } = props;
    return (
      <div {...props}
        style={{ ...style }}
        className={className + " recorder"}
        ref={ref as React.RefObject<HTMLDivElement>}>
        <div style={{ textAlign: 'center' }}> {text} </div>
      </div>
    );
  });

export default SampleComponent;