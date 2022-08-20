import { FunctionComponent, useRef, useState } from "react";

interface TextInputProps {
  onEnter: (userInput: string) => void;
  showErr?: (userInput: string) => boolean;
  options?: string[];
  uuid?: string;
}

const TextInput: FunctionComponent<TextInputProps> = (props: TextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState("");


  const handleKeyPress = (key: string) => {
    console.log("key", key)
    if (key === "Enter" && inputRef.current != null) {
      const usrIn = inputRef.current.value;
      setUserInput(usrIn);
      props.onEnter(usrIn);
      inputRef.current.value = "";
    }
  }

  const showError = props.showErr?.(userInput) ?? false;
  const listOptions = props.options?.map((fx) => <option value={fx} key={fx} />)

  const listId = "options" + props?.uuid;
  console.log(props.uuid, " list id=",listId)
  return (
    <>
      <input ref={inputRef} type="text"
        onKeyPress={(e) => handleKeyPress(e.key)}
        list={listId} key={props?.uuid}
      />
      {listOptions &&
        <datalist id={listId}>
          {listOptions}
        </datalist>
      }
      {showError && <div>Invalid input: {userInput}</div>}
    </>
  );
}

export default TextInput;