import { filterKeys, HasMoreMirrorNode, BaseMirrorClient, OptionalFilters, TransactionType, BasicParams } from "./";

interface TransactionParams
{
  [ filterKeys.TRANSACTION_TYPE ]: TransactionType;
  [ filterKeys.ACCOUNT_ID ]: OptionalFilters;
  [ filterKeys.RESULT ]: 'fail' | 'success';
  [ filterKeys.CREDIT_TYPE ]: 'credit' | 'debit';
}

export class Transactions extends HasMoreMirrorNode<TransactionParams, TransactionsResponse>
{
  protected params: Partial<TransactionParams> = {};
  private transactionId: string | null = null;

  constructor( mirrorNodeClient: BaseMirrorClient, protected url: string, accountId?: string )
  {
    super( mirrorNodeClient )
    if ( accountId ) this.setAccountId( accountId )
  }

  static v1 ( mirrorNodeClient: BaseMirrorClient, accountId?: string )
  {
    return new this( mirrorNodeClient, '/api/v1/transactions', accountId )
  }

  setTransactionId ( val: string | null )
  {
    this.transactionId = val
    return this;
  }


  setAccountId ( val: OptionalFilters )
  {
    this.params[ filterKeys.ACCOUNT_ID ] = val;
    return this;
  }

  setResult ( val: TransactionParams[ 'result' ] )
  {
    this.params[ filterKeys.RESULT ] = val;
    return this;
  }

  setType ( val: TransactionParams[ 'type' ] )
  {
    this.params[ filterKeys.CREDIT_TYPE ] = val;
    return this;
  }

  setTransactionType ( val: TransactionParams[ 'transactionType' ] )
  {
    this.params[ filterKeys.TRANSACTION_TYPE ] = val
    return this
  }

  protected override get completeParams ()
  {
    const params = super.completeParams;
    // if transaction id exists we make a new copy of params and return sub params excluding filters 
    if ( this.transactionId )
    {
      console.warn( 'All parameters are ignored when a transaction ID is set.' );
      return {}
    }
    return params;
  }

  async get ()
  {
    let url = this.url;
    if ( this.transactionId )
      {
        url += `/${this.transactionId}`;
      }
    console.debug(url,this.completeParams)
    return this.fetch( url )
  }
}


export interface TransactionsResponse
{
  transactions: Transaction[];
  links: Links;
}

interface Links
{
  next: string;
}

interface Transaction
{
  bytes: null;
  charged_tx_fee: number;
  consensus_timestamp: string;
  entity_id: string;
  max_fee: string;
  memo_base64: string;
  name: string;
  nft_transfers: any[];
  node: string;
  nonce: number;
  parent_consensus_timestamp: null;
  result: string;
  scheduled: boolean;
  staking_reward_transfers: any[];
  token_transfers: any[];
  transaction_hash: string;
  transaction_id: string;
  transfers: Transfer[];
  valid_duration_seconds: string;
  valid_start_timestamp: string;
}

interface Transfer
{
  account: string;
  amount: number;
  is_approval: boolean;
}