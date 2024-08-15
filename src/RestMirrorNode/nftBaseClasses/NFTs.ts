import { filterKeys, OptionalFilters, BaseMirrorClient, HasMoreMirrorNode } from "..";

interface NFTParams{
  [filterKeys.ACCOUNT_ID]:OptionalFilters
}

export class NFTs extends HasMoreMirrorNode<NFTParams,NFTsResponse>{
  protected params:Partial<NFTParams> = {}
  private tokenId:string = ''
  constructor(mirrorClient: BaseMirrorClient,protected url: string,tokenId?:string){
    super(mirrorClient)
    if(tokenId) this.tokenId = tokenId;
  }
  static v1(mirrorClient: BaseMirrorClient,tokenId?:string){
    return new this(mirrorClient,`/api/v1/tokens`,tokenId)
  }

  setAccountId(val:NFTParams['account.id']){
    this.params[filterKeys.ACCOUNT_ID] = val
    return this
  }

  setTokenId(val:string){
    this.tokenId = val
    return this
  }

  get(){
    if(!this.tokenId) throw new Error('no token id')
    return this.fetch(`${this.url}/${this.tokenId}/nfts`)
  }
}


export interface NFTsResponse {
  nfts: NFT[];
  links: Links;
}

interface Links {
  next?: any;
}

export interface NFT {
  account_id: string;
  created_timestamp: string;
  delegating_spender: null;
  deleted: boolean;
  metadata: string;
  modified_timestamp: string;
  serial_number: number;
  spender: null;
  token_id: string;
}
