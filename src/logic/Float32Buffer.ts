

export class Float32Buffer {
    private _bufferSize: number;
    private _buffer: Float32Array;

    constructor(bufferSize: number) {
      this._bufferSize = bufferSize;
      this._buffer = new Float32Array(this._bufferSize);
    }
  
    get bufferSize() {
      return this._bufferSize;
    }
  
    get data() {
      return this._buffer;
    }

    get head() {
        return this._buffer[this._bufferSize-1];
    }
  
    append(data: ArrayLike<number>) {
      if (data.length > this._bufferSize) {
        throw new Error("data.length > this._bufferSize");
      }
  
      // this._buffer.set(this._buffer.slice(data.length), 0);
      // this._buffer.set(data, this._bufferSize - data.length);
  
      // shift the data in the buffer to the left to make room
      for (let i = data.length; i < this._bufferSize; i++) {
        this._buffer[i - data.length] = this._buffer[i];
      }
  
      // copy the new data to the end of the buffer
      let startIdx = this._bufferSize - data.length;
      for (let i = 0; i < data.length; i++) {
        this._buffer[startIdx + i] = data[i];
      }
    }
  
    clear() {
      for (let i = 0; i < this._bufferSize; i++) {
        this._buffer[i] = 0;
      }
    }
  
    allZero() {
      for (let i = 0; i < this._bufferSize; i++) {
        if (this._buffer[i] != 0) {
          return false;
        }
      }
      return true;
    }
  
    mean() {
      let sum = 0;
      for (let i = 0; i < this._bufferSize; i++) {
        sum += this._buffer[i];
      }
      return sum / this._bufferSize;
    }

    median() {
      let sorted = this._buffer.slice();
      sorted.sort();
      return sorted[Math.floor(sorted.length / 2)];
    }
   
  }