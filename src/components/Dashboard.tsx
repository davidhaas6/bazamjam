// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import "../assets/App.css";
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';

import { FunctionComponent, useMemo, useState } from "react";

import AudioManager from "../logic/AudioManager";
import AudioSnapshot from "../logic/AudioSnapshot";


interface IDashboardProps {

}

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  const [audioManager, setaudioManager] = useState(new AudioManager());
  let [audioSnapshot, setAudioSnapshot] = useState(new AudioSnapshot());

  const snapshot = useMemo(() => audioSnapshot, [audioSnapshot]);

  return (
    <div className="dashboard">


    </div >
  );
}

export default Dashboard;
