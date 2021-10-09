import React, { ReactElement } from 'react';
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
  BUFFER_MS: number = 50;

  constructor() {
    super({});

    this.state = {
      audio: null
    };

    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }


  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio });
  }

  stopMicrophone() {
    if (this.state.audio) {
      this.state.audio.getTracks().forEach(track => track.stop());
      this.setState({ audio: null });
    }
  }

  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }


  render(): ReactElement {
    const audio = this.state.audio;

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
