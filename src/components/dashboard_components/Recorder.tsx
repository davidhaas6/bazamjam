import { FunctionComponent, useState, forwardRef, useEffect, useCallback } from "react";
import { Layout } from "react-grid-layout";

import { TiMediaRecord, TiMediaRecordOutline, TiMediaPauseOutline, TiMediaPlayOutline } from "react-icons/ti";
import AudioManager from "../../logic/AudioManager";
import { IDashboardComponentProps } from "./DshbComp";
import SoundGraph from "./SoundGraph";

const icons = {
  recordOn: <TiMediaRecord size={100} />,
  recordOff: <TiMediaRecordOutline size={100} />,
  pauseOn: <TiMediaPlayOutline size={100} />,
  pauseOff: <TiMediaPauseOutline size={100} />
};




interface IRecorderProps extends IDashboardComponentProps {
  audioManager: AudioManager;
}



const Recorder: FunctionComponent<IRecorderProps> = forwardRef(({ className, style = {}, children, ...props }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);


  // display properties
  let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;
  let playPauseIcon = isPlaying ? icons.pauseOff : icons.pauseOn;
  let recordingText = isRecording ? "Recording..." : "  ";

  // functions
  let onRecordClick = () => {
    let newRecordingState = !isRecording;
    if (newRecordingState)
      props.audioManager.startRecording();
    else
      props.audioManager.stopRecording();
    setIsRecording(newRecordingState);
  };
  let onPlayPauseClick = () => setIsPlaying(!isPlaying);
  let getTimeData = () => props.audioManager.getTimeData();//useCallback(props.audioManager.getTimeData,[],);

  // logic
  let updateFreq = 1;//props.audioManager.SAMPLE_RATE / props.audioManager.FFT_SIZE;


  return (
    <div
      {...props}
      style={{ ...style }}
      className={className + " recorder"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <div className="recorder-controls">
        <div onClick={onRecordClick}>{recordingIcon}</div>
        {/* <p>{recordingText}</p> */}
      </div>

      <div>
        <SoundGraph audioCallback={getTimeData} updateFreq={updateFreq} />
      </div>

      {/* <div onClick={onPlayPauseClick}>{playPauseIcon}</div> */}

      {children}
    </div>
  );
});

export default Recorder;