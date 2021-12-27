#!/usr/bin/node
import { Float32Buffer } from "../../public/workers/buffer.js"


// test the buffer array to make sure it works
test('basic append works', () => {
  let buffer = new Float32Buffer(10);
  buffer.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(buffer.data).toEqual(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
});

// make sure append shifts data propperly
test('shift append', () => {
  let buffer = new Float32Buffer(10);
  buffer.append(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  buffer.append(new Float32Array([20, 21, 22, 23]));
  buffer.append([34]);
  console.log(buffer.data);
  expect(buffer.data).toEqual(new Float32Array([ 6, 7, 8, 9, 10, 20, 21, 22, 23, 34]));
});


