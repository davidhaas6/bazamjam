import React, { ReactElement } from 'react';
import './App.css';
import RecordingButton from './RecordingButton';
import ToggleButton from 'react-bootstrap/ToggleButton'

type AppProps = {
};

type AppState = {
  recording: boolean; // like this
  recorder?: MediaRecorder;
};



class App extends React.Component<AppProps, AppState> {
  BUFFER_MS: number = 50;

  state: AppState = {
    recording: false
  }

  startBtnClbk = (): void => {
    let newRecordingState = !this.state.recording; // todo: possible race conditions?
    this.setState((state) => ({ recording: newRecordingState }));

    if (newRecordingState === true) {
      this.startStream();
    } else {
      this.stopStream();
    }
  }

  startStream(): void {
    if (this.state.recorder === undefined) {
      this.initStream();
    } else {
      if (this.state.recorder.state !== "recording") {
        this.state.recorder.start(this.BUFFER_MS);
      }
    }
  }

  initStream(): void {
    // Initializes and starts an audio stream
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log(stream);
        let mediaRecorder = new MediaRecorder(stream, {mimeType: "audio/wav"});
        mediaRecorder.ondataavailable = this.audioCallback;
        mediaRecorder.start(this.BUFFER_MS);

    //         const context = new AudioContext();
    // const source = context.createMediaStreamSource(mediaRecorder.stream);
    // const processor = context.createScriptProcessor(1024, 1, 1);

    // source.connect(processor);
    // processor.connect(context.destination);

    // processor.onaudioprocess = function(e) {
    //   // Do something with the data, e.g. convert it to WAV
    //   console.log(e.inputBuffer);
    // };

        this.setState({ recorder: mediaRecorder });
      })
      .catch(error => {
        console.log(error);
      });
  }

  stopStream(): void {
    if (this.state.recorder) {
      this.state.recorder.stop();
    }
  }

  audioCallback = (event: BlobEvent) => {
    let blob: Blob = event.data;
    console.log(blob.size, blob.type);
    blob.arrayBuffer().then(this.processBuffer);
    // const context = new AudioContext();
    // const source = context.createMediaStreamSource(recorder.stream);
    // const processor = context.createScriptProcessor(1024, 1, 1);

    // source.connect(processor);
    // processor.connect(context.destination);

    // processor.onaudioprocess = function(e) {
    //   // Do something with the data, e.g. convert it to WAV
    //   console.log(e.inputBuffer);
    // };
  }

  processBuffer(buffer: ArrayBuffer) {
    
  }

  render(): ReactElement {
    console.log("rendering with recording state = " + this.state.recording);


    return (
      <div className="App">
        <header className="App-header">

          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>


          <RecordingButton isRecording={this.state.recording} onClick={this.startBtnClbk} />
        </header>
      </div>
    );
  }

}


export default App;
