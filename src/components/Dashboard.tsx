import {  createElement, FunctionComponent, ReactElement, useMemo, useState } from "react";
import "../assets/App.css";

// grid
import RGL, { Layout, ReactGridLayoutProps, WidthProvider } from 'react-grid-layout';
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';
import AudioManager from "../logic/AudioManager";
import SampleComponent from "./dashboard_components/SampleComponent";
import Recorder from "./dashboard_components/Recorder";
import MidiMouth from "../routes/MidiMouth";
import MidiM from "./dashboard_components/MidiMComp";


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
//   temp2: {
//     element: SampleComponent,
//     props: {},
//     layout: { i: '2', x: 1, y: 1, w: 1, h: 1 }
//   },
  midiMouth: {
      element: MidiM,
      props: {},
      layout: { i: '1', x: 0, y: 0, w: 1, h: 2 }
  }
};
const defaultLayout = Object.values(components);

const recorderLayout = { i: 'recorder', x: 0, y: 0, w: 3, h: 1, static: true };


/*
 =========== functions
*/

// applys the layouts to the passed in items and creates some grid-items out of them
function buildComponents(components: IGridComponent<any>[]): ReactElement[] {
  console.log("Components built");

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

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  const [audioManager, setaudioManager] = useState(new AudioManager());
  const [dshbLayout, setDshbLayout] = useState(defaultLayout);
  // execute on first build


  // TODO: How often does this get built? is it a side-effect?
  let builtElements: ReactElement[] = useMemo(() =>
    buildComponents(dshbLayout)
    , [dshbLayout]
  );
  console.timeLog("dashboard");

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      <ReactGridLayout className="grid" {...gridProps}>
        <Recorder className="dashboard-component" audioManager={audioManager}
          data-grid={recorderLayout} key={recorderLayout.i} />

        {builtElements}
      </ReactGridLayout>
    </div >
  );
}

export default Dashboard;
