import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';

import 'react-bootstrap'
import AudioManager from '../logic/AudioManager';
import React from 'react';
import ButtonPanel from '../components/control-section/ButtonPanel';
import PubSub from '../logic/PubSub';
import LoadingDisplay from '../components/generic/LoadingDisplay';


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

  

  const infoContent = useMemo(() => {
    if (curPanel == "dashboard") {
      return <Dashboard />
    } else if (curPanel == "widgets") {

    }  else if (curPanel == "settings") {
      return 
    }

    return <LoadingDisplay />;
  }, [curPanel]);

  console.log("panel: " + curPanel);

  return (
    <div className="App">
      <PubSubContext.Provider value={pubSub}>
        <AudioManagerContext.Provider value={audioManager}>
          <div className="box-body">


            <div className="info-box">
              { infoContent }
              
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
