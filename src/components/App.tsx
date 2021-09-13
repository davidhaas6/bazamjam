import React, { ReactElement } from 'react';
import './App.css';
import RecordingButton from './RecordingButton';
import ToggleButton from 'react-bootstrap/ToggleButton'
import AudioManager from './AudioManager';
import { Col, Container, Row } from 'react-bootstrap';


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
    console.log("rendering // is audio null? " + (audio === null));

    return (
      <div className="App">
        <Container className="controls">
          <AudioManager audio={audio} />
          <RecordingButton isRecording={this.state.audio !== null} onClick={this.toggleMicrophone} />
        </Container>
      </div>
    );
  }

}


export default App;
