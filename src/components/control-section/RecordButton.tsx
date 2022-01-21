// a button that starts recording

import { FunctionComponent, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AudioManagerContext } from "../../routes/App";
import ControlButton from "./ControlButton";

import { TiMediaStopOutline, TiTimes, TiNotesOutline } from "react-icons/ti";

const iconSize = 64;
const PressedIcon = <TiMediaStopOutline size={iconSize} />
const UnPressedIcon = <TiNotesOutline size={iconSize} />

interface RecordingButtonProps {
  onPress?: () => void;
}

const RecordingButton: FunctionComponent<RecordingButtonProps> = (props: RecordingButtonProps) => {
  const audioManager = useContext(AudioManagerContext);

  return (
    <div className="recording-box">
      <ControlButton
        onPress={() => {
          audioManager.startRecording();
          if (props.onPress) props.onPress();
        }}
        onRelease={() => audioManager.stopRecording()}
        baseStyles="recording-button"
        pressedStyles="rb-pressed"
        pressedChild={PressedIcon}
        notPressedChild={UnPressedIcon}
      />
    </div>
  );
}

export default RecordingButton;