import * as json from "../assets/essentia.json";

type ValueOf<T> = T[keyof T];

/*
  JSON Parsing
*/

interface JsonArr {
  [index: string]: string
}


interface JsonParamArray {
  [index: string]: string | number | null;
}

interface JsonParams {
  // [index: string]: ParamArray
  "Name": JsonParamArray
  "Type": JsonParamArray
  "Attributes"?: JsonParamArray
  "Default"?: JsonParamArray
  "Description": JsonParamArray
}

interface Return {
  "type": string
  "val": string | JsonArr
}

interface EssentiaFx {
  name: string;
  header: string;
  desc: string;
  params: JsonParams | null;
  return: Return | null;
}

interface EssentiaData {
  [index: string]: EssentiaFx
}

/*
 Graph stuff
*/

interface Node<T> {
  key: T
  // outputs?: T[]
  // inputs?: T[]
}

interface ParamNode extends Node<string> {
  paramName: string
  funcName: string
  description: string
  isOutput: boolean;
  paramType?: string
  defaultVal?: number | string | null
  attributes?: string
}

interface FxNode extends Node<string> {
  data: EssentiaFx
}

interface GraphInterface {
  [index: string]: Node<string> | ParamNode | FxNode
}

export type GraphNode = Node<string> | ParamNode | FxNode;
type OutputAdjMap = Map<GraphNode, Set<GraphNode>>;

export default class DirectedGraph {
  outputs: OutputAdjMap;
  nodes: Map<string, GraphNode>;
  constructor() {
    this.outputs = new Map<GraphNode, Set<GraphNode>>();
    this.nodes = new Map<string, GraphNode>();
  }

  addNode(node: GraphNode, outputs?: Set<GraphNode> | GraphNode[]) {
    this.nodes.set(node.key, node);

    if (outputs != null) {
      if (outputs instanceof Array) outputs = new Set(outputs);
      if (this.outputs.has(node)) {
        outputs.forEach((outNode) => this.addNode(outNode)); // ensure outputs are tracked
        this.outputs.set(node, this.mergeSets<GraphNode>(this.outputs.get(node)!, outputs))
      } else {
        this.outputs.set(node, outputs)
      }
    }
  }

  addNodes(nodes: GraphNode[], outputs?: OutputAdjMap) {
    nodes.forEach((node) => this.addNode(node, outputs != null ? outputs.get(node) : undefined));
  }

  connect(src: GraphNode | string, dst: GraphNode | string): boolean {
    let srcNode: GraphNode;
    let dstNode: GraphNode;

    // get nodes from strings

    if (src as string) {
      if (!this.nodes.has(dst as string)) return false;
      srcNode = this.nodes.get(src as string) as GraphNode;
    } else {
      srcNode = src as GraphNode;
    }
    if (dst as string) {
      if (!this.nodes.has(dst as string)) return false;
      dstNode = this.nodes.get(dst as string) as GraphNode;
    } else {
      dstNode = dst as GraphNode;
    }

    this.addNode(srcNode, [dstNode]);
    return true;
  }



  print() {
    console.log("NODES");
    console.log(this.nodes.keys())
    console.log("OUTPUTS");
    for (let srcNode of Array.from(this.outputs.keys())) {
      let str = "";
      this.outputs.get(srcNode)?.forEach((val) => str += val.key + ", ")
      console.log("  ", srcNode.key, "-->", str)
    }
  }


  private mergeSets<T>(set1: Set<T>, set2: Set<T>) {
    set1.forEach((val) => set2.add(val));
    return set2;
  }
}

/*
================
===========
   Essentia 
 ======================
 ======================================
*/



function normalizeJsonArr(stringKeyedArr: JsonParamArray): ValueOf<JsonParamArray>[] {
  let arr = [];
  for (let i in stringKeyedArr) {
    arr.push(stringKeyedArr[i])
  }
  return arr;
}

function createParameterNodes(fx: EssentiaFx): ParamNode[] {
  if (fx.params == null) return [];

  let nodes: ParamNode[] = [];
  const params = fx.params as JsonParams;
  const num_params = normalizeJsonArr(params.Name).length;

  for (let i = 0; i < num_params; i++) {
    let node: ParamNode = {
      paramName: params.Name[i] as string,
      paramType: params.Type[i] as string,
      description: params.Description[i] as string,
      funcName: fx.name,
      key: fx.name + "_" + params.Name[i] as string,
      isOutput: false,
    }
    if (params.Default != null) {
      node.defaultVal = params.Default[i];
    }
    if (params.Attributes != null) {
      node.attributes = params.Attributes[i] as string;
    }
    nodes.push(node)
  }
  return nodes;
}

function createOutputNodes(fx: EssentiaFx): ParamNode[] {
  if (fx.return == null) return [];

  let nodes: ParamNode[] = [];
  const ret = fx.return as Return;

  if (ret.type === 'object' && ret.val as JsonArr) {
    const values = ret.val as JsonArr;
    // go thru each output in the vals dict
    for (let name of Object.getOwnPropertyNames(values)) {
      nodes.push({
        funcName: fx.name,
        paramName: name,
        description: values[name],
        key: fx.name + "_" + name,
        isOutput: true,
      });
    }
  }
  else if (ret.val as string) {
    nodes.push({
      funcName: fx.name,
      paramName: ret.type,
      paramType: ret.type,
      description: ret.val as string,
      key: fx.name + "_" + ret.type,
      isOutput: true,
    })
  }
  return nodes;
}

function _addFunction(graph: DirectedGraph, functions: EssentiaData, fxKey: keyof EssentiaData): DirectedGraph {
  // convert the EssentiaFx into a connected set of arg nodes, a function node, and return value nodes
  const fx = functions[fxKey];
  let fxNode: FxNode = { data: fx, key: fx.name };
  let paramNodes = fx.params != null ? createParameterNodes(fx) : [];
  let outNodes = fx.return != null ? createOutputNodes(fx) : [];

  // connect then nodes
  // console.log(paramNodes, outNodes)
  paramNodes.forEach((node) => graph.addNode(node, new Set([fxNode])));
  graph.addNode(fxNode, new Set(outNodes));
  graph.addNodes(outNodes);
  return graph;
}


const data: EssentiaData = json;

export function addFunction(graph: DirectedGraph, functionKey: string) {
  if(data[functionKey] == null) return false;
  _addFunction(graph, data, functionKey)
  return true;
}

export function isValidFunction(fxname: string) {

}
/*
 Main
*/

// // if (data['BPF']['params'] != null) console.log(data['BPF']['params']['Name'])
// const fx: EssentiaFx = data['BPF'];


// // let g = addFunctionNodes(new DirectedGraph, data, 'getAudioBufferFromURL');
// // let graph = addFunctionNodes(g, data, 'BFCC');
// // graph.connect("getAudioBufferFromURL_AudioBuffer", 'BFCC_spectrum')
// // graph.print()
// console.log(data['BPF'])
// // add