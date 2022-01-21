import {  FunctionComponent, useState } from "react";
import { Card } from "react-bootstrap";
import ReactPlayer from "react-player";
import MidiMouthForm from "./MidiMouthForm";



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


export interface IMidiMProps {}

const MidiM: FunctionComponent<IMidiMProps> = (props: IMidiMProps) => {
  const [outputSongUrl, setOutputSongUrl] = useState("");
  const [songCreationStatus, setSongCreationStatus] = useState(RequestStatus.None);

  let songUrl = outputSongUrl;

  return (

    <div className="midi-main midicomp">
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

  );
}

export default MidiM;