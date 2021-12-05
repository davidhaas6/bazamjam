import { FunctionComponent, useState } from "react";
import { Accordion, Button, Card, Form, FormControl, InputGroup } from "react-bootstrap";

interface MidiMouthFormProps {
  setOutputSong: (outputSongId: string) => void;
}

const MidiMouthForm: FunctionComponent<MidiMouthFormProps> = (props: MidiMouthFormProps) => {
  const [sourceSongs, setSourceSongs] = useState([]);
  const [songChoice, setSongChoice] = useState();
  const [instruments, setInstruments] = useState([]);
  const [instrumentChoice, setInstrumentChoice] = useState();
  const [keyShift, setKeyShift] = useState(0);
  const [allTracksChoice, setAllTracksChoice] = useState();

  // let ifSongChosenProps = {'d'}
  let allInstrumentsKey = "All Instruments";
  let allowInstruments: boolean = songChoice != null && instruments.length > 0;

  return (
    <div className="midi-form">
      <Form>
          {/* input sound */}
          <InputGroup className="mb-3">
          <InputGroup.Text>🎤</InputGroup.Text>
          <Form.Control type="file" size="lg" />
        </InputGroup>
        {/* <InputGroup className="mb-3" >
        <InputGroup.Text>🎤</InputGroup.Text>
          <Button variant="outline-secondary" id="button-addon1">
            Select a sound
          </Button>
          <Form.Control type="text" placeholder="" disabled/>
        </InputGroup> */}


        {/* song selection */}
        <InputGroup className="mb-3">
          <InputGroup.Text>🎼</InputGroup.Text>
          <Form.Select size="lg">
            <option>Select a song</option>
            {sourceSongs.map((song) => <option>song</option>)}
            {/* sourceSongs.map((o) => <option>o </option>); */}
          </Form.Select>
        </InputGroup>

        {/* instrument selection */}
        <InputGroup className="mb-3"  >
          <InputGroup.Text>🎷</InputGroup.Text>
          <Form.Select size="lg" disabled={songChoice == null}>
            {allowInstruments && (<option>{allInstrumentsKey}</option>)}
            {allowInstruments ?
              instruments.map((instr) => <option>instr</option>)
              : <option>No song selected</option>}
          </Form.Select>
        </InputGroup>

      
        {/* advanced options */}
        <Accordion className="mb-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Other Options</Accordion.Header>
            <Accordion.Body className="midi-advanced-options">

              {/* key shift */}
              <InputGroup className="mb-3"  >
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
          <Button variant="success" size="lg">
            Create Song 👄
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default MidiMouthForm;