import { FunctionComponent, useContext } from "react";
import { AccordionButton, Button, PlaceholderButton } from "react-bootstrap";
import AudioManager from "../logic/AudioManager";
import { AudioManagerContext } from "../routes/App";
import RecordingButton from "./recorder/RecordButton";

interface ButtonPanelProps {
  // audioManager: AudioManager;
}

const ButtonPanel: FunctionComponent<ButtonPanelProps> = (props: ButtonPanelProps) => {
  const audioManager = useContext(AudioManagerContext);

  return (
    <div className="button-box">
      <RecordingButton />
      <div className="control-button-box">
        
      </div>
    </div>
  );
}

export default ButtonPanel;