import {  BaseMirrorClient, HasMoreMirrorNode } from "../";


export class NFTTransactionHistory extends HasMoreMirrorNode<{},NftTransactionHistoryResponse> {
  private tokenId:string = ''
  private serialNumber:number = 1
  protected params = {}
  constructor(mirrorClient: BaseMirrorClient,protected url: string,tokenId?:string,serialNumber?:number){
    super(mirrorClient)
    if(tokenId) this.tokenId = tokenId;
    if(serialNumber) this.serialNumber = serialNumber;
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
    if(!this.tokenId || !this.serialNumber) throw new Error('token id or serial number not set')
    return this.fetch(`${this.url}/${this.tokenId}/nfts/${this.serialNumber}/transactions`)
  }
}


export interface NftTransactionHistoryResponse {
  transactions: Transaction[];
  links: Links;
}

interface Links {
  next?: any;
}

interface Transaction {
  consensus_timestamp: string;
  nonce: number;
  receiver_account_id: string;
  sender_account_id?: any;
  transaction_id: string;
  type: string;
}