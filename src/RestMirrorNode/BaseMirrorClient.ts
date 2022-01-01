import { BasicParams } from "./BasicParams";

export interface Params extends Partial<BasicParams>{
  [key:string]:any
}

export interface BaseMirrorClient{
  baseURL:string
  fetch<D=any>(baseURL:string,params:Params):Promise<D>
}

