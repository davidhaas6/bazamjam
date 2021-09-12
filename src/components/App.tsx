import React, { ReactElement } from 'react';
import './App.css';
import RecordingButton from './RecordingButton';
import ToggleButton from 'react-bootstrap/ToggleButton'
import AudioManager from './AudioManager';


type AppState = {
  audio: MediaStream | null; // like this
};



class App extends React.Component<{}, AppState> {
  BUFFER_MS: number = 50;
  // state: AppState =
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
        <div className="controls">
          {audio != null ? <AudioManager audio={audio}/> : ""}
          <RecordingButton isRecording={this.state.audio !== null} onClick={this.toggleMicrophone} />
        </div>
      </div>
    );
  }

}


export default App;
