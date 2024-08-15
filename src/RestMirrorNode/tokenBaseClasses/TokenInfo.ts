import { TokenBalances } from ".";
import { BaseMirrorNode,BaseMirrorClient } from "../";


export class TokenInfo extends BaseMirrorNode<TokenInfoResponse> {
  private tokenId:string = ''
  constructor(mirrorNodeClient:BaseMirrorClient,protected url:string,tokenId?:string){
    super(mirrorNodeClient)
    if(tokenId) this.tokenId = tokenId
  }

  static v1(mirrorNodeClient:BaseMirrorClient,tokenId?:string){
    return new this(mirrorNodeClient,'/api/v1/tokens',tokenId)
  }

  async get(){
    if(!this.tokenId) throw new Error('no token id')
    return this.fetch(`${this.url}/${this.tokenId}`)
  }
  
  get TokenBalances(){
    return new TokenBalances(this.mirrorClient,this.url,this.tokenId)
  }

  setTokenId(val:string){
    this.tokenId = val
    return this
  }
}

interface TokenInfoResponse {
  admin_key: key;
  auto_renew_account: string;
  auto_renew_period: number;
  created_timestamp: string;
  custom_fees: Customfees;
  decimals: string;
  deleted: boolean;
  expiry_timestamp: number;
  fee_schedule_key: null;
  freeze_default: boolean;
  freeze_key: null;
  initial_supply: string;
  kyc_key: null;
  max_supply: string;
  memo: string;
  metadata: string;
  metadata_key: null;
  modified_timestamp: string;
  name: string;
  pause_key: null;
  pause_status: string;
  supply_key: key;
  supply_type: string;
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: string;
  wipe_key: key;
}

interface Customfees {
  created_timestamp: string;
  fixed_fees: any[];
  royalty_fees: any[];
}

type key = {
  _type: string;
  key: string;
} | null