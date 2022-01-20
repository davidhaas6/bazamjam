import { FunctionComponent, useState } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';

import 'react-bootstrap'
import AudioManager from '../logic/AudioManager';
import React from 'react';
import ButtonPanel from '../components/ButtonPanel';

interface IAppProps {

}


const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  const [audioManager, setaudioManager] = useState(new AudioManager());

  return (
    <div className="App">

      <AudioManagerContext.Provider value={audioManager}>
        <div className="box-body">


          <div className="info-box">
            <Dashboard />
          </div>

          <div className="display-box"></div>

            <ButtonPanel />

        </div>
      </AudioManagerContext.Provider>

    </div>
  );
}

export const AudioManagerContext = React.createContext(new AudioManager());

export default App;
