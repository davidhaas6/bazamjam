// a react component representing a tuner

import { Note, NoteLiteral } from "@tonaljs/tonal";
import { forwardRef, FunctionComponent, useEffect, useState } from "react";

import AudioManager from "../../../logic/AudioManager";
import { Float32Buffer } from "../../../logic/Float32Buffer";
import { roundNum } from "../../../logic/util/Math";
import { WorkletCallback } from "../../../logic/util/Worklet";
import { IDashboardComponentProps } from "../DshbComp";

enum TunerState {
  NOT_STARTED,
  LOADING,
  ACTIVE,

  ACTIVE_ERR,
  OTHER_ERR,
}

const tunings: NoteLiteral[][] = [
  ["E2", "A2", "D3", "G3", "B3", "E4"]
];

// how often we look for which note they're trying to tune to
const target_refresh_interval = 400; 
const pitch_buffer_len = 10;

// path relative to public directory
const worklet_processor_path = "workers/pitch-worklet-processor.js";
// the name for both the worklet and audio node
const node_name = 'pitch-processor'; 


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


interface ITunerProps extends IDashboardComponentProps {
  audioManager: AudioManager;
  audioActive: boolean;
}

const Tuner: FunctionComponent<ITunerProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    const [pitch, setPitch] = useState(NaN);
    const [tuning, setTuning] = useState(tunings[0]);
    const [targetNote, setTargetNote] = useState(Note.get(tuning[0]));
    const [pitchBuffer, setPitchBuffer] = useState(new Float32Buffer(pitch_buffer_len));
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
    const [holdNote, setHoldNote] = useState(false);
    const [compState, setCompState] = useState(TunerState.NOT_STARTED);

    let { audioManager, audioActive } = props;
 
    const onWorkletMsg: WorkletCallback = (e: MessageEvent) => {
      try {
        // set pitch, could be NaN
        let newPitch = Number.parseFloat(e.data);
        setPitch(newPitch);

        // update pitch buffer
        if (!isNaN(newPitch)) {
          setPitchBuffer((pitchBuffer) => {
            pitchBuffer.append([newPitch]);
            return pitchBuffer;
          });
        }
      } catch (e) {
        console.log("error in onWorkletMsg: " + e);
      }
    }

    // TODO: stop processor when not recording -- could just send msg to it
    // create and attach the essentia node to audio context
    useEffect(() => {
      audioManager.addWorklet(node_name, worklet_processor_path, onWorkletMsg);
    }, [audioActive]);


    let hasPitch = !isNaN(pitch);

    switch(compState) {
      case TunerState.NOT_STARTED:
        if (audioActive) {
          setCompState(TunerState.LOADING);
        }
        break;
      case TunerState.LOADING:
        if(hasPitch) {
          setCompState(TunerState.ACTIVE);
        }
        break;
      case TunerState.ACTIVE:
        if(isNaN(pitch)) {
          setCompState(TunerState.ACTIVE_ERR);
        }
        break;
      case TunerState.ACTIVE_ERR:
        if(!isNaN(pitch)) {
          setCompState(TunerState.ACTIVE);
        }
        break;
      case TunerState.OTHER_ERR:
        break;
      default:
        break;
    }



    //TODO: refactor into state machine
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

export default Tuner;