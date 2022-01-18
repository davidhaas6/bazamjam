// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import "../assets/App.css";

import { FunctionComponent, useMemo, useState } from "react";

import AudioManager from "../logic/AudioManager";
import AudioSnapshot from "../logic/AudioSnapshot";
import Tuner from "./tuner/Tuner";
import RecorderComponent from "./recorder/Recorder";


interface IDashboardProps {

}

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  const [audioManager, setaudioManager] = useState(new AudioManager());
  let [audioSnapshot, setAudioSnapshot] = useState(new AudioSnapshot());

  const snapshot = useMemo(() => audioSnapshot, [audioSnapshot]);

  let updateSoundData = (soundData?: Float32Array) => {
    // TODO: This re renders the whole dashboard, fix
    // problem: how to update context consumers without updating state?

    setAudioSnapshot(new AudioSnapshot(soundData));
  }

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      <RecorderComponent audioManager={audioManager} updateSoundData={updateSoundData} />
      <Tuner audioManager={audioManager} audioActive={audioManager.audioActive} />

    </div >
  );
}

export default Dashboard;
