import  { FunctionComponent } from 'react';
import "../assets/App.css";

import Dashboard from './Dashboard';
import Sidebar from './Sidebar';


interface IAppProps {
  
}
 
const App: FunctionComponent<IAppProps> = (props: IAppProps) => {
  return (
    <div className="App">
      <Sidebar />
      <Dashboard />
    </div>
  );
}


export default App;
