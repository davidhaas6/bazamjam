import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';

import 'react-bootstrap'
import AudioManager from '../logic/AudioManager';
import React from 'react';
import ButtonPanel from '../components/control-section/ButtonPanel';
import PubSub from '../logic/PubSub';
import LoadingDisplay from '../components/generic/LoadingDisplay';
import ErrorDisplay from '../components/generic/ErrorDisplay';
import Settings from '../components/Settings';
import Widgets from '../components/Widgets';
import Visuals from '../components/Visuals';


function useDidMount() {
  const [didMount, setDidMount] = useState(false)
  useEffect(() => { setDidMount(true) }, [])

  return didMount
}

// Provider contexts
export const AudioManagerContext = React.createContext(new AudioManager(new PubSub()));
export const PubSubContext = React.createContext(new PubSub());


interface IAppProps {

}


const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  const pubSub = useMemo(() => new PubSub(), []);
  const audioManager = useMemo(() => new AudioManager(pubSub), []);

  const [curPanel, setCurPanel] = useState("dashboard");

  console.log("panel: " + curPanel);

  return (
    <PubSubContext.Provider value={pubSub}>
      <AudioManagerContext.Provider value={audioManager}>

        <div className="App">
          <div className="box-body">
            <div className="layout-section info-box">
              {curPanel == "widgets" ? <Widgets /> : null}
              {curPanel == "settings" ? <Settings /> : null}
              <Dashboard className={curPanel != "dashboard" ? "hidden" : ""} /> {/* only hide the dashboard so it doesn't dismount */}
            </div>

            <div className="layout-section display-box">
              <Visuals />
            </div>

            <ButtonPanel curPanel={curPanel} setPanel={(newPanel) => setCurPanel(newPanel)} />
          </div>
        </div>

      </AudioManagerContext.Provider>
    </PubSubContext.Provider >
  );
}

export default App;
