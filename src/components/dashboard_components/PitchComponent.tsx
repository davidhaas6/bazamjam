import { forwardRef, FunctionComponent, useContext, useEffect, useState } from "react";
import SoundContext from "../../logic/SoundContext";
import { IDashboardComponentProps } from "./DshbComp";
import AudioManager from "../../logic/AudioManager";
import { roundNum } from "../../logic/util";


interface PitchComponentProps extends IDashboardComponentProps {
  audioManager: AudioManager;
}

const NODE_NAME = "pitch";

// path relative to public directory
const workletProcessorPath = "workers/pitch-worklet-processor.js";

export async function createEssentiaNode(audioCtx: AudioContext) {
  try {
    /* 
    It's very likely you're getting the abort error due to invalid path or errors in the processing code
    https://stackoverflow.com/questions/49972336/audioworklet-error-domexception-the-user-aborted-a-request/51469624#51469624
    people say this stuff works:
     - serving from public server
     - serving from remot with Content-Type: application/javascript
     - the rms example project has a builder that integrates these things
    */
    // register the audio worker
    await audioCtx.audioWorklet.addModule(workletProcessorPath,
      { credentials: 'omit' }
    );
    console.log("await done");
  } catch (e) {
    console.log("error adding worklet module:" + e);
  }
  return new AudioWorkletNode(audioCtx, 'pitch-processor'); // instantiate our custom processor as an AudioWorkletNode
}



const PitchComponent: FunctionComponent<PitchComponentProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    const [pitch, setPitch] = useState(0);
    let { audioManager } = props;
    // console.log("refresh");

    const onWorkletMsg = (e: MessageEvent) => {
      // console.log(Number.parseFloat(e.data));
      try {
        setPitch(Number.parseFloat(e.data));
      } catch (e) {
        console.log("error in onWorkletMsg:" + e);
      }
    }

    // TODO: stop processor when not recording -- could just send msg to it
    // attach scriptprocessor node to audio context
    useEffect(() => {
      const addWorklet = async () => {
        try {
          if (audioManager.audioContext != null && !audioManager.nodeExists(NODE_NAME)) {
            console.log("creating node");
            const node = await createEssentiaNode(audioManager.audioContext);
            node.port.onmessage = onWorkletMsg;

            console.log("attaching node " + NODE_NAME);
            audioManager.addNode(node, NODE_NAME, { inputs: ["source"] });
            console.log("node attached");
          }
        } catch (e) {
          console.log("error adding worklet node:" + e);
        }
      }

      console.log("effect called");
      addWorklet();
    }, [props.audioManager.audioContext]);

    return (
      <div {...props}
        style={{ ...style }}
        className={className + " simple-component"}
        ref={ref as React.RefObject<HTMLDivElement>}>

        <div style={{ textAlign: 'center' }}>
          {roundNum(pitch, 1)} Hz
        </div>
      </div>
    );
  });

export default PitchComponent;