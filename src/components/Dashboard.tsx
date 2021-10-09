// holds all the dashboard widgets

import { cloneElement, FunctionComponent, ReactElement } from "react";
// grid
import RGL, { Layout, ReactGridLayoutProps, WidthProvider } from 'react-grid-layout';
// import ReactGridLayout from "react-grid-layout";
import '../assets/grid_styles.css';
import '../assets/resizable_styles.css';
import "./App.css";

const ReactGridLayout = WidthProvider(RGL);

export interface IDashboardGridComponentProps {
  element: ReactElement;
  layout: Layout;
}

interface IDashboardProps {
  components: IDashboardGridComponentProps[];
}


const defaultProps: ReactGridLayoutProps = {
  // layout: defaultLayouts.lg,
  rowHeight: 200,
  cols: 3,
  verticalCompact: true,
  isBounded: true,
  onLayoutChange: function () { },
};


// applys the layouts to the passed in items and creates some grid-items out of them
function buildComponents(components: IDashboardGridComponentProps[]): ReactElement[] {
  console.log("Components built");
  return components.map((comp, i) =>
    cloneElement(
      comp.element,
      {
        className: "dashboard-component",
        key: comp.layout.i,
        "data-grid": comp.layout
      },
    ));
}

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  let builtElements: ReactElement[] = buildComponents(props.components);;

  // https://github.com/react-grid-layout/react-grid-layout
  return (
    <div className="dashboard">
      <ReactGridLayout className="grid" {...defaultProps}>
        {builtElements}
      </ReactGridLayout>
    </div >
  );
}

export default Dashboard;
