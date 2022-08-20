import { FunctionComponent, useEffect, useRef, useState } from "react";
import { EssentiaFx, FunctionGraph, getAvailableFunctions, getFunction, GraphNode, isValidFunction } from "../../logic/network";
import FxField from "./FxField";

interface FxNodeInputProps {
  addFunction: (key: string) => void;
}


const FxNodeInput: FunctionComponent<FxNodeInputProps> = (props: FxNodeInputProps) => {
  const [userInput, setUserInput] = useState("");
  const [selectedFx, setSelectedFx] = useState<EssentiaFx>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (key: string) => {
    console.log("key", key)
    if (key === "Enter" && inputRef.current != null) {
      const usrIn = inputRef.current.value;
      setUserInput(usrIn);
      inputRef.current.value = "";

      if (isValidFunction(usrIn)) {
        setSelectedFx(getFunction(usrIn))
      }
      else console.log("Invalid fx:", usrIn)
    }
  }

  useEffect(() => {
    console.log(selectedFx);
  }, [selectedFx])


  const showError = userInput.length > 0 && !isValidFunction(userInput);
  const listOptions = getAvailableFunctions().map((fx) => <option value={fx} />)

  return (
    <div>
      <input ref={inputRef} type="text"
        onKeyPress={(e) => handleKeyPress(e.key)}
        list="options"
      />
      <datalist id="options">
        {listOptions}
    </datalist>
      {showError && <div>Invalid function: {userInput}</div>}
      {selectedFx != null &&
        <>
          <FxField function={selectedFx} />
          <button onClick={() => {
            props.addFunction(userInput);
            console.log("adding node for ", userInput)
            // props.setGraph()
          }} className="height: 100px"/>
        </>
      }

    </div>
  );
}

export default FxNodeInput;