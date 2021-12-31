import { BaseMirrorNode } from "./BaseMirrorNode";
import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";
import { Cursor } from "./Cursor";

interface TransactionParams {
  [filterKeys.TRANSACTION_TYPE]: string;
  [filterKeys.ACCOUNT_ID]: string;
  [filterKeys.RESULT]: 'fail'|'success';
  [filterKeys.CREDIT_TYPE]: 'credit'|'debit';
}

export class Transactions extends BaseMirrorNode<TransactionParams,RootObject> {
  protected params: Partial<TransactionParams> = {};
  private cursor:Cursor<RootObject>;
  constructor( mirrorNodeClient:BaseMirrorClient,accountId?:string){
    super(mirrorNodeClient)
    this.cursor = new Cursor(this.setURLAndFetch)
    if(accountId) this.setAccountId(accountId)
  }
  setAccountId(val: OptionalFilters) {
    this.params[filterKeys.ACCOUNT_ID] = val;
    return this;
  }

  setResult(val: TransactionParams['result']) {
    this.params[filterKeys.RESULT] = val;
    return this;
  }

  setType(val: TransactionParams['type']) {
    this.params[filterKeys.CREDIT_TYPE] = val;
    return this;
  }

  setTransactionType(val: TransactionParams['transactiontype']) {}

  async get(){
    const res = await this.setURLAndFetch(`/api/v1/transactions`)
    this.cursor.link = res.links.next
    return res
  }

  get next(){
    return this.cursor.next
  }
  
}


interface RootObject {
  transactions: Transaction[];
  links: Links;
}

interface Links {
  next: string;
}

interface Transaction {
  charged_tx_fee: number;
  consensus_timestamp: string;
  entity_id: string;
  max_fee: string;
  memo_base64: string;
  name: string;
  node: string;
  nonce: number;
  result: string;
  scheduled: boolean;
  bytes?: any;
  transaction_hash: string;
  transaction_id: string;
  transfers: Transfer[];
  valid_duration_seconds: string;
  valid_start_timestamp: string;
}

interface Transfer {
  account: string;
  amount: number;
}