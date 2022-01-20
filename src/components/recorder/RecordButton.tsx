// a button that starts recording

import { FunctionComponent, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AudioManagerContext } from "../../routes/App";

interface RecordingButtonProps {
}

const RecordingButton: FunctionComponent<RecordingButtonProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioManager = useContext(AudioManagerContext);

  const snd_on = useMemo(() => {
    return new Audio("assets/sound/switch-on-2.wav");
  },[]);

  const snd_off = useMemo(() => {
    return new Audio("assets/sound/switch-off-2.wav");
  },[]);

  const onPress = () => {
    console.log("pressed");
    setIsRecording(() => !isRecording);
    let weRecording = !isRecording;

    if (weRecording) {
      
    } else {
     
    }

  }

  useEffect(() => {
    if(isRecording) {
      audioManager.startRecording();
      snd_on.play();
    } else {
      audioManager.stopRecording();
      snd_off.play();
    }
  }, [isRecording]);

  
  

  let buttonClass = "recording-button " + (isRecording ? "rb-pressed" : "");
  console.log("isRecording", isRecording);
  console.log("buttonClass", buttonClass);
  

  return (
    <div className="recording-box">
      <button onClick={() => setIsRecording(() => !isRecording)} className={buttonClass}>
        <span>
          {isRecording ? "Stop" : "Record"}
        </span>
      </button>
    </div>
  );
}

export default RecordingButton;