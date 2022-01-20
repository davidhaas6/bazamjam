// a set of business logic functions pertaining to worklets and multithreading

export type WorkletCallback = ((this: MessagePort, ev: MessageEvent<any>) => any);


// returns an AudioNode linked to an worklet processing function
// the function path is relative to the public directory and is 
// specified in the workletProcessorPath variable
export async function createEssentiaNode(
  audioCtx: AudioContext,
  workletJsPath: string,
  nodeName: string
): Promise<AudioWorkletNode> {
  try {
    // register the audio worker
    console.log("registering worker");
    await audioCtx.audioWorklet.addModule(workletJsPath, { credentials: 'omit' });
  } catch (e) {
    console.log("error adding worklet module:" + e);
  }

  // instantiate our custom processor as an AudioWorkletNode
  return new AudioWorkletNode(audioCtx, nodeName);
}
