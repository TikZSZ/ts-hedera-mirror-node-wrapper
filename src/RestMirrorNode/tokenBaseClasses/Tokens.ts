import { filterKeys, OptionalFilters,BaseMirrorClient,HasMoreMirrorNode, TokenTypeFilter } from "..";


interface TokenParams{
  [filterKeys.TOKEN_ID]:OptionalFilters,
  [filterKeys.ACCOUNT_PUBLICKEY]:string,
  [filterKeys.ACCOUNT_ID]:OptionalFilters,
  [filterKeys.TOKEN_TYPE]:TokenTypeFilter
}

export class Tokens extends HasMoreMirrorNode<TokenParams,TokensResponse>{
  protected params:Partial<TokenParams> = {}
  constructor(mirrorClient: BaseMirrorClient,protected url: string){
    super(mirrorClient)
  }
  static v1(mirrorClient: BaseMirrorClient){
    return new this(mirrorClient,'/api/v1/tokens')
  }

  setPublicKey(val:TokenParams['account.publickey']){
    this.params[filterKeys.ACCOUNT_PUBLICKEY] = val
    return this
  }

  setTokenId(val:TokenParams['token.id']){
    this.params[filterKeys.TOKEN_ID] = val
    return this
  }

  setTokenType(val:TokenParams['type']){
    this.params['type'] = val
    return this
  }

  setAccountId(val:TokenParams['account.id']){
    this.params[filterKeys.ACCOUNT_ID] = val
    return this
  }

  get(){
    return this.fetch(this.url)
  }
}


export interface TokensResponse {
  tokens: Token[];
  links: Links;
}

interface Links {
  next?: string;
}

interface Token {
  admin_key?: Adminkey;
  symbol: string;
  token_id: string;
  type: string;
}

interface Adminkey {
  _type: string;
  key: string;
}
