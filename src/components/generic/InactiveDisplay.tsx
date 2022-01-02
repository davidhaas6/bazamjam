import { FunctionComponent } from "react";

interface InactiveDisplayProps {
  onClick?: () => void;
}

const InactiveDisplay: FunctionComponent<InactiveDisplayProps> = (props: InactiveDisplayProps) => {
  return (<div className="inactive-display"> Press Play! </div>);
}

export default InactiveDisplay;