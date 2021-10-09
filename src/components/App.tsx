import React, { ReactElement } from 'react';
import AudioManager from '../logic/AudioManager';
import './App.css';
import Dashboard, { IDashboardComponentProps } from './Dashboard';
import Recorder from './dashboard_components/Recorder';
import Sidebar from './Sidebar';


type AppState = {
  audio: MediaStream | null;
};

const dashboardComponents: { [key: string]: IDashboardComponentProps } = {
  recorder: {
    component: <Recorder />,
    layout: { i: 'recorder', x: 0, y: 0, w: 3, h: 1, static: true }
  },
  temp1: {
    component: <div>hi there fella</div>,
    layout: { i: '1', x: 0, y: 0, w: 1, h: 1}
  },
  temp2: {
    component: <div >look, im a box!</div>,
    layout: { i: '2', x: 1, y: 1, w: 1, h: 1}
  }
}


class App extends React.Component<{}, AppState> {
  audioManager: AudioManager;

  constructor() {
    super({});

    this.audioManager = new AudioManager();
    // TODO: Create hooks for audio manager tasks like mic control, adding nodes
  }


  render(): ReactElement {

    let components: IDashboardComponentProps[] = [
      dashboardComponents.recorder,
      dashboardComponents.temp1,
      dashboardComponents.temp2,
    ];

    return (
      <div className="App">
        <Sidebar />
        <Dashboard
          components={components.map((comp) => comp.component)}
          layouts={components.map((comp) => comp.layout)}
        />
      </div>
    );
  }

}


export default App;
