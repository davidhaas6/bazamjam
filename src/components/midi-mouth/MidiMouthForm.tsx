import { FunctionComponent, useEffect, useState } from "react";
import { Accordion, Button, Card, Form, FormControl, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import AlertDismissable from "../generic/AlertDismissable";

interface MidiMouthFormProps {
  apiRoot: string;
  setOutputSong: (outputSongURL: string) => void;
}


function formatName(name: string, id: string, prefix?: string): string {
  name = name.trim();
  if (name.length === 0) {
    name = id;
    if (prefix) {
      name = prefix + " " + name;
    }
  }
  return name;
}

const renderTooltip = (text: string, options: any) => (
  <Tooltip id="button-tooltip" {...options}>
    Simple tooltip
  </Tooltip>
);

const MidiMouthForm: FunctionComponent<MidiMouthFormProps> = (props: MidiMouthFormProps) => {
  const [sourceSongs, setSourceSongs] = useState<Object>();
  const [instruments, setInstruments] = useState<Object>();

  const [songChoice, setSongChoice] = useState<string>();
  const [instrumentChoice, setInstrumentChoice] = useState<string>();
  const [userSoundFile, setUserSoundFile] = useState<any>()
  const [keyShift, setKeyShift] = useState<number>(0);
  const [allTracksChoice, setAllTracksChoice] = useState<boolean>();

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // let ifSongChosenProps = {'d'}
  let allInstrumentsTitle = "All Instruments";
  let allInstrumentsKey = "-1"
  let allowInstruments: boolean = songChoice != null && instruments != null;
  let allInstrsSelected = instrumentChoice == "";

  let songOptions, instrumentOptions;

  if (sourceSongs) {
    let entries = Object.entries(sourceSongs!);
    songOptions = entries.map(
      ([songId, songName]) => <option value={songId}>{formatName(songName, songId, "Song")}</option>
    );
  }
  if (instruments) {
    let entries = Object.entries(instruments!);
    instrumentOptions = entries.map(
      ([instrId, instrName]) => <option value={instrId}>{formatName(instrName, instrId, "Instrument")}</option>);
  }


  // Load song options
  useEffect(() => {
    fetch(props.apiRoot + "get_songs")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setSourceSongs(result);
        },
        (error) => {
          console.log(error);
          setErrMsg(error.message);
        }
      );
  }, []);

  // Load instrument options
  useEffect(() => {
    if (songChoice == null || sourceSongs == null) return;
    // reset instrument selection
    setInstrumentChoice(allInstrumentsKey);

    // get new instruments
    // console.log("Fetching instruments for: " + sourceSongs[songChoice]);
    fetch(props.apiRoot + "get_instruments?song_id=" + songChoice)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setInstruments(result);
        },
        (error) => {
          console.log(error);
          setErrMsg(error.message);
        }
      );
  }, [songChoice]);

  // Send song generation request
  async function sendSongRequest() {
    var formData = new FormData();
    formData.append('user_sample', userSoundFile);
    console.log("formdata: ", Array.from(formData.keys()));

    let params:{ [key: string]: string  }= {
      "song_id": songChoice!,
      "instrument_num": instrumentChoice!,
      "key_shift": keyShift.toString(),
      "all_tracks": String(instrumentChoice == allInstrumentsKey)
    };

    setLoading(true);
    let paramString = Object.keys(params).map(key => key + "=" + String(params[key])).join("&");
    let queryString = props.apiRoot + "create_song" + "?" + paramString;
    console.log("fetching: " + queryString);
    fetch(queryString, {
      method: "POST",
      body: formData,
      headers: {
        accept: "application/json",
        // "Content-Type": "multipart/form-data"
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          props.setOutputSong(result['song'])
        },
        (error) => {
          console.log(error);
          setErrMsg(error.message);
        }
      ).then(() => { setLoading(false); });
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("submitting");
    if (!userSoundFile) {
      setErrMsg("Please select a sound file.");
      console.log("no file selected");
      return;
    } else {
      console.log("file: " + userSoundFile);
    }
    sendSongRequest();
  }


  return (
    <div className="midi-form">
      <Form onSubmit={handleSubmit}>
        {errMsg.length > 0 && <AlertDismissable message={errMsg} variant="danger" header="Error" />}

        {/* input sound */}
        <InputGroup className="mb-3">
          <InputGroup.Text>🎤</InputGroup.Text>
          <Form.Control type="file" size="lg" accept=".wav"
            onChange={(e:any) => setUserSoundFile(e.target?.files[0])} />
        </InputGroup>


        {/* song selection */}
        <InputGroup className="mb-3">
          <InputGroup.Text>🎼</InputGroup.Text>
          <Form.Select size="lg" onChange={(event: any) => setSongChoice(event.target.value)}>
            <option disabled={true} selected={!songChoice}>Select a song</option>
            {songOptions}
          </Form.Select>
        </InputGroup>

        {/* instrument selection */}
        <InputGroup className="mb-3"  >
          <InputGroup.Text>🎷</InputGroup.Text>
          <Form.Select size="lg"
            value={instrumentChoice}
            disabled={songChoice == null}
            onChange={(event: any) => setInstrumentChoice(event.target.value)
            }
          >
            {allowInstruments && (
              <option value={allInstrumentsKey}>{allInstrumentsTitle}</option>
            )}
            {allowInstruments ?
              instrumentOptions
              : <option>Must select a song</option>}
          </Form.Select>
        </InputGroup>

        {/* advanced options */}
        <Accordion className="mb-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Other Options</Accordion.Header>
            <Accordion.Body className="midi-advanced-options">

              {/* key shift */}
              <InputGroup className="mb-3" onChange={(evt: any) => setKeyShift(evt.target.value)} >
                <InputGroup.Text>Note Shift</InputGroup.Text>
                <Form.Control type="number" placeholder="0" />
              </InputGroup>

              {/* key shift */}
              <InputGroup className="mb-3"  >
                <Form.Check label="Include drums" />
              </InputGroup>

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* submit button */}
        <div className="mb-3 text-center" >
          <Button variant="success" size="lg" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Create Song"}
          </Button>
        </div>

      </Form >
    </div >
  );
}
//  👄
export default MidiMouthForm;