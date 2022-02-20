import { FunctionComponent, useEffect, useState } from "react";

interface TonalDisplayProps {
  data?: ITonalData;
}

export interface ITonalData {
  chords_changes_rate: any,
  chords_histogram: any,
  chords_key: any,
  chords_number_rate: any,
  chords_progression: any,
  chords_scale: any,
  chords_strength: any,
  hpcp: any,
  hpcp_highres: any,
  key_key: any,
  key_scale: any,
  key_strength: any
}

const TonalDisplay: FunctionComponent<TonalDisplayProps> = (props: TonalDisplayProps) => {
  const { data } = props;
  const [chord, setChord] = useState();

  const has_chord = data?.chords_key != null;

  useEffect(() => {
    if (has_chord)
      setChord(() => data.chords_key);
  }, [data?.chords_key])

  const headerText = (has_chord ? "Current" : "Past") + " Chord:"; 


  return (
    <div className="tonal-display" >
      {/* <ul>
        {Object.entries(data).map((entry) => <li>{entry[0] + ": " + entry[1]}</li>)}
      </ul> */}
      <br/>
      {headerText}
      <div className="current-chord">{chord}</div>
    </div>
  );
}

export default TonalDisplay;