// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { TiMediaStopOutline, TiNotesOutline } from "react-icons/ti";
import Essentia from "../essentia_api.d";
import { WorkletCallback } from "../logic/util/Worklet";
import { AudioManagerContext, PubSubContext } from "../routes/App";
import ControlButton from "./control-section/ControlButton";
import { ITonalData } from "./tuner/TonalDisplay";


// path relative to public directory
const WORKLET_PATH = "workers/main-algo-worklet.js";
// the name for both the worklet and audio node
const NODE_NAME = 'algo-processor';


enum DashState {
  INACTIVE,
  LOADING,
  ACTIVE,

  OTHER_ERR,
}

interface IDashboardProps {
  className?: string;
}

interface EssentiaMethod {
  
}


const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  let pubSub = useContext(PubSubContext);
  const audioManager = useContext(AudioManagerContext);

  const [audioActive, setAudioActive] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [dashState, setDashState] = useState(DashState.INACTIVE)
  // const [features, setFeatures] = useState<ITonalData>();

  useEffect(() => {
    console.log("dashboard subscripting to audio-active");
    pubSub.subscribe("audio-active", (active: boolean) => setAudioActive(active));
  }, [pubSub]);



  // create and attach the essentia node to audio context
  let isLoading = dashState === DashState.LOADING;
  useEffect(() => {
    if (audioActive && !audioManager.nodeExists(NODE_NAME)) {

      const onWorkletMsg: WorkletCallback = (e: MessageEvent) => {
        try {
          if(e.data != null) console.log(e.data)
          pubSub.publish('tuner-message', e);
          // setFeatures(() => e.data as ITonalData);
          setHasData(e.data != null);
        } catch (e) {
          console.log("error in onWorkletMsg: " + e);
        }
      }

      audioManager.addWorklet(NODE_NAME, WORKLET_PATH, onWorkletMsg);
    }
  }, [isLoading, audioActive, audioManager, pubSub]);

  switch (dashState) {
    case DashState.INACTIVE:
      if (audioActive) setDashState(DashState.LOADING);
      break;
    case DashState.LOADING:
      if (hasData) setDashState(DashState.ACTIVE);
      if (!audioActive) setDashState(DashState.INACTIVE);
      break;
    case DashState.ACTIVE:
      if (!audioActive) setDashState(DashState.INACTIVE);
      break;
    case DashState.OTHER_ERR:
    default:
      break;
  }

  /*
    Getting essentia properties
      - If you make Essentia from d.ts a class and make all the functions have empty bracketes, Object.getOwnPropertyNames will find them. But it doesn't give type info 
  */

  let columns: any[] = [];
  
  const methods = Object.getOwnPropertyDescriptors(Essentia.prototype);


  return (
    <div className="App"><div className="node-column">
      <ControlButton
        onPress={() => audioManager.startRecording()}
        onRelease={() => audioManager.stopRecording()}
        pressedChild={<TiMediaStopOutline size={50} />}
        notPressedChild={<TiNotesOutline size={50} />}
        releaseCondition={!audioActive}
      />
      {audioActive &&
        <Button onClick={() => {
          const workletNode = audioManager.nodes[NODE_NAME] as AudioWorkletNode;
          workletNode.port.postMessage("methods");
        }
        
        } className="height: 100px"/>}
    </div >

      <div className="node-column">
        k
        {columns}
        {/* <li>{essentia}</li> */}
      </div >
      <div className="node-column">
        asdfdffff
      </div >
      <div className="node-column">
        asdfdffff
      </div >
      <div className="node-column">
        asdfdffff
      </div >
      <div className="node-column">
        asdfdffff
      </div >
    </div >
  );
}

export default Dashboard;
