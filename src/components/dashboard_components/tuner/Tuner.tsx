// a react component representing a tuner

import { Note as NoteType, NoNote } from "@tonaljs/core";
import { Note, NoteLiteral } from "@tonaljs/tonal";
import { forwardRef, FunctionComponent, useEffect, useState } from "react";

import AudioManager from "../../../logic/AudioManager";
import { Float32Buffer } from "../../../logic/Float32Buffer";
import { freqToMidi, roundNum } from "../../../logic/util/Math";
import { WorkletCallback } from "../../../logic/util/Worklet";
import { IDashboardComponentProps } from "../DshbComp";


enum TunerState {
  NOT_STARTED,
  LOADING,
  ACTIVE,

  NAN_PITCH,
  OTHER_ERR,
}

type INote = NoteType | NoNote;
type Tuning = INote[];

const tuning_options: Tuning[] = filterValidTunings([
  ["E2", "A2", "D3", "G3", "B3", "E4"],
  ["E2123", "A2", "Daa3", "Gzyda3", "B94%3", "E4"],
]);

// how often we look for which note they're trying to tune to
const target_refresh_interval = 400;
const pitch_buffer_len = 10;

// path relative to public directory
const worklet_processor_path = "workers/pitch-worklet-processor.js";
// the name for both the worklet and audio node
const node_name = 'pitch-processor';


// given the users pitch, find the closest note in the tuning
function getClosestTuningNote(inputFreq: number, tuning: Tuning): INote {
  // the distance between the users pitch and the notes in the tuning
  // currently, it's using semitones via midi numbers
  let noteDists = tuning.map(note => {
    if (note.midi != null) {
      return Math.abs(note.midi - freqToMidi(inputFreq));
    }
    return Number.MAX_SAFE_INTEGER;
  });

  // return the note in the tuning that is closest to the input
  let argmin = noteDists.indexOf(Math.min(...noteDists));
  return Note.get(tuning[argmin]);
}

function filterValidTunings(tunings: NoteLiteral[][]): Tuning[] {
  let noteTunings: Tuning[] = [];

  for (let i = 0; i < tunings.length; i++) {
    let notes = tunings[i].map(Note.get);
    if (notes.every(note => !note.empty)) {
      noteTunings.push(notes as Tuning);
    }
  }

  return noteTunings;
}


interface ITunerProps extends IDashboardComponentProps {
  audioManager: AudioManager;
  audioActive: boolean;
}

const Tuner: FunctionComponent<ITunerProps>
  = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    const [pitch, setPitch] = useState(NaN);
    const [pitchBuffer, setPitchBuffer] = useState(new Float32Buffer(pitch_buffer_len));

    const [tuning, setTuning] = useState<Tuning>(tuning_options[0]);
    const [targetNote, setTargetNote] = useState<INote>(tuning[0]);

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
    let roundPitch;

    switch (compState) {
      case TunerState.NOT_STARTED:
        if (audioActive) {
          setCompState(TunerState.LOADING);
        }
        break;
      case TunerState.LOADING:
        if (hasPitch) {
          setCompState(TunerState.ACTIVE);
        }
        break;
      case TunerState.ACTIVE:
        if (isNaN(pitch)) {
          setCompState(TunerState.NAN_PITCH);
        } else {
          roundPitch = roundNum(pitch, 1);
        }
        break;
      case TunerState.NAN_PITCH:
        if (!isNaN(pitch)) {
          setCompState(TunerState.ACTIVE);
        }
        break;
      case TunerState.OTHER_ERR:
        break;
      default:
        break;
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
          {!targetNote.empty && tuning.map(note => {
            if (note.name == targetNote.name) {
              return <span style={hasPitch ? { color: "red" } : {}}>{note.name} </span>;
            }
            return <span>{note.name} </span>;
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          {(compState === TunerState.ACTIVE || compState === TunerState.NAN_PITCH) &&
            <div>
              Target: {roundNum(targetNote.freq!, 1)} Hz
              <br />
              You: {roundPitch} Hz
              {compState === TunerState.NAN_PITCH &&
                <span style={{ color: "red" }}>!</span>
              }
            </div>
          }
          {compState === TunerState.LOADING &&
            <div> Loading :{'>'} </div>
          }
          {compState === TunerState.NOT_STARTED &&
            <div>
              Press Play!
            </div>
          }

        </div>
      </div>
    );
  });

export default Tuner;