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
  const [pubSub, setPubSub] = useState<PubSub>(new PubSub());
  const [audioManager, setaudioManager] = useState(new AudioManager(pubSub));
  const [curPanel, setCurPanel] = useState("dashboard");



  let infoContent;
  if (curPanel == "dashboard") {
    infoContent = <Dashboard />
  } else if (curPanel == "widgets") {
    infoContent = <Widgets />;
  } else if (curPanel == "settings") {
    infoContent = <Settings />;
  }
  else {
    infoContent = <ErrorDisplay />;
  }
  console.log("panel: " + curPanel);




  return (
    <div className="App">
      <PubSubContext.Provider value={pubSub}>
        <AudioManagerContext.Provider value={audioManager}>
          <div className="box-body">


            <div className="info-box">
              <Dashboard className={curPanel != "dashboard" ? "hidden" : ""} />
              {curPanel == "widgets" ? <Widgets /> : null}
              {curPanel == "settings" ? <Settings /> : null}

            </div>

            <div className="display-box"></div>

            <ButtonPanel curPanel={curPanel} setPanel={(newPanel) => setCurPanel(newPanel)} />

          </div>
        </AudioManagerContext.Provider>
      </PubSubContext.Provider >
    </div>
  );
}

export default App;
