import React, { ReactElement } from 'react';
import './App.css';
import RecordingButton from './RecordingButton';

type AppProps = {
};
type AppState = {
  recording: boolean; // like this
};

class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    recording: false
  }

  startBtnClbk = (): void  => {
    this.setState((state) => ({recording: !state.recording}));
  }

  render(): ReactElement {
    return (
      <div className="App">
        <header className="App-header">
          
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <RecordingButton isRecording={this.state.recording} onClick={this.startBtnClbk} />
        </header>
      </div>
    );
  }
}


export default App;
