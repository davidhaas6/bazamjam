import { forwardRef, FunctionComponent, useState } from "react";
import { Card } from "react-bootstrap";
import ReactPlayer from "react-player";
import MidiMouth from "../../routes/MidiMouth";
import AlertDismissable from "../AlertDismissable";
import MidiMouthForm from "../MidiMouthForm";
import { IDashboardComponentProps } from "./DshbComp";



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


export interface IMidiMProps extends IDashboardComponentProps {
}

const MidiM: FunctionComponent<IMidiMProps> = forwardRef(({ className, style = {}, children, ...props }, ref) => {
    const [outputSongUrl, setOutputSongUrl] = useState("");
    const [songCreationStatus, setSongCreationStatus] = useState(RequestStatus.None);

    let songUrl = outputSongUrl;
    console.log(ReactPlayer.canPlay(songUrl))
    
    return (
        
        <div
            {...props}
            style={{ ...style }}
            className={className + " midicomp"}
            ref={ref as React.RefObject<HTMLDivElement>}
        >
            <div className="midi-main">
                <h1 className="midi-header">Midi Mouth 🎶</h1>

                <MidiMouthForm apiRoot={API_URL} setOutputSong={setOutputSongUrl} />
                <hr />
                {outputSongUrl.length > 0 && (
                    <Card>
                        <Card.Header>
                            <h3>Your song is ready!</h3>
                        </Card.Header>
                        <Card.Body>
                            <a href={songUrl}> Direct Link </a>
                            <ReactPlayer url={songUrl} config={{ file: { forceAudio: true } }} controls={true}
                                height={50} width={300} />
                        </Card.Body>
                    </Card>
                )
                }
            </div>
        </div>
    );
});

export default MidiM;