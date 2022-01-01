import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";
import { HasMoreMirrorNode } from "./HasMoreMirrorNode";
import {transactionType} from "./transactionType"
interface TransactionParams {
  [filterKeys.TRANSACTION_TYPE]: transactionType;
  [filterKeys.ACCOUNT_ID]: string;
  [filterKeys.RESULT]: 'fail'|'success';
  [filterKeys.CREDIT_TYPE]: 'credit'|'debit';
}

export class Transactions extends HasMoreMirrorNode<TransactionParams,TransactionsResponse>{
  protected params: Partial<TransactionParams> = {};
  constructor(mirrorNodeClient:BaseMirrorClient, url:string,accountId?:string){
    super(mirrorNodeClient,url)
    if(accountId) this.setAccountId(accountId)
  }

  static v1(mirrorNodeClient:BaseMirrorClient,accountId?:string){
    return new this(mirrorNodeClient,'/api/v1/transactions',accountId)
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

  setTransactionType(val: TransactionParams['transactiontype']) {
    this.params[filterKeys.TRANSACTION_TYPE] = val
  }

  async get(){
    return this.fetch()
  }
}


interface TransactionsResponse {
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