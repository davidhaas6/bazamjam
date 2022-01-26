import { FunctionComponent } from "react";
import { freqToMidi, linearMap, roundNum } from "../../logic/util/Math";
import { INote, Tuning } from "./Tuner";


interface ITunerDisplayProps {
  pitch: number;
  targetNote: INote;
  tuning: Tuning;
}

function getPitchAngle(pitch: number, target: INote) {
  if (target.midi == null) return 0;
  const max = 90;
  const min = -90;

  let diff = freqToMidi(pitch) - target.midi;
  let deg = linearMap(diff,-12,12,min,max);
  return deg;
}

const TunerDisplay: FunctionComponent<ITunerDisplayProps> = (props: ITunerDisplayProps) => {
  const {pitch, targetNote, tuning} = props;
  
  let rotation = targetNote && getPitchAngle(pitch, targetNote);
  return (
    <div>
      <div className="tuner-notes">
        {!props.targetNote.empty &&
          props.tuning.map(note => {
            let spanClass = "";
            if (note.name === props.targetNote.name && !isNaN(props.pitch)) {
              spanClass += " tuner-target"
            }
            return <span className={spanClass} key={note.name}>{note.name} </span>;
          })
        }
      </div>
      <div>
        Target: {roundNum(props.targetNote.freq!, 1)} Hz
        <br />
        You:
        {isNaN(props.pitch) ?
          <span> ~~~</span>
          :
          <span> {roundNum(props.pitch, 1)} Hz</span>
        }
      </div>
      {/* <div className="tuner-bar" style={{transform: `rotate(${rotation}deg)`}}/> */}
    </div>
  );
}

export default TunerDisplay;