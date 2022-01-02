import { BaseMirrorClient } from "./BaseMirrorClient";

export abstract class BaseMirrorNode<D> {
  constructor(protected mirrorClient:BaseMirrorClient,protected url:string){}
  protected fetch = () =>{
    return this.mirrorClient.fetch<D>(this.url,{})
  }
  protected setURL(url:string){
    this.url = url
  }
  abstract get():Promise<D>
}

