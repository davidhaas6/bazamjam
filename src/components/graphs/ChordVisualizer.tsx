import React from "react";
import { Col, Row } from "react-bootstrap";
import { Interval, Note, Scale } from "@tonaljs/tonal";


interface IChordAnalyzerProps {
  freqData: Float32Array, // bin magnitudes
  fs: number, // sampling rate
  binCount: number, // amt of bins
  width: number,
  height: number
}

interface IChordAnalyzerState {

}

class ChordAnalyzer extends React.Component<IChordAnalyzerProps, IChordAnalyzerState> {
  //state = {  : }

  get binWidth() {
    return this.props.fs / (2 * this.props.binCount);
  }

  constructor(props: IChordAnalyzerProps) {
    super(props);
  }
  componentDidUpdate() {
    this.update();
  }

  update() {

    this.render();
  }

  rollingMax(sourceArr: Float32Array, numMax: number): Array<Array<number>> {
    // Arrays of 'num' loudest frequencies, and their magnitudes
    // sorted from least to most loud
    const fillVal = -Infinity;
    let maxVals = Array<number>(numMax).fill(fillVal);
    let maxValIdxs = Array<number>(numMax).fill(fillVal);

    for (let curValIdx = 0; curValIdx < sourceArr.length; curValIdx++) {
      const curVal = sourceArr[curValIdx];

      // go through the max value array from largest to smallest,
      // searching for a value that curVal is larger than. Once it finds
      // that value, it inserts curval at that position and moves all the other
      // values one down, erasing element 0.
      for (let j = maxVals.length - 1; j >= 0; j--) {
        let maxVal: number = maxVals[j];

        if (curVal > maxVal) {
          // Move each element down an index, removing maxVals[0]
          for (let k = 0; k < j; k++) {
            maxVals[k] = maxVals[k + 1];
            maxValIdxs[k] = maxValIdxs[k + 1];
          }

          // insert the current value into the max array
          maxVals[j] = curVal;
          maxValIdxs[j] = curValIdx;

          break;
        }
      }
    }

    return [maxVals, maxValIdxs];
  }

  getLargestNotes(num = 3): Array<number> {
    const [maxBinMagnitudes, maxBins] = this.rollingMax(this.props.freqData, num);

    // convert the bin indexes to their middle frequency
    let binFreqs = maxBins.map(
      (bin) => bin * this.binWidth + this.binWidth / 2
    );

    // console.log(this.props.freqData);

    return binFreqs;
  }


  render() {
    let topFreqs = this.getLargestNotes(2).reverse();

    return (
      <div>
        <Row>
          <Col>
            {
              topFreqs.map((note) => (
                <p>{note.toFixed(2)}</p>
              ))
            }
            <p>Bin width: {this.binWidth}</p>
          </Col>
          <Col>
            {topFreqs.map((f) => <p>{Note.fromFreq(f)}</p>)}
          </Col>
        </Row>

      </div>
    );
  }
}


export default ChordAnalyzer;