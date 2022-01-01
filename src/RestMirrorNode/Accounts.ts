import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";
import { HasMoreMirrorNode } from "./HasMoreMirrorNode";
import { transactionType } from "./transactionType";

interface AccountParams {
  [filterKeys.TRANSACTION_TYPE]: transactionType;
  [filterKeys.ACCOUNT_ID]: string;
  [filterKeys.ACCOUNT_PUBLICKEY]: OptionalFilters;
  [filterKeys.ACCOUNT_BALANCE]: OptionalFilters;
}

export class Accounts extends HasMoreMirrorNode<AccountParams,AccountsResponse> {
  protected params: Partial<AccountParams> = {};
  constructor(mirrorNodeClient:BaseMirrorClient,url:string,accountId?:string){
    super(mirrorNodeClient,url)
    if(accountId) this.setAccountId(accountId);
  }
  /**
   * returns Accounts Mirror Client with version 1 
   */
  static v1(mirrorNodeClient:BaseMirrorClient,accountId?:string){
    return new this(mirrorNodeClient,'/api/v1/accounts',accountId)
  }

  setBalance(val: AccountParams['account.balance']) {
    this.params[filterKeys.ACCOUNT_BALANCE] = val;
    return this;
  }

  setAccountId(val: AccountParams['account.id']) {
    this.params[filterKeys.ACCOUNT_ID] = val;
    return this;
  }

  setPublicKey(val: AccountParams['account.publickey']) {
    this.params[filterKeys.ACCOUNT_PUBLICKEY] = val;
    return this;
  }
  setTransactionType(val: AccountParams['transactiontype']) {
    this.params[filterKeys.TRANSACTION_TYPE] = val
  }
  async get(){
    return this.fetch()
  }
}


interface AccountsResponse {
  accounts: Account[];
  links: Links;
}

interface Links {
  next: string;
}

interface Account {
  account: string;
  auto_renew_period?: any;
  balance: Balance;
  deleted: boolean;
  expiry_timestamp?: any;
  key?: any;
  max_automatic_token_associations: number;
  memo: string;
  receiver_sig_required?: any;
}

interface Balance {
  balance: number;
  timestamp: string;
  tokens: Token[];
}

interface Token {
  token_id: string;
  balance: number;
}