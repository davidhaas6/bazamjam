import React, { ReactElement } from 'react';
import './App.css';
import RecordingButton from './RecordingButton';
import ToggleButton from 'react-bootstrap/ToggleButton'
import AudioManager from './AudioManager';
import { Col, Container, Navbar, Row } from 'react-bootstrap';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';


type AppState = {
  audio: MediaStream | null;
};


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

    return (
      <div className="App">
        <Sidebar />
        <Dashboard />

        {/* <Container fluid>
            <Col id="sidebar-wrapper">
              <Sidebar />
            </Col>
            <Col id="page-content-wrapper">
              <Dashboard />
            </Col>
        </Container> */}
        {/* <Dashboard/> */}
      </div>
    );
  }

}


export default App;
