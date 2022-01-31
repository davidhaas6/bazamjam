// a react component containing audio logic for a tuner

import { NoNote, Note as NoteType } from "@tonaljs/core";
import { Note, NoteLiteral } from "@tonaljs/tonal";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { freqToMidi } from "../../logic/util/Math";
import { WorkletCallback } from "../../logic/util/Worklet";
import { AudioManagerContext, PubSubContext } from "../../routes/App";
import InactiveDisplay from "../generic/InactiveDisplay";
import LoadingDisplay from "../generic/LoadingDisplay";
import TonalDisplay from "./TonalDisplay";
import TunerDisplay from "./TunerDisplay";



export interface ITonalData {
  chords_changes_rate: any,
  chords_histogram: any,
  chords_key: any,
  chords_number_rate: any,
  chords_progression: any,
  chords_scale: any,
  chords_strength: any,
  hpcp: any,
  hpcp_highres: any,
  key_key: any,
  key_scale: any,
  key_strength: any
}


enum TunerState {
  INACTIVE,
  LOADING,
  ACTIVE,

  OTHER_ERR,
}

export type INote = NoteType | NoNote;
export type Tuning = INote[];

const tuning_options: Tuning[] = filterValidTunings([
  ["E2", "A2", "D3", "G3", "B3", "E4"],
  ["E2123", "A2", "Daa3", "Gzyda3", "B94%3", "E4"],
]);

// how often we look for which note they're trying to tune to
const target_refresh_interval = 400;

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


interface ITunerProps {
}

const Tuner: FunctionComponent<ITunerProps> = (props: ITunerProps) => {
  let pubSub = useContext(PubSubContext);
  const audioManager = useContext(AudioManagerContext);

  // state
  const [pitch, setPitch] = useState(NaN);
  const [features, setFeatures] = useState<ITonalData>();

  const [tuning, setTuning] = useState<Tuning>(tuning_options[0]);
  const [audioActive, setAudioActive] = useState(false);
  const [targetNote, setTargetNote] = useState<INote>(tuning[0]);

  const [targetRefreshFlag, setTargetRefreshFlag] = useState(false);
  const [compState, setCompState] = useState(TunerState.INACTIVE);


  useEffect(() => {
    console.log("tuner subscripting to audio-active");
    pubSub.subscribe("audio-active", (active: boolean) => setAudioActive(active));
  }, [pubSub]);

  const onWorkletMsg: WorkletCallback = (e: MessageEvent) => {
    try {
      pubSub.publish('tuner-message', e);
      setFeatures(() => e.data as ITonalData);
      // if (e.data.chords_progression)
      //   console.log(e.data.chords_progression);

      // set pitch, could be NaN
      // let newPitch = Number.parseFloat(e.data);
      // setPitch(newPitch);
    } catch (e) {
      console.log("error in onWorkletMsg: " + e);
    }
  }



  // create and attach the essentia node to audio context
  useEffect(() => {
    if (audioActive && !audioManager.nodeExists(node_name)) {
      audioManager.addWorklet(node_name, worklet_processor_path, onWorkletMsg);
    }
  }, [compState === TunerState.LOADING, audioActive, audioManager, onWorkletMsg]);


  // FSM for component visual state
  let content: JSX.Element;
  switch (compState) {
    case TunerState.INACTIVE:
      content = <InactiveDisplay />;

      if (audioActive) {
        setCompState(TunerState.LOADING);
        console.log("setting state to loading");

      }
      break;
    case TunerState.LOADING:
      content = <LoadingDisplay />;

      if (features != null) {
        setCompState(TunerState.ACTIVE);
      }
      if (!audioActive) {
        setCompState(TunerState.INACTIVE);
      }
      break;
    case TunerState.ACTIVE:
      content = <div />;
      if (features != null) {
        content = <TonalDisplay data={features} />;
      } else if (!isNaN(pitch)) {
        content = <TunerDisplay pitch={pitch} targetNote={targetNote} tuning={tuning} />;
      }

      if (!audioActive) {
        setCompState(TunerState.INACTIVE);
      }
      break;
    case TunerState.OTHER_ERR:
    default:
      content = <div>error</div>;
      break;
  }

  // update target note every target_refresh_interval
  useEffect(() => {
    if (!isNaN(pitch)) {
      const timer = setTimeout(() => {
        setTargetNote(getClosestTuningNote(pitch, tuning));
        setTargetRefreshFlag(flag => !flag);
      }, target_refresh_interval);

      return () => { clearTimeout(timer) }
    }

  }, [targetRefreshFlag, tuning, isNaN(pitch)]);


  // rendur tuner and children
  return (
    <div className="tuner">
      <div className="dash-header tuner-header">Tuner</div>
      {content}
    </div>
  );
}

export default Tuner;