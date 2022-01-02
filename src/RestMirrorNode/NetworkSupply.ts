import { BaseMirrorClient, BaseMirrorNode } from "./";


export class NetworkSupply extends BaseMirrorNode<NetworkSupplyResponse> {
  constructor(mirrorNodeClient:BaseMirrorClient,url:string){
    super(mirrorNodeClient,url)
  }

  static v1(mirrorNodeClient:BaseMirrorClient){
    return new this(mirrorNodeClient,`/api/v1/network/supply`)
  }


  protected params = {};

  async get(){
    return this.fetch()
  }
}

interface NetworkSupplyResponse {
  released_supply: string;
  timestamp: string;
  total_supply: string;
}