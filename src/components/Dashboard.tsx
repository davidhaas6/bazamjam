import { createElement, FunctionComponent, ReactElement, useMemo, useState } from "react";
import "../assets/App.css";

// grid
import RGL, { Layout, ReactGridLayoutProps, WidthProvider } from 'react-grid-layout';
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';
import AudioManager from "../logic/AudioManager";
import SampleComponent from "./dashboard_components/SampleComponent";
import RecorderComponent from "./dashboard_components/Recorder";
import MidiM from "./dashboard_components/MidiMComp";
import React from "react";
import AudioSnapshot from "../logic/AudioSnapshot";
import SoundContext from "../logic/SoundContext";
import PitchComponent from "./dashboard_components/PitchComponent";


const ReactGridLayout = WidthProvider(RGL);


/*
 =========== types
*/


export interface IGridComponent<T> {
  element: FunctionComponent<T>;
  props: T;
  layout: Layout;
  children?: React.ReactNode[];
}

interface IDashboardProps {
}

/*
 =========== constants
*/

// layout
const gridProps: ReactGridLayoutProps = {
  // layout: defaultLayouts.lg,
  rowHeight: 200,
  cols: 3,
  verticalCompact: true,
  isBounded: true,
  onLayoutChange: function () { },
};

const components: { [key: string]: IGridComponent<any> } = {
  //   temp1: {
  //     element: SampleComponent,
  //     props: {},
  //     layout: { i: '1', x: 0, y: 0, w: 1, h: 1 }
  //   },
  temp2: {
    element: SampleComponent,
    props: {}, //TODO: how to pass state?
    layout: { i: '2', x: 1, y: 1, w: 1, h: 1 }
  },
  midiMouth: {
    element: MidiM,
    props: {},
    layout: { i: '1', x: 0, y: 0, w: 1, h: 3 }
  },
  // pitch: {
  //   element: PitchComponent,
  //   props: {},
  //   layout: { i: '3', x: 1, y: 2, w: 1, h: 1 }
  // }
};
const defaultLayout = Object.values(components);

const recorderLayout = { i: 'recorder', x: 0, y: 0, w: 3, h: 1, static: true };
// sound

/*
 =========== functions
*/

// applys the layouts to the passed in items and creates some grid-items out of them
function buildComponents(components: IGridComponent<any>[]): ReactElement[] {
  console.log("Components built");
  console.log("num components: " + components.length);

  return components.map((comp: IGridComponent<any>, i) =>
    createElement(comp.element, {
      props: comp.props, // passed in props

      // props for grid-itemsa
      className: "dashboard-component",
      key: comp.layout.i,
      "data-grid": comp.layout
    }, comp.children)
  );
}


// TODO: Dashboard rebuilds with each new audio data
const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  const [audioManager, setaudioManager] = useState(new AudioManager());
  let [audioSnapshot, setAudioSnapshot] = useState(new AudioSnapshot());
  const [dshbLayout, setDshbLayout] = useState(defaultLayout);

  const snapshot = useMemo(() => audioSnapshot,
    [audioSnapshot]);

  // execute on first build
  let builtElements: ReactElement[] = useMemo(() =>
    buildComponents(dshbLayout)
    , [dshbLayout]
  );
  // console.log("dashboard");

  let updateSoundData = (soundData?: Float32Array) => {
    // TODO: This re renders the whole dashboard, fix
    // problem: how to update context consumers without updating state?
    setAudioSnapshot(new AudioSnapshot(soundData));
  }

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      {/* <FloatArrayContext.Provider value={audioSnapshot.soundData}> */}
      <SoundContext.Provider value={snapshot}>
        <ReactGridLayout className="grid" {...gridProps}>

          {/* recorder */}
          <RecorderComponent className="dashboard-component"
            audioManager={audioManager} updateSoundData={updateSoundData}
            data-grid={recorderLayout} key={recorderLayout.i}
          />
          <PitchComponent className="dashboard-component" audioManager={audioManager} 
          data-grid={{ i: '3', x: 1, y: 2, w: 1, h: 1 }} key={'3'} />

          {builtElements}

        </ReactGridLayout>
      </SoundContext.Provider>
      {/* </FloatArrayContext.Provider> */}
    </div >
  );
}

export default Dashboard;
