// holds all the dashboard widgets

import { Component, FunctionComponent, ReactElement, useState } from "react";

// grid
import RGL, { WidthProvider, Layout, ReactGridLayoutProps } from 'react-grid-layout';
// import ReactGridLayout from "react-grid-layout";
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';

const ReactGridLayout = WidthProvider(RGL);

interface IDashboardProps {

}

const defaultComponents: ReactElement[] = [
  <div key="a" className="dashboard-component">a</div>,
  <div key="b" className="dashboard-component">b</div>,
  <div key="c" className="dashboard-component">c</div>,
];

interface IBreakpoints {
  lg?: number,
  md?: number,
  sm?: number,
  xs?: number,
  xxs?: number
};

const breakpoints: IBreakpoints = { lg: 1200, xs: 480};
type breakpointKeys = keyof IBreakpoints;


const defaultLayouts: { [key in breakpointKeys]?: Layout[] } = {
  lg: [
    { i: 'a', x: 0, y: 0, w: 1, h: 1, /*static: true*/ },
    { i: 'b', x: 1, y: 1, w: 1, h: 1, minW: 1, maxW: 2, minH: 1, maxH: 2  },
    { i: 'c', x: 4, y: 2, w: 1, h: 1 }
  ]

};

const defaultProps: ReactGridLayoutProps = {
  layout: defaultLayouts.lg,
  rowHeight: 200,
  cols: 3,
  verticalCompact: false,
  isBounded: true,
  onLayoutChange: function () { },
};

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  // initialize the components we'll have on our dashboard
  const [components, setComponents] = useState(defaultComponents);
  const [layouts, setLayouts] = useState(defaultLayouts);

  props = defaultProps; //todo
  props.cols

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">

      <ReactGridLayout className="grid" {...defaultProps}>
        {components}
      </ReactGridLayout>
    </div >
  );
}

export default Dashboard;

    // <ResponsiveGridLayout className="layout" layouts={layouts}
    //   // breakpoints={breakpoints}
    //   isDroppable={true}
    //   preventCollision={false}
    //   // allowOverlap={false}
    //   cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    // >
    //   {components}
    // </ResponsiveGridLayout>