import { FunctionComponent } from "react";
import { roundNum } from "../../../logic/util/Math";
import { INote, Tuning } from "./Tuner";


interface ITunerDisplayProps {
    pitch: number;
    targetNote: INote;
    tuning: Tuning;
}

const TunerDisplay: FunctionComponent<ITunerDisplayProps> = (props: ITunerDisplayProps) => {

    return (<div className="tuner">
        <div>
        {!props.targetNote.empty &&
            props.tuning.map(note => {
                let spanClass = "";
                if (note.name === props.targetNote.name && !isNaN(props.pitch)) {
                    spanClass += " alert-text"
                }
                return <span className={spanClass}>{note.name} </span>;
            })
        }
        </div>

        <div>
            Target: {roundNum(props.targetNote.freq!, 1)} Hz
            <br />
            You: 
            {isNaN(props.pitch) ?
                <span className="alert-text"> !!!</span>
                :
                <span> {roundNum(props.pitch, 1)} Hz</span>
            }
        </div>

    </div>);
}

export default TunerDisplay;