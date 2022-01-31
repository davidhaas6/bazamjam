import { FunctionComponent, useEffect } from "react";
import { ITonalData } from "./Tuner";

interface TonalDisplayProps {
  data: ITonalData;
}


const TonalDisplay: FunctionComponent<TonalDisplayProps> = (props: TonalDisplayProps) => {
  const { data } = props;

  return (
    <div className="tonal-display" >
      <ul>
        {Object.entries(data).map((entry) => <li>{entry[0] + ": " + entry[1]}</li>)}
      </ul>
    </div>
  );
}

export default TonalDisplay;