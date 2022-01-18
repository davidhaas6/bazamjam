import {  FunctionComponent } from "react";

export interface IDashboardComponentProps {
  // logic
  className?: string;
  key?: string;
  style?: { [x: string]: string };
  children?: React.ReactNode[];
};


// TODO: Compostable dashboard component wrapper?
const DashboardComponent: FunctionComponent<IDashboardComponentProps> = (props: IDashboardComponentProps) => {
    // const {style} = props;
  return (
    <div {...props} >
      {props.children}
    </div>
  );
}

export default DashboardComponent;