// holds all the dashboard widgets

import { Component, FunctionComponent, ReactElement, useState } from "react";

// grid
import { Responsive as ResponsiveGridLayout, Layout } from 'react-grid-layout';
import ReactGridLayout from "react-grid-layout";
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';


interface IDashboardProps {

}

const defaultComponents: ReactElement[] = [
  <div key="a" className="dashboard-component">1</div>,
  <div key="b" className="dashboard-component" >2</div>,
  <div key="c" className="dashboard-component">3</div>,
];

interface IBreakpoints {
  lg?: number,
  md?: number,
  sm?: number,
  xs?: number,
  xxs?: number
};

const breakpoints: IBreakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
type breakpointKeys = keyof IBreakpoints;


const defaultLayouts: { [key in breakpointKeys]?: Layout[] } = {
  lg: [
    { i: 'a', x: 0, y: 0, w: 3, h: 2, static: true },
    { i: 'b', x: 1, y: 0, w: 3, h: 1, minW: 2, maxW: 4 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 }
  ]

};

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  // initialize the components we'll have on our dashboard
  const [components, setComponents] = useState(defaultComponents);
  const [layouts, setLayouts] = useState(defaultLayouts);

  return (
    // https://github.com/react-grid-layout/react-grid-layout
    <ReactGridLayout className="layout" layout={defaultLayouts.lg} cols={3} autoSize={false} >
      {components}

    </ReactGridLayout>
    // <ResponsiveGridLayout className="layout" layouts={layouts}
    //   // breakpoints={breakpoints}
    //   isDroppable={true}
    //   preventCollision={false}
    //   // allowOverlap={false}
    //   cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    // >
    //   {components}
    // </ResponsiveGridLayout>
  );
}

export default Dashboard;