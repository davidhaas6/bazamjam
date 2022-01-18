import { FunctionComponent } from 'react';
import "../assets/App.css";

import Dashboard from '../components/Dashboard';

import 'react-bootstrap'

interface IAppProps {

}

const App: FunctionComponent<IAppProps> = (_: IAppProps) => {
  return (
    <div className="App">

      <div className="box-body">
      <div className="button-section"></div>

        <div className="info-section">
          <Dashboard />
        </div>

        <div className="display-section"></div>

        

      </div>

    </div>
  );
}


export default App;
