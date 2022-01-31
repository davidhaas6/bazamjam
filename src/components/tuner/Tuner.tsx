// a react component containing audio logic for a tuner

import { NoNote, Note as NoteType } from "@tonaljs/core";
import { Note, NoteLiteral } from "@tonaljs/tonal";
import { FunctionComponent, useEffect, useState } from "react";
import { freqToMidi } from "../../logic/util/Math";
import { ITonalData } from "./TonalDisplay";
import TunerDisplay from "./TunerDisplay";


export type INote = NoteType | NoNote;
export type Tuning = INote[];

const tuning_options: Tuning[] = filterValidTunings([
  ["E2", "A2", "D3", "G3", "B3", "E4"],
  ["E2123", "A2", "Daa3", "Gzyda3", "B94%3", "E4"],
]);

// how often we look for which note they're trying to tune to
const target_refresh_interval = 400;


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
  features: ITonalData;
}

const Tuner: FunctionComponent<ITunerProps> = (props: ITunerProps) => {
  // state
  const [pitch, setPitch] = useState(NaN);
  const [tuning, setTuning] = useState<Tuning>(tuning_options[0]);
  const [targetNote, setTargetNote] = useState<INote>(tuning[0]);
  const [targetRefreshFlag, setTargetRefreshFlag] = useState(false);


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
      <TunerDisplay pitch={pitch} targetNote={targetNote} tuning={tuning} />
    </div>
  );
}

export default Tuner;