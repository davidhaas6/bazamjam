import  { FunctionComponent } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';

import 'react-bootstrap'

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
