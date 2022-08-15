import React, { FunctionComponent, useMemo } from 'react';
import 'react-bootstrap';
import "../assets/App.css";
import Dashboard from '../components/Dashboard';
import AudioManager from '../logic/AudioManager';
import PubSub from '../logic/PubSub';


// Provider contexts
export const AudioManagerContext = React.createContext(new AudioManager(new PubSub()));
export const PubSubContext = React.createContext(new PubSub());


interface IAppProps {}
const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  const pubSub = useMemo(() => new PubSub(), []);
  const audioManager = useMemo(() => new AudioManager(pubSub), [pubSub]);

  return (
    <PubSubContext.Provider value={pubSub}>
      <AudioManagerContext.Provider value={audioManager}>

        <div className="App">
          <Dashboard />
        </div>

      </AudioManagerContext.Provider>
    </PubSubContext.Provider >
  );
}

export default App;
