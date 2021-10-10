import React, { ReactElement } from 'react';
import AudioManager from '../logic/AudioManager';
import './App.css';
import Dashboard, { IDashboardGridComponentProps } from './Dashboard';
import Recorder from './dashboard_components/Recorder';
import Sidebar from './Sidebar';


type AppState = {
  audio: MediaStream | null;
};




class App extends React.Component<{}, AppState> {
  audioManager: AudioManager;

  dashboardComponents: { [key: string]: IDashboardGridComponentProps } = {
    temp1: {
      element: <div>hi there fella</div>,
      layout: { i: '1', x: 0, y: 0, w: 1, h: 1 }
    },
    temp2: {
      element: <div >look, im a box!</div>,
      layout: { i: '2', x: 1, y: 1, w: 1, h: 1 }
    }
  }

  constructor() {
    super({});

    this.audioManager = new AudioManager();
    
    this.dashboardComponents["recorder"] =    {
      element: <Recorder audioManager={this.audioManager}/>,
      layout: { i: 'recorder', x: 0, y: 0, w: 3, h: 1, static: true }
    };
    // TODO: Create hooks for audio manager tasks like mic control, adding nodes
  }


  render(): ReactElement {

    let components: IDashboardGridComponentProps[] = [
      this.dashboardComponents['recorder'],
      this.dashboardComponents.temp1,
      this.dashboardComponents.temp2,
    ];

    return (
      <div className="App">
        <Sidebar />
        <Dashboard components={components} />
      </div>
    );
  }

}


export default App;
