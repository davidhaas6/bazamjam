import Button from "@restart/ui/esm/Button";
import { FunctionComponent, useState } from "react";
import AlertDismissable from "../components/AlertDismissable";
import MidiMouthForm from "../components/MidiMouthForm";

interface MidiMouthProps {

}

const WELCOME_MESSAGE = "Midi Mouth lets you make songs with your voice! Choose a song, a sound clip, and go!";

const MidiMouth: FunctionComponent<MidiMouthProps> = () => {
    const [outputSongId, setOutputSongId] = useState("");

    return (
        <main className="midi-main">
            <h1 className="midi-header">Midi Mouth 🎶👄🎶</h1>
            <AlertDismissable
                header="Howdy!"
                message={WELCOME_MESSAGE}
                center={false}
            />
            <MidiMouthForm setOutputSong={setOutputSongId} />
        </main>
    );
}

export default MidiMouth;