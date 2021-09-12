import { FunctionComponent } from "react";
import ToggleButton from "react-bootstrap/esm/ToggleButton";

interface IStartButtonProps {
    isRecording: boolean;
    onClick: () => void;
}

const RecordingButton: FunctionComponent<IStartButtonProps> = (props: IStartButtonProps) => {
    let message = props.isRecording ? "Stop Recording" : "Start Recording";
    let btnVariant = props.isRecording ? "warning" : "success";
    
    return (
        <ToggleButton className="btn mb-3" type="checkbox" value="1"
         variant={btnVariant}
         checked={props.isRecording} 
         onClick={props.onClick}
         >
            {message}
        </ToggleButton>
    );
}

export default RecordingButton;