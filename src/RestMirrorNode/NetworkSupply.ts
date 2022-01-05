import { BaseMirrorClient, BaseMirrorNode } from "./";


export class NetworkSupply extends BaseMirrorNode<NetworkSupplyResponse> {
  constructor(mirrorNodeClient:BaseMirrorClient,protected url:string){
    super(mirrorNodeClient)
  }

  static v1(mirrorNodeClient:BaseMirrorClient){
    return new this(mirrorNodeClient,`/api/v1/network/supply`)
  }


  protected params = {};

  async get(){
    return this.fetch(this.url)
  }
}

export interface NetworkSupplyResponse {
  released_supply: string;
  timestamp: string;
  total_supply: string;
}