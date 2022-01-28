import { time } from "console";
import { FunctionComponent, useEffect, useState } from "react";
import { ITonalData } from "./Tuner";

interface TonalDisplayProps {
  data: ITonalData;
}

function useFreqLog(id: string) {
  useEffect(() => {
    console.time(id);
  }, [id]);

  // const [prevTime, setPrevTime] = useState<number>();
  // const [buffer, setBuffer] = useState<number[]>([0,0,0,0,0,0,0ss]);
  // const time = performance.now();

  // if (prevTime) {

  //   let delta = time - prevTime;
  //   console.log(id + ": " + delta);
  // }
  // setPrevTime(time);
  console.timeLog(id);
}

const TonalDisplay: FunctionComponent<TonalDisplayProps> = (props: TonalDisplayProps) => {
  const { data } = props;

  useFreqLog("TonalDisplay");

  return (
    <div className="tonal-display" >
      <ul>
        {Object.entries(data).map((entry) => <li>{entry[0] + ": " + entry[1]}</li>)}
      </ul>
    </div>
  );
}

export default TonalDisplay;