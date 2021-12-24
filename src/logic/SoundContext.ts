import React from "react";
import AudioSnapshot from "./AudioSnapshot";

const emptySnapshot = new AudioSnapshot(new Float32Array(0));
const SoundContext = React.createContext(emptySnapshot);

export default SoundContext;