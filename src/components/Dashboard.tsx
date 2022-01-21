// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import { FunctionComponent } from "react";
import Tuner from "./tuner/Tuner";

interface IDashboardProps {
  className?: string;
}

const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  return (
    <div className={"dashboard " + props.className ?? ""}>
      <Tuner />
    </div >
  );
}

export default Dashboard;
