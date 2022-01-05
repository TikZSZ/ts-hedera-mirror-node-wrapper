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

export interface TokenInfoResponse {
  admin_key?: any;
  auto_renew_account?: any;
  auto_renew_period?: any;
  created_timestamp: string;
  custom_fees: Customfees;
  decimals: string;
  deleted: boolean;
  expiry_timestamp: string;
  fee_schedule_key?: any;
  freeze_default: boolean;
  freeze_key?: any;
  initial_supply: string;
  kyc_key?: any;
  max_supply: string;
  memo: string;
  modified_timestamp: string;
  name: string;
  pause_key?: any;
  pause_status: string;
  supply_key?: any;
  supply_type: string;
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: string;
  wipe_key?: any;
}

interface Customfees {
  created_timestamp: string;
  fixed_fees: any[];
  fractional_fees: any[];
}