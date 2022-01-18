import  { FunctionComponent } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';

import 'react-bootstrap'

interface IAppProps {
  
}
 
const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  return (
    <div className="App">
      {/* <Dashboard /> */}
    </div>
  );
}


export default App;
