import React, { FunctionComponent, useMemo, useState } from 'react';
import 'react-bootstrap';
import "../assets/App.css";
import ButtonPanel from '../components/control-section/ButtonPanel';
import Dashboard from '../components/Dashboard';
import Settings from '../components/Settings';
import Visuals from '../components/Visuals';
import Widgets from '../components/Widgets';
import AudioManager from '../logic/AudioManager';
import PubSub from '../logic/PubSub';


// Provider contexts
export const AudioManagerContext = React.createContext(new AudioManager(new PubSub()));
export const PubSubContext = React.createContext(new PubSub());


interface IAppProps {}
const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  const pubSub = useMemo(() => new PubSub(), []);
  const audioManager = useMemo(() => new AudioManager(pubSub), [pubSub]);

  const [curPanel, setCurPanel] = useState("dashboard");

  console.log("panel: " + curPanel);

  return (
    <PubSubContext.Provider value={pubSub}>
      <AudioManagerContext.Provider value={audioManager}>

        <div className="App">
          <div className="box-body">
            <div className="layout-section info-box">
              {curPanel === "widgets" ? <Widgets /> : null}
              {curPanel === "settings" ? <Settings /> : null}
              <Dashboard className={curPanel !== "dashboard" ? "hidden" : ""} /> {/* only hide the dashboard so it doesn't dismount */}
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
