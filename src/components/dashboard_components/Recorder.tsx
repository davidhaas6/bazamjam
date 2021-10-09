import { FunctionComponent, useState, forwardRef } from "react";
import { Layout } from "react-grid-layout";

import { TiMediaRecord, TiMediaRecordOutline, TiMediaPauseOutline, TiMediaPlayOutline } from "react-icons/ti";
import { IDashboardComponentProps } from "./DshbComp";

const icons = {
  recordOn: <TiMediaRecord size={100} />,
  recordOff: <TiMediaRecordOutline size={100} />,
  pauseOn: <TiMediaPlayOutline size={100} />,
  pauseOff: <TiMediaPauseOutline size={100} />
};


interface IRecorderProps extends IDashboardComponentProps {

}


const Recorder: FunctionComponent<IRecorderProps> = forwardRef(({ className, style = {}, children, ...otherProps }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // display properties
  let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;
  let playPauseIcon = isPlaying ? icons.pauseOff : icons.pauseOn;
  let recordingText = isRecording ? "Recording..." : "  ";

  // functions
  let onRecordClick = () => setIsRecording(!isRecording);
  let onPlayPauseClick = () => setIsPlaying(!isPlaying);

  return (
    <div
      {...otherProps}
      style={{ ...style }}
      className={className + " recorder"}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <div className="recorder-controls">
        <div onClick={onRecordClick}>{recordingIcon}</div>
        <p>{recordingText}</p>
      </div>

      {/* <div onClick={onPlayPauseClick}>{playPauseIcon}</div> */}

      {children}
    </div>
  );
});

export default Recorder;