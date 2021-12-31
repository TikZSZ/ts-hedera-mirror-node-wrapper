import { BaseMirrorNode } from "./BaseMirrorNode";
import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";
import { Cursor } from "./Cursor";

interface AccountParams {
  [filterKeys.TRANSACTION_TYPE]: string;
  [filterKeys.ACCOUNT_ID]: string;
  [filterKeys.ACCOUNT_PUBLICKEY]: OptionalFilters;
  [filterKeys.ACCOUNT_BALANCE]: OptionalFilters;
}

export class Accounts extends BaseMirrorNode<AccountParams,RootObject> {
  protected params: Partial<AccountParams> = {};
  private cursor:Cursor<RootObject>
  constructor(private mirrorNodeClient:BaseMirrorClient,accountId?:string){
    super(mirrorNodeClient)
    this.cursor = new Cursor(this.setURLAndFetch)
    if(accountId) this.setAccountId(accountId);
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
  setTransactionType(val: AccountParams['transactiontype']) {}

  async get(){
    const res = await this.setURLAndFetch(`/api/v1/accounts`)
    this.cursor.link = res.links.next
    return res
  }
  get next(){
    return this.cursor.next
  }
}


interface RootObject {
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