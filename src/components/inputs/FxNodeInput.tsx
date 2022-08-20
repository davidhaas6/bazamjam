import { FunctionComponent, useEffect, useRef, useState } from "react";
import { EssentiaFx, FunctionGraph, getAvailableFunctions, getFunction, GraphNode, isValidFunction } from "../../logic/network";
import FxField from "./FxField";
import TextInput from "./TextInput";

interface FxNodeInputProps {
  addFunction: (key: string) => void;
}


const FxNodeInput: FunctionComponent<FxNodeInputProps> = (props: FxNodeInputProps) => {
  const [selectedFx, setSelectedFx] = useState<EssentiaFx>();

  const handleEnter = (usrIn: string) => {
    console.log("heyy", usrIn)
    if (isValidFunction(usrIn)) {
      setSelectedFx(() => getFunction(usrIn))
    }
  }

  useEffect(() => {
    console.log(selectedFx);
  }, [selectedFx])


  const showErr = (str: string) => str.length != 0 && !isValidFunction(str);
  const listOptions = getAvailableFunctions();

  return (
    <div>
      <TextInput
        onEnter={(str) => handleEnter(str)}
        options={listOptions}
        showErr={showErr}
      />
      {selectedFx != null &&
        <div className="fx-box">
          <FxField function={selectedFx} />
          <br/>
          <button onClick={() => {
            props.addFunction(selectedFx.name);
            console.log("adding node for ", selectedFx.name)
            // props.setGraph()
          }}> Add to Graph </button>
        </div>
      }

    </div>
  );
}

export default FxNodeInput;