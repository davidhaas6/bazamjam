import { FunctionComponent, useEffect, useState } from "react";

import { TiMediaRecord, TiMediaRecordOutline, TiMediaPauseOutline, TiMediaPlayOutline } from "react-icons/ti";
import AudioManager from "../../logic/AudioManager";
import SoundContext from "../../logic/SoundContext";
import SoundGraph from "./SoundGraph";


const icons = {
  recordOn: <TiMediaRecord size={100} />,
  recordOff: <TiMediaRecordOutline size={100} />,
  pauseOn: <TiMediaPlayOutline size={100} />,
  pauseOff: <TiMediaPauseOutline size={100} />
};


export interface IRecorderProps {
  audioManager: AudioManager;
  updateSoundData: (data?: Float32Array) => void;
}

const RecorderComponent: FunctionComponent<IRecorderProps> = (props: IRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  // display properties
  let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;

  // recording start/stop callback
  let onRecordClick = () => {
    let newRecordingState = !isRecording;
    // Recording!
    if (newRecordingState) {
      props.audioManager.startRecording();
      console.log("\n\nstarted\n")
    }
    // Not recording
    else {
      props.audioManager.stopRecording();
      props.updateSoundData(undefined);
      console.log("\n\nstopped\n")
    }
    setIsRecording(newRecordingState);
  };


  const updateTimeData = () => {
    let timeData = new Float32Array(props.audioManager.getTimeData());
    props.updateSoundData(timeData);
  };

  let updatePeriod = props.audioManager.FFT_SIZE / props.audioManager.SAMPLE_RATE;

  // start timer when record is hit -- stop it once is record is off
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(updateTimeData, updatePeriod);
      setIntervalId(interval);
    }
    else if (intervalId != null) {
      clearInterval(intervalId);
    }
  }, [isRecording]);


  // could use key={soundData[0]} and other keys to only rerender sound graph
  return (
    <div className="recorder">
      <div className="recorder-controls">
        <div onClick={onRecordClick}>{recordingIcon}</div>
      </div>

      <SoundContext.Consumer>
        {
          snapshot =>
            snapshot.hasSoundData() &&
            <SoundGraph soundData={snapshot.soundData} isRecording={isRecording} />
        }
      </SoundContext.Consumer>
    </div>
  );
}

export default RecorderComponent;