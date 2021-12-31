import { forwardRef, FunctionComponent, useContext, useEffect, useState } from "react";
import SoundContext from "../../logic/SoundContext";
import { IDashboardComponentProps } from "./DshbComp";
import AudioManager from "../../logic/AudioManager";
import { roundNum } from "../../logic/util";
import { Note, NoteLiteral, ScaleType } from "@tonaljs/tonal";
import { Float32Buffer } from "../../logic/Float32Buffer";



interface PitchComponentProps extends IDashboardComponentProps {
  audioManager: AudioManager;
  audioActive: boolean;
}

const tunings: NoteLiteral[][] = [
  ["E2", "A2", "D3", "G3", "B3", "E4"]
];

const target_refresh_interval = 400;
const buffer_len = 10;
const NODE_NAME = "pitch";

// path relative to public directory
const workletProcessorPath = "workers/pitch-worklet-processor.js";

export async function createEssentiaNode(audioCtx: AudioContext) {
  try {
    console.log("registering worker");
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



function getClosestTuningNote(inputFreq: number, tuning: NoteLiteral[]) {
  let noteDists = tuning.map(t => {
    let note = Note.get(t);
    if (note && note.freq) {
      return Math.abs(note.freq - inputFreq);
    }
    return Number.MAX_SAFE_INTEGER;
  });

  let argmin = noteDists.indexOf(Math.min(...noteDists));
  return Note.get(tuning[argmin]);
}


const PitchComponent: FunctionComponent<PitchComponentProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    const [pitch, setPitch] = useState(-1);
    const [tuning, setTuning] = useState(tunings[0]);
    const [targetNote, setTargetNote] = useState(Note.get(tuning[0]));
    const [pitchBuffer, setPitchBuffer] = useState(new Float32Buffer(buffer_len));
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
    const [holdNote, setHoldNote] = useState(false);

    let { audioManager, audioActive } = props;

    const onWorkletMsg = (e: MessageEvent) => {
      try {
        let newPitch = Number.parseFloat(e.data);

        if (!isNaN(newPitch)) {
          setPitchBuffer((pitchBuffer) => {
            pitchBuffer.append([newPitch]);
            return pitchBuffer;
          });
        }
        setPitch(newPitch);

   
      } catch (e) {
        console.log("error in onWorkletMsg: " + e);
      }
    }

    // TODO: stop processor when not recording -- could just send msg to it

    // attach scriptprocessor node to audio context
    useEffect(() => {
      const addWorklet = async () => {
        try {
          // TODO: some bug when site gets restarted, node exists but worklet isn't executing
          if (audioManager.audioContext != null && !audioManager.nodeExists(NODE_NAME)) {
            console.log("creating node");
            const node = await createEssentiaNode(audioManager.audioContext);
            node.port.onmessage = onWorkletMsg;

            console.log("attaching node " + NODE_NAME);
            audioManager.addNode(node, NODE_NAME, { inputs: ["source"] });
            console.log("node attached");
          }
          console.log("node exists: " + audioManager.nodeExists(NODE_NAME));
          console.log("audio context: " + audioManager.audioContext);
        } catch (e) {
          console.log("error adding worklet node:" + e);
        }
      }

      console.log("effect called");
      addWorklet();
    }, [audioActive]);

    //TODO: refactor into state machine
    let hasPitch = audioActive && pitch >= 0;
    let isLoading = audioActive && pitch < 0;
    let hasError = audioActive && !hasPitch && !isLoading;

    let roundPitch;

    if (hasPitch) {
      roundPitch = roundNum(pitch, 1);
    }
    if (hasError) {
      if (!isNaN(pitch))
      console.log("PitchComp Error // pitch: " + pitch);
    }

    // only set new target notes every so often
    let refreshTarget = () => {
      setTargetNote(getClosestTuningNote(pitch, tuning));
      setHoldNote(true);
    };

    // TODO: runs twice b/c holdNote gets set. find out how to pass an updated pitch to the setInterval
    useEffect(() => {
      setHoldNote(false);
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (hasPitch) {
        const interval = setTimeout(() => refreshTarget(), target_refresh_interval);
        setIntervalId(interval);
      }
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    }, [holdNote, hasPitch]);


    return (
      <div {...props}
        style={{ ...style }}
        className={className + " tuner"}
        ref={ref as React.RefObject<HTMLDivElement>}>
        <h4>Tuner</h4>
        <br />

        <div style={{ textAlign: 'center' }}>
          {targetNote && tuning.map(note => {
            if (note == targetNote.name) {
              return <span style={hasPitch ? { color: "red" } : {}}>{note} </span>;
            }
            return <span>{note} </span>;
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          {(audioActive && !isLoading && targetNote) &&
            <div>
              Target: {roundNum(targetNote.freq!, 1)} Hz
              <br />
              You: {roundPitch} Hz {hasError || isNaN(pitch) && <span style={{ color: "red" }}>!</span>}
            </div>
          }
          {isLoading &&
            <div> Loading :{'>'} </div>
          }
          {!audioActive &&
            <div>
              Press Play!
            </div>
          }

        </div>
      </div>
    );
  });

export default PitchComponent;