import { BaseMirrorNode } from "./BaseMirrorNode";
import { BaseMirrorClient } from "./BaseMirrorClient";


export class NetworkSupply extends BaseMirrorNode<{},RootObject> {
  constructor(mirrorNodeClient:BaseMirrorClient){
    super(mirrorNodeClient)
  }
  protected params = {};

  async get(){
    const res = await this.setURLAndFetch(`/api/v1/network/supply`)
    return res
  }
}

interface RootObject {
  released_supply: string;
  timestamp: string;
  total_supply: string;
}