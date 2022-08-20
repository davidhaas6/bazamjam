// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { TiMediaStopOutline, TiNotesOutline } from "react-icons/ti";
import DirectedGraph, { addFunctionToGraph, GraphNode, FunctionGraph } from "../logic/network";
import { WorkletCallback } from "../logic/util/Worklet";
import { AudioManagerContext, PubSubContext } from "../routes/App";
import ControlButton from "./control-section/ControlButton";
import FxNodeInput from "./FxNodeInput";


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


const Dashboard: FunctionComponent<IDashboardProps> = (props: IDashboardProps) => {
  let pubSub = useContext(PubSubContext);
  const audioManager = useContext(AudioManagerContext);

  const [audioActive, setAudioActive] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [dashState, setDashState] = useState(DashState.INACTIVE)
  const [graph, setGraph] = useState(new DirectedGraph<string, GraphNode>());
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
          if (e.data != null) console.log(e.data)
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


  /*
    Getting essentia properties
      - If you make Essentia from d.ts a class and make all the functions have empty bracketes, Object.getOwnPropertyNames will find them. But it doesn't give type info 
  */

  // useEffect(() => {
  //   graph.print()
  
  //   return () => {
      
  //   }
  // }, [graph])
  


  return (
    <div className="App">
      <div className="node-column">
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
          }} className="height: 100px" />
        }
      </div >

      <div className="node-column">
        {/* addNode={(node: GraphNode) => graph.addNode(node)} */}
        <FxNodeInput addFunction={(fxKey) => {
          addFunctionToGraph(graph, fxKey).print();
          setGraph(() => addFunctionToGraph(graph, fxKey))
        }} />
        {/* <li>{essentia}</li> */}
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
