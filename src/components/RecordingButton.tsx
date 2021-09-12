import { FunctionComponent } from "react";

interface IStartButtonProps {
    isRecording: boolean;
    onClick: () => void;
}

const RecordingButton: FunctionComponent<IStartButtonProps> = (props: IStartButtonProps) => {
    return (
        <button className="base-button submit-button" onClick={props.onClick}>
            Start
        </button>
    );
}

export default RecordingButton;