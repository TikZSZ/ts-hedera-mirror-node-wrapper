import { BaseMirrorNode, BaseMirrorClient } from "../";
import {NFT as NFTResponse, NFTTransactionHistory} from "."

export class NFTInfo extends BaseMirrorNode<NFTResponse> {
  private tokenId:string = ''
  private serialNumber:number = 1
  private baseURL:string = ''
  constructor(mirrorClient: BaseMirrorClient, url: string,tokenId?:string,serialNumber?:number){
    super(mirrorClient,url)
    if(tokenId) this.tokenId = tokenId;
    if(serialNumber) this.serialNumber = serialNumber
    this.baseURL = url
  }
  static v1(mirrorClient: BaseMirrorClient,tokenId?:string,serialNumber?:number){
    return new this(mirrorClient,`/api/v1/tokens`,tokenId,serialNumber)
  }

  setTokenId(val:string){
    this.tokenId = val
    return this
  }

  setSerialNumber(val:number){
    this.serialNumber = val
    return this
  }

  get(){
    if(!this.tokenId || !this.setSerialNumber) throw new Error('token id or serial number not set')
    this.setURL(`${this.baseURL}/${this.tokenId}/nfts/${this.serialNumber}`)
    return this.fetch()
  }

  get getNFTTransactionHistory(){
    return new NFTTransactionHistory(this.mirrorClient,this.baseURL,this.tokenId,this.serialNumber)
  }
  
}
