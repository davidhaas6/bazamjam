import { FunctionComponent, useContext, useMemo } from "react";
import { AudioManagerContext } from "../../routes/App";
import ControlButton from "./ControlButton";

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

  let iconSize = 40;
  const icons = useMemo(() => {
    return {
      play: <BsFillPlayFill className="cb-icon" size={iconSize + 2} />,
      pause: <BsFillPauseFill className="cb-icon" size={iconSize + 0} />,
      settings: <BsGearFill className="cb-icon" size={iconSize - 2} />,
      close: <RiCloseLine className="cb-icon" size={iconSize + 2} />,
      widgets: <BsFillGridFill className="cb-icon" size={iconSize - 2} />,
      recorderPressed: <TiMediaStopOutline size={50} />,
      recorderUnpressed: <TiNotesOutline size={50} />
    }
  }, [iconSize]);




  return (
    <div className="layout-section button-box">

      {/* recording button */}
      <ControlButton
        onPress={() => {
          audioManager.startRecording();
          props.setPanel("dashboard")
        }}
        onRelease={() => audioManager.stopRecording()}
        // baseStyles="recording-button"
        // pressedStyles="rb-pressed"
        pressedChild={icons.recorderPressed}
        notPressedChild={icons.recorderUnpressed}
        releaseCondition={props.curPanel !== "dashboard"}
      />



      {/* widget button */}
      <ControlButton
        notPressedChild={icons.widgets}
        pressedChild={icons.close}
        onPress={() => { props.setPanel("widgets") }}
        onRelease={() => { props.setPanel("dashboard") }}
        releaseCondition={props.curPanel !== "widgets"}
      />

      {/* settings button */}
      <ControlButton
        notPressedChild={icons.settings}
        pressedChild={icons.close}
        onPress={() => { props.setPanel("settings") }}
        onRelease={() => { props.setPanel("dashboard") }}
        releaseCondition={props.curPanel !== "settings"}
      />

      {/* play button */}
      <ControlButton
        notPressedChild={icons.play}
        pressedChild={icons.pause}
      />

    </div>
  );
}

export default ButtonPanel;