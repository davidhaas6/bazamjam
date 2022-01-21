import { FunctionComponent, ReactChild, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useDidMount } from "../../logic/hooks";

interface ControlButtonProps {
  pressedChild?: ReactChild;
  notPressedChild?: ReactChild;
  onPress?: () => void;
  onRelease?: () => void;
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
  }, [isPressed]);

  let buttonClass = "control-button " + (isPressed ? "cb-pressed" : "");

  return (
    <button className={buttonClass} onClick={() => {
      let isPressedNow = !isPressed;

      // call user callbacks
      if (isPressedNow) {
        if (props.onPress) {
          props.onPress();
        }
      } else {
        if (props.onRelease) {
          props.onRelease();
        }
      }

      // update state
      setIsPressed(() => isPressedNow)
    }}>
      <span>
        {isPressed ? props.pressedChild : props.notPressedChild}
      </span>
    </button>
  );
}

export default ControlButton;