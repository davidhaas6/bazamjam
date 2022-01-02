import { forwardRef, FunctionComponent, ReactElement } from "react";
import { Layout } from "react-grid-layout";

export interface IDashboardComponentProps {
  // logic

  // grid-item requirements
  className?: string;
  key?: string;
  "data-grid"?: Layout;
  style?: { [x: string]: string };
  children?: any;
};


// TODO: Compostable dashboard component wrapper?
const DashboardComponent: FunctionComponent<IDashboardComponentProps> = forwardRef(({ className, style = {}, ...props }, ref) => {
  return (
    <div {...props}
      style={{ ...style }}
      className={className + " dashboard-component"}
      ref={ref as React.RefObject<HTMLDivElement>}>
      {props.children}
    </div>
  );
});

export default DashboardComponent;