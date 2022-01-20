import { FunctionComponent, useState } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';

import 'react-bootstrap'
import AudioManager from '../logic/AudioManager';
import React from 'react';
import ButtonPanel from '../components/ButtonPanel';
import PubSub from '../logic/PubSub';


// Provider contexts
export const AudioManagerContext = React.createContext(new AudioManager(new PubSub()));
export const PubSubContext = React.createContext(new PubSub());


interface IAppProps {

}


const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  const [pubSub, setPubSub] = useState<PubSub>(new PubSub());
  const [audioManager, setaudioManager] = useState(new AudioManager(pubSub));


  return (
    <div className="App">
      <PubSubContext.Provider value={pubSub}>
        <AudioManagerContext.Provider value={audioManager}>
          <div className="box-body">


            <div className="info-box">
              <Dashboard />
            </div>

            <div className="display-box"></div>

            <ButtonPanel />

          </div>
        </AudioManagerContext.Provider>
      </PubSubContext.Provider >
    </div>
  );
}

export default App;
