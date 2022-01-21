import { FunctionComponent, useContext, useMemo, useState } from "react";
import { AudioManagerContext } from "../../routes/App";
import ControlButton from "./ControlButton";
import RecordingButton from "./RecordButton";

import {
  BsFillPauseFill, BsGearFill,
  BsFillGridFill, BsFillPlayFill
} from "react-icons/bs";

import { RiCloseLine } from "react-icons/ri";

interface ButtonPanelProps {
  curPanel: string;  // the current display in the 'dashboard'
  setPanel: (panel: string) => void; 
}

const ButtonPanel: FunctionComponent<ButtonPanelProps> = (props: ButtonPanelProps) => {

  
  let iconSize = 24;
  const icons = useMemo(() => {
    return {
      play: <BsFillPlayFill className="cb-icon" size={iconSize+2}/>,
      pause: <BsFillPauseFill className="cb-icon" size={iconSize+0}/>,
      settings: <BsGearFill className="cb-icon" size={iconSize-2}/>,
      close: <RiCloseLine className="cb-icon" size={iconSize+2}/>,
      widgets: <BsFillGridFill className="cb-icon" size={iconSize-2}/>,
    }
  }, [iconSize]);


  return (
    <div className="button-box">
      <RecordingButton />
      <div className="control-button-box">

        {/* widget button */}
        <ControlButton 
          notPressedChild={icons.widgets}
          pressedChild={icons.close}
          onPress={() => { props.setPanel("widgets") }}
          onRelease={() => { props.setPanel("dashboard") }}
        />

        {/* options button */}
        <ControlButton
        notPressedChild={icons.settings}
          pressedChild={icons.close}
          onPress={() => { props.setPanel("settings") }}
          onRelease={() => { props.setPanel("dashboard") }}
          
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