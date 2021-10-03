import { FunctionComponent } from "react";
import '../App.css'

interface DashboardProps {

}

const Dashboard: FunctionComponent<DashboardProps> = (props: DashboardProps) => {
  return (
    <div className="dashboard">
      <div className="header">TEST MESSAGE</div>
    </div>
  );
}

export default Dashboard;