import { FunctionComponent, useState } from "react";
import { Button, Card } from "react-bootstrap";
import ReactPlayer from "react-player";
import AlertDismissable from "../components/AlertDismissable";
import MidiMouthForm from "../components/MidiMouthForm";
import MMAudioPlayer from "../components/MMAudioPlayer";

interface MidiMouthProps {

}

enum RequestStatus {
    None,
    Submitted,
    Success,
    Error
}

const WELCOME_MESSAGE = "Make a song with your voice! Choose a sound clip, song, and go!";
const API_URL = "https://bazamjam.uc.r.appspot.com/";

function downloadSong(song: string) {
    const url = API_URL + "download_song?song_id=" + song;
    fetch(url);
    // window.open(url);
}

const MidiMouth: FunctionComponent<MidiMouthProps> = () => {
    const [outputSongUrl, setOutputSongUrl] = useState("");
    const [songCreationStatus, setSongCreationStatus] = useState(RequestStatus.None);

    let songUrl = outputSongUrl;
    console.log(ReactPlayer.canPlay(songUrl))
    return (
        <main className="midi-main">
            <h1 className="midi-header">Midi Mouth 🎶👄🎶</h1>
            <AlertDismissable
                header="Howdy!"
                message={WELCOME_MESSAGE}
            />
            <MidiMouthForm apiRoot={API_URL} setOutputSong={setOutputSongUrl} />
            <hr />
            {outputSongUrl.length > 0 && (
                <Card>
                    <Card.Header>
                        <h3>Your song is ready!</h3>
                    </Card.Header>
                    <Card.Body>
                        <ReactPlayer url={songUrl} config={{ file: { forceAudio: true } }} controls={true} 
                        height={50} width={300} />
                    </Card.Body>
                </Card>
            )
            }
        </main>
    );
}

export default MidiMouth;