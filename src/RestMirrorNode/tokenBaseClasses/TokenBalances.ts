import { BaseMirrorClient, HasMoreMirrorNode ,filterKeys, OptionalFilters } from "..";

interface TokenBalanceParams{
  [filterKeys.ACCOUNT_PUBLICKEY]:string,
  [filterKeys.ACCOUNT_ID]:OptionalFilters
  [filterKeys.ACCOUNT_BALANCE]:OptionalFilters
}

export class TokenBalances extends HasMoreMirrorNode<TokenBalanceParams,TokenBalanceResponse>{
  protected params:Partial<TokenBalanceParams> = {}
  private tokenId:string = ''
  constructor(mirrorClient: BaseMirrorClient, protected url: string,tokenId?:string){
    super(mirrorClient)
    if(tokenId) this.tokenId = tokenId;
  }
  static v1(mirrorClient: BaseMirrorClient,tokenId?:string){
    return new this(mirrorClient,`/api/v1/tokens`,tokenId)
  }

  setPublicKey(val:TokenBalanceParams['account.publickey']){
    this.params[filterKeys.ACCOUNT_PUBLICKEY] = val
    return this
  }

  setAccountBalance(val:TokenBalanceParams['account.balance']){
    this.params[filterKeys.ACCOUNT_BALANCE] = val
    return this
  }

  setAccountId(val:TokenBalanceParams['account.id']){
    this.params[filterKeys.ACCOUNT_ID] = val
    return this
  }

  setTokenId(val:string){
    this.tokenId = val
    return this
  }

  get(){
    if(!this.tokenId) throw new Error('no token id')
    return this.fetch(`${this.url}/${this.tokenId}/balances`)
  }
}


interface TokenBalanceResponse {
  timestamp: string;
  balances: Balance[];
  links: Links;
}

interface Links {
  next?: string|null;
}

interface Balance {
  account: string;
  balance: number;
  decimals: number;
}