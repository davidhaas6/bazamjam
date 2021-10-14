import { time } from "console";
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




export interface IRecorderProps extends IDashboardComponentProps {
  audioManager: AudioManager;
}

const Recorder: FunctionComponent<IRecorderProps> = forwardRef(({ className, style = {}, children, ...props }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundData, setSoundData] = useState(new Float32Array(0));
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  // display properties
  let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;
  let playPauseIcon = isPlaying ? icons.pauseOff : icons.pauseOn;
  let recordingText = isRecording ? "Recording..." : "  ";

  // functions
  let onPlayPauseClick = () => setIsPlaying(!isPlaying);

  let recordingStatus = useCallback(() => updateTimeData, []);


  let onRecordClick = () => {
    let newRecordingState = !isRecording;
    if (newRecordingState) {
      props.audioManager.startRecording();
      console.log("\n\nstarted\n")
    }
    else {
      props.audioManager.stopRecording();
      console.log("\n\nstopped\n")
    }
    setIsRecording(newRecordingState);
  };
  

  const updateTimeData = () => {
    let timeData = props.audioManager.getTimeData();
    setSoundData(new Float32Array(timeData));
    // console.group("timeData");
    // console.log("isRecording: ", isRecording);
    // console.log(timeData.slice(0, 3));
    // console.log(timeData.length);
    // console.groupEnd();
    // console.log(timeData == soundData);
    // console.log(soundData[0], soundData.length);
  };
  // console.log("recorder rendered: ", soundData[0], soundData.length);
  // logic
  let updatePeriod =  props.audioManager.FFT_SIZE / props.audioManager.SAMPLE_RATE;


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

      <SoundGraph soundData={soundData} isRecording={isRecording}/>

      {/* <div onClick={onPlayPauseClick}>{playPauseIcon}</div> */}

      {children}
    </div>
  );
});

export default Recorder;