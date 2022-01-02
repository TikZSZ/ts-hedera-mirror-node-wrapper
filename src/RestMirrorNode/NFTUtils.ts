import { BaseMirrorClient } from "."
import { NFTs,NFTInfo ,NFTTransactionHistory} from "./nftBaseClasses"


export class NFTUtils{
  constructor(private mirrorClient: BaseMirrorClient, private url: string){}

  static v1(mirrorClient: BaseMirrorClient){
    return new this(mirrorClient, '/api/v1/tokens')
  }

  get NFTsCursor(){
    return new NFTs(this.mirrorClient,this.url)
  }

  get NFTInfoCursor(){
    return new NFTInfo(this.mirrorClient,this.url)
  }

  get NFTTransactionHistory(){
    return new NFTTransactionHistory(this.mirrorClient,this.url)
  }
}