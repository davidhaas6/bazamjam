// holds all the dashboard widgets

import { cloneElement, Component, FunctionComponent, ReactElement, useState } from "react";

// grid
import RGL, { WidthProvider, Layout, ReactGridLayoutProps } from 'react-grid-layout';
// import ReactGridLayout from "react-grid-layout";
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';
import "./App.css"
const ReactGridLayout = WidthProvider(RGL);

export interface IDashboardComponentProps {
  component: ReactElement;
  layout: Layout;
}

interface IDashboardProps {
  components?: ReactElement[];
  layouts?: Layout[];
}


const defaultProps: ReactGridLayoutProps = {
  // layout: defaultLayouts.lg,
  rowHeight: 200,
  cols: 3,
  verticalCompact: true,
  isBounded: true,
  onLayoutChange: function () { },
};


function buildComponents(components: ReactElement[], layouts: Layout[]): ReactElement[] {
  return components.map((comp, i) =>
    cloneElement(
      comp,
      {
        className: "dashboard-component",
        key: layouts[i].i,
        "data-grid": layouts[i]
      },
    ));
}

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  // initialize the components we'll have on our dashboard
  // const [components, setComponents] = useState(defaultComponents);
  // const [layouts, setLayouts] = useState(defaultLayouts);

  let gridProps = defaultProps; //todo

  let elements: ReactElement[] = [];
  if (props.components && props.layouts) {
    elements = buildComponents(props.components, props.layouts);

    // console.log("props loaded");
    // console.log({ elements });
    console.log({ props, elements });
  }

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      <ReactGridLayout className="grid" {...gridProps}>
        {elements}
      </ReactGridLayout>
    </div >
  );
}

export default Dashboard;
