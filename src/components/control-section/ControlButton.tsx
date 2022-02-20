import { FunctionComponent, ReactChild, useEffect, useMemo, useState } from "react";
import { useDidMount } from "../../logic/hooks";

interface ControlButtonProps {
  pressedChild?: ReactChild;
  notPressedChild?: ReactChild;

  baseStyles?: string;
  pressedStyles?: string;

  onPress?: () => void;
  onRelease?: () => void;

  releaseCondition?: boolean; // release button when this is true
}

const ControlButton: FunctionComponent<ControlButtonProps> = (props: ControlButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const didMount = useDidMount();

  const snd_on = useMemo(() => {
    return new Audio("assets/sound/switch-on-2.wav");
  }, []);

  const snd_off = useMemo(() => {
    return new Audio("assets/sound/switch-off-2.wav");
  }, []);

  useEffect(() => {
    if (didMount) {
      if (isPressed) {
        snd_on.play();
      } else {
        snd_off.play();
      }
    }
  }, [isPressed, snd_on, snd_off]);

  useEffect(() => {
    if (props.releaseCondition) {
      setIsPressed(false);
      console.log("release condition executred");
    }
  }, [props.releaseCondition]);

  // execute press/release functions
  useEffect(() => {
    if (isPressed) {
      props?.onPress?.();
    } else {
      props?.onRelease?.();
      console.log("release called")
    }
    //console.log("effect called:",isPressed);
  }, [isPressed] );


  // add css classes based on button state
  let buttonClass = props.baseStyles ?? "control-button";
  buttonClass += " " + (isPressed ? (props.pressedStyles ?? "cb-pressed") : "");

  return (
    <button className={buttonClass} onClick={() => {setIsPressed((press:boolean) => !press)}}>
      <span>
        {isPressed ? props.pressedChild : props.notPressedChild}
      </span>
    </button>
  );
}

export default ControlButton;