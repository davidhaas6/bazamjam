import { FunctionComponent } from "react";

interface ErrorDisplayProps {
  text?: string;
}

const ErrorDisplay: FunctionComponent<ErrorDisplayProps> = (props: ErrorDisplayProps) => {
  return (
    <div className="error-display">
      Uh oh! :{'<'}
      <br />
      {props.text}
    </div>
  );
}

export default ErrorDisplay;