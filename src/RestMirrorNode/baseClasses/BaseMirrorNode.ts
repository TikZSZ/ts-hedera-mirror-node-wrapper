import { BaseMirrorClient } from "./BaseMirrorClient";

export abstract class BaseMirrorNode<D> {
  protected abstract url:string
  constructor(protected mirrorClient:BaseMirrorClient){}
  protected fetch = (url:string) =>{
    return this.mirrorClient.fetch<D>(url,{})
  }
  abstract get():Promise<D>
}

