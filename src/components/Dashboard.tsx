import { createElement, FunctionComponent, ReactElement, useMemo, useState } from "react";
import "../assets/App.css";

// grid
import RGL, { Layout, ReactGridLayoutProps, WidthProvider } from 'react-grid-layout';
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';
import AudioManager from "../logic/AudioManager";
import SampleComponent from "./SampleComponent";
import RecorderComponent from "./recorder/Recorder";
import MidiM from "./midi-mouth/MidiMComp";
import React from "react";
import AudioSnapshot from "../logic/AudioSnapshot";
import SoundContext from "../logic/SoundContext";
import Tuner from "./tuner/Tuner";
import DashboardComponent from "./generic/DshbComp";


/*
 =========== types
*/
export interface IGridComponent<T> {
  element: FunctionComponent<T>;
  props: T;
  layout: Layout;
  children?: React.ReactNode[];
}

/*
 =========== constants
*/
const ReactGridLayout = WidthProvider(RGL);

const gridProps: ReactGridLayoutProps = {
  // layout: defaultLayouts.lg,
  rowHeight: 200,
  cols: 3,
  verticalCompact: true,
  isBounded: true,
  onLayoutChange: function () { },
};

const recorderLayout = { i: 'recorder', x: 0, y: 0, w: 3, h: 1, static: true };
const tunerLayout = { i: 'tuner', x: 0, y: 1, w: 1, h: 1, static: false };

const components: { [key: string]: IGridComponent<any> } = {
  sample: {
    element: SampleComponent,
    props: {},
    layout: { i: 'sample', x: 1, y: 2, w: 1, h: 1 }
  },
  midiMouth: {
    element: MidiM,
    props: {},
    layout: { i: '1', x: 0, y: 0, w: 1, h: 3 }
  },
};


interface IDashboardProps { }

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  const [audioManager, setaudioManager] = useState(new AudioManager());
  let [audioSnapshot, setAudioSnapshot] = useState(new AudioSnapshot());

  const snapshot = useMemo(() => audioSnapshot, [audioSnapshot]);

  let updateSoundData = (soundData?: Float32Array) => {
    // TODO: This re renders the whole dashboard, fix
    // problem: how to update context consumers without updating state?

    setAudioSnapshot(new AudioSnapshot(soundData));
  }

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      <SoundContext.Provider value={snapshot}>
        <ReactGridLayout className="grid" {...gridProps}>

          <DashboardComponent data-grid={recorderLayout} key={recorderLayout.i}>
            <RecorderComponent audioManager={audioManager} updateSoundData={updateSoundData} />
          </DashboardComponent>

          <DashboardComponent data-grid={tunerLayout} key={tunerLayout.i} >
            <Tuner audioManager={audioManager} audioActive={audioManager.audioActive} />
          </DashboardComponent>

          <DashboardComponent data-grid={components.sample.layout} key={components.sample.layout.i} >
            <SampleComponent />
          </DashboardComponent>

        </ReactGridLayout>
      </SoundContext.Provider>
    </div >
  );
}

export default Dashboard;
