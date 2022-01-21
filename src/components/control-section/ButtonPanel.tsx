import { FunctionComponent, useContext, useMemo, useState } from "react";
import { AudioManagerContext } from "../../routes/App";
import ControlButton from "./ControlButton";
import RecordingButton from "./RecordButton";

import { TiMediaStopOutline, TiNotesOutline } from "react-icons/ti";
import { RiCloseLine } from "react-icons/ri";
import {
  BsFillPauseFill, BsGearFill,
  BsFillGridFill, BsFillPlayFill
} from "react-icons/bs";


interface ButtonPanelProps {
  curPanel: string;  // the current display in the 'dashboard'
  setPanel: (panel: string) => void;
}

const ButtonPanel: FunctionComponent<ButtonPanelProps> = (props: ButtonPanelProps) => {
  const audioManager = useContext(AudioManagerContext);

  let iconSize = 24;
  const icons = useMemo(() => {
    return {
      play: <BsFillPlayFill className="cb-icon" size={iconSize + 2} />,
      pause: <BsFillPauseFill className="cb-icon" size={iconSize + 0} />,
      settings: <BsGearFill className="cb-icon" size={iconSize - 2} />,
      close: <RiCloseLine className="cb-icon" size={iconSize + 2} />,
      widgets: <BsFillGridFill className="cb-icon" size={iconSize - 2} />,
      recorderPressed: <TiMediaStopOutline size={iconSize * 2} />,
      recorderUnpressed: <TiNotesOutline size={iconSize * 2} />
    }
  }, [iconSize]);




  return (
    <div className="button-box">
      {/* recording button */}
      <div className="recording-box">
        <ControlButton
          onPress={() => {
            audioManager.startRecording();
            props.setPanel("dashboard")
          }}
          onRelease={() => audioManager.stopRecording()}
          baseStyles="recording-button"
          pressedStyles="rb-pressed"
          pressedChild={icons.recorderPressed}
          notPressedChild={icons.recorderUnpressed}
          releaseCondition={props.curPanel != "dashboard"}
        />
      </div>

      {/* other buttons */}
      <div className="control-button-box">

        {/* widget button */}
        <ControlButton
          notPressedChild={icons.widgets}
          pressedChild={icons.close}
          onPress={() => { props.setPanel("widgets") }}
          onRelease={() => { props.setPanel("dashboard") }}
          releaseCondition={props.curPanel != "widgets"}
        />

        {/* settings button */}
        <ControlButton
          notPressedChild={icons.settings}
          pressedChild={icons.close}
          onPress={() => { props.setPanel("settings") }}
          onRelease={() => { props.setPanel("dashboard") }}
          releaseCondition={props.curPanel != "settings"}
        />

        {/* play button */}
        <ControlButton
          notPressedChild={icons.play}
          pressedChild={icons.pause}
        />
      </div>
    </div>
  );
}

export default ButtonPanel;