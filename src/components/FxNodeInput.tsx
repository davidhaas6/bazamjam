import { FunctionComponent, useRef, useState } from "react";
import { GraphNode } from "../logic/network";

interface NodeAdderProps {
    addNode: (node: GraphNode) => void;
}


const FxNodeInput: FunctionComponent<NodeAdderProps> = (props: NodeAdderProps) => {
    const [userInput, setUserInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyPress = (key: string) => {
        console.log("key", key)
        if (key === "Enter" && inputRef.current != null) {
            setUserInput(inputRef.current.value);
        }
    }

    // useEffect(() => {
    //   // Search for the essentia function
    
    //   return () => {
    //     second
    //   }
    // }, [third])
    

    return (
        <div>
            <input ref={inputRef} type="text"
                onKeyPress={(e) => handleKeyPress(e.key)}
            />
        </div>
    );
}

export default FxNodeInput;