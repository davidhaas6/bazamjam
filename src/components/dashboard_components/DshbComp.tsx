import { Layout } from "react-grid-layout";

export interface IDashboardComponentProps {
  // logic
  
  // grid-item requirements
  className?: string;
  key?: string;
  "data-grid"?: Layout;
  style?: { [x: string]: string };
  children?: React.ReactNode[];
};