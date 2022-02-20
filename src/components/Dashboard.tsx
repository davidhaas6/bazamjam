// dashboard that displays the contents of the functions
// functions display information to the user. for example,
// the results of an audio processing algorithm.

import { FunctionComponent, useContext, useEffect, useState } from "react";
import { WorkletCallback } from "../logic/util/Worklet";
import { AudioManagerContext, PubSubContext } from "../routes/App";
import InactiveDisplay from "./generic/InactiveDisplay";
import LoadingDisplay from "./generic/LoadingDisplay";
import TonalDisplay, { ITonalData } from "./tuner/TonalDisplay";

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
  const [features, setFeatures] = useState<ITonalData>();

  useEffect(() => {
    console.log("tuner subscripting to audio-active");
    pubSub.subscribe("audio-active", (active: boolean) => setAudioActive(active));
  }, [pubSub]);



  // create and attach the essentia node to audio context
  let isLoading = dashState === DashState.LOADING;
  useEffect(() => {
    if (audioActive && !audioManager.nodeExists(NODE_NAME)) {

      const onWorkletMsg: WorkletCallback = (e: MessageEvent) => {
        try {
          pubSub.publish('tuner-message', e);
          setFeatures(() => e.data as ITonalData);
          setHasData(e.data != null);
        } catch (e) {
          console.log("error in onWorkletMsg: " + e);
        }
      }

      audioManager.addWorklet(NODE_NAME, WORKLET_PATH, onWorkletMsg);
    }
  }, [isLoading, audioActive, audioManager, pubSub]);

  let content: JSX.Element;
  switch (dashState) {
    case DashState.INACTIVE:
      content = <InactiveDisplay />;

      if (audioActive) {
        setDashState(DashState.LOADING);
        console.log("setting state to loading");

      }
      break;
    case DashState.LOADING:
      content = <LoadingDisplay />;

      if (hasData) {
        setDashState(DashState.ACTIVE);
      }
      if (!audioActive) {
        setDashState(DashState.INACTIVE);
      }
      break;
    case DashState.ACTIVE:
      
        content = <TonalDisplay data={features} />;
      

      if (!audioActive) {
        setDashState(DashState.INACTIVE);
      }
      break;
    case DashState.OTHER_ERR:
    default:
      content = <div>error</div>;
      break;
  }


  return (
    <div className={"dashboard " + props.className ?? ""}>
      <div className="tuner">
        <div className="dash-header tuner-header">BazamJam</div>
        {content}
      </div>
    </div >
  );
}

export default Dashboard;
