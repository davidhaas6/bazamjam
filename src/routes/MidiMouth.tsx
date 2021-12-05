import Button from "@restart/ui/esm/Button";
import { FunctionComponent, useState } from "react";
import AlertDismissable from "../components/AlertDismissable";
import MidiMouthForm from "../components/MidiMouthForm";

interface MidiMouthProps {

}

enum RequestStatus {
    None,
    Submitted,
    Success,
    Error
}

const WELCOME_MESSAGE = "Midi Mouth lets you make songs with your voice! Choose a song, a sound clip, and go!";
const API_URL = "http://127.0.0.1:8000/";


const MidiMouth: FunctionComponent<MidiMouthProps> = () => {
    const [outputSongId, setOutputSongId] = useState("");
    const [songCreationStatus, setSongCreationStatus] = useState(RequestStatus.None);

    return (
        <main className="midi-main">
            <h1 className="midi-header">Midi Mouth 🎶👄🎶</h1>
            <AlertDismissable
                header="Howdy!"
                message={WELCOME_MESSAGE}
            />
            <MidiMouthForm apiRoot={API_URL} setOutputSong={setOutputSongId} />
            <hr />
            di
        </main>
    );
}

export default MidiMouth;