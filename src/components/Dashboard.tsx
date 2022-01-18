// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import "../assets/App.css";

import { FunctionComponent, useContext, useMemo, useState } from "react";

import AudioManager from "../logic/AudioManager";
import AudioSnapshot from "../logic/AudioSnapshot";
import Tuner from "./tuner/Tuner";
import RecorderComponent from "./recorder/Recorder";
import { AudioManagerContext } from "../routes/App";


interface IDashboardProps {

}

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  const audioManager = useContext(AudioManagerContext);
  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      {/* <RecorderComponent audioManager={audioManager} updateSoundData={updateSoundData} /> */}
      <Tuner audioManager={audioManager} audioActive={audioManager.audioActive} />

    </div >
  );
}

export default Dashboard;
