import json from "../assets/essentia.json";

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

export interface EssentiaFx {
  name: string;
  header: string;
  desc: string;
  params: JsonParams | null;
  returnData: Return | null;
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
type OutputAdjMap<KeyType> = Map<KeyType, Set<KeyType>>;

export default class DirectedGraph<K, V extends Node<K>> {
  outputs: OutputAdjMap<K>;
  nodes: Map<K, V>;

  constructor() {
    this.outputs = new Map<K, Set<K>>();
    this.nodes = new Map<K, V>();
  }

  addNode(node: V, outputs?: Set<V> | V[]) {
    if (this.nodes.has(node.key)) {
      this.nodes.set(node.key, node);
      this.outputs.set(node.key, new Set());
    }

    if (outputs != null) {
      if (outputs instanceof Array) outputs = new Set(outputs);
      this.addOutputs(node.key, outputs);
      // if (this.outputs.has(node.key)) {
      //   outputs.forEach((outNode) => this.nodes.set(outNode.key, outNode)); // ensure outputs are tracked
      //   const keys = this.mergeSets<K>(this.outputs.get(node.key)!, this.getNodeArrKeys(outputs));
      //   this.outputs.set(node.key, keys);
      // } else {
      //   console.log("adding outputs for new node");
      //   this.outputs.set(node.key, this.getNodeArrKeys(outputs));
      // }
    }
  }

  addNodes(nodes: V[]) {
    nodes.forEach((node) => this.addNode(node));
  }


  addOutputs(srcNode: K, outputs: Set<K> | Set<V>): boolean {
    if (!this.nodes.has(srcNode)) return false;

    // normalize outputs
    if (outputs as Set<V>) {
      const outputNodes = outputs as Set<V>;
      outputNodes.forEach((outNode) => this.addNode(outNode))  // ensure output nodes are registered
      outputs = this.getNodeArrKeys(outputNodes);
    }
    const outputKeys: Set<K> = outputs as Set<K>;


    for (let newOutput of Array.from(outputKeys)) {
      if (this.nodes.has(newOutput) && this.outputs.get(srcNode) != null) {  // Only connect to existing nodes
        this.outputs.get(srcNode)!.add(newOutput);
      }
    }

    return true;
  }


  print() {
    console.log("NODES");
    console.log(this.nodes.keys())
    console.log("OUTPUTS");
    console.log(this.outputs)
    for (let srcNode of Array.from(this.outputs.keys())) {
      let str = "";
      this.outputs.get(srcNode)?.forEach((val) => str += val + ", ")
      console.log("  ", srcNode, "-->", str)
    }
  }

  private mergeSets<T>(set1: Set<T>, set2: Set<T>) {
    set1.forEach((val) => set2.add(val));
    return set2;
  }

  private getNodeArrKeys(arr: Iterable<V>): Set<K> {
    let keys = new Set<K>();
    for (const node of Array.from(arr)) {
      keys.add(node.key);
    }
    return keys;
  }
}

export type FunctionGraph = DirectedGraph<string, GraphNode>


/*
================
===========
   Essentia 
 ======================
 ======================================
*/



export function normalizeJsonArr(stringKeyedArr: JsonParamArray): ValueOf<JsonParamArray>[] {
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
  if (fx.returnData == null) return [];

  let nodes: ParamNode[] = [];
  const ret = fx.returnData as Return;

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

function _addFunction(graph: FunctionGraph, functions: EssentiaData, fxKey: keyof EssentiaData): FunctionGraph {
  // convert the EssentiaFx into a connected set of arg nodes, a function node, and return value nodes
  const fx = functions[fxKey];
  let fxNode: FxNode = { data: fx, key: fx.name };
  let paramNodes = fx.params != null ? createParameterNodes(fx) : [];
  let outNodes = fx.returnData != null ? createOutputNodes(fx) : [];

  // connect then nodes
  // console.log(paramNodes, outNodes)
  paramNodes.forEach((node) => graph.addNode(node, [fxNode]));
  graph.addNode(fxNode, outNodes);
  graph.addNodes(outNodes);
  return graph;
}


/*
================
===========
   External Helpers 
 ======================
 ======================================
*/



const data: EssentiaData = json;

export function addFunctionToGraph(graph: FunctionGraph, functionKey: string): FunctionGraph {
  if (data[functionKey] == null) throw new Error("Function not found");
  return _addFunction(graph, data, functionKey);
}

export function isValidFunction(functionKey: string) {
  return data[functionKey] != null;
}

export function getFunction(functionKey: string) {
  return data[functionKey];
}
