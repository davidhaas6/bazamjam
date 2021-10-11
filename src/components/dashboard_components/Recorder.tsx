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

  console.log("(global) isRecording: ", isRecording);

  // display properties
  let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;
  let playPauseIcon = isPlaying ? icons.pauseOff : icons.pauseOn;
  let recordingText = isRecording ? "Recording..." : "  ";

  // functions
  let onPlayPauseClick = () => setIsPlaying(!isPlaying);

  let recordingStatus = useCallback(() => updateTimeData, []);

  let onRecordClick = () => {
    let newRecordingState = !isRecording;
    if (newRecordingState)
      props.audioManager.startRecording();
    else
      props.audioManager.stopRecording();
    setIsRecording(newRecordingState);
    console.log(newRecordingState);
  };

  let updateTimeData = useCallback(() => {
    console.group("timeData");
    console.log("isRecording: ", isRecording);
    if (isRecording) {
      let timeData = props.audioManager.getTimeData();

      console.log(timeData.slice(0, 3));
      
      console.log(timeData.length);

      // TODO: isrecording isnt updated -- cant access it
      setSoundData(timeData);

    }
    else {
      console.log("Not recording");
    }
    console.groupEnd();
  }, [isRecording]);

  // logic
  let updatePeriod = 1000;// props.audioManager.FFT_SIZE / props.audioManager.SAMPLE_RATE;


  // launch settings
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeData()
    }, updatePeriod);
    return () => clearInterval(interval);
  },[]);


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
        <SoundGraph soundData={soundData} />
      </div>

      {/* <div onClick={onPlayPauseClick}>{playPauseIcon}</div> */}

      {children}
    </div>
  );
});

export default Recorder;