import { FunctionComponent, useState, forwardRef } from "react";
import { Layout } from "react-grid-layout";

import { TiMediaRecord, TiMediaRecordOutline, TiMediaPauseOutline, TiMediaPlayOutline } from "react-icons/ti";

const icons = {
  recordOn: <TiMediaRecord size={100} />,
  recordOff: <TiMediaRecordOutline size={100} />,
  pauseOn: <TiMediaPlayOutline size={100} />,
  pauseOff: <TiMediaPauseOutline size={100} />
};


interface IRecorderProps {
  className?: string;
  key?: string;
  "data-grid"?: Layout;
  style?: { [x: string]: string };
  children?: React.ReactNode[];
}

// const Recorder: FunctionComponent<IRecorderProps> = forwardRef(({i, children, ...props}, ref) => {
//   const [isRecording, setIsRecording] = useState(false);

//   let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;
//   //<div key="c" className="dashboard-component">Doododooo.. la tee daahh</div>,
//   return (
//     <div className="recorder" key={key} {...props} ref={ref as React.RefObject<HTMLDivElement>} >
//       {recordingIcon}
//     </div>
//   );
// });

const Recorder: FunctionComponent<IRecorderProps> = forwardRef(({ className, style = {}, children, ...otherProps }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // display properties
  let recordingIcon = isRecording ? icons.recordOn : icons.recordOff;
  let playPauseIcon = isPlaying ? icons.pauseOff : icons.pauseOn;

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
      <div onClick={onRecordClick}>{recordingIcon}</div>
      {/* <div onClick={onPlayPauseClick}>{playPauseIcon}</div> */}
      
      {children}
    </div>
  );
});

export default Recorder;