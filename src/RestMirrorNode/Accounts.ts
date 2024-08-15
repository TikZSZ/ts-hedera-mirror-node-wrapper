import {
  filterKeys,
  BaseMirrorClient,
  OptionalFilters,
  HasMoreMirrorNode,
  TransactionType,
} from "./";

const {} = TransactionType

interface AccountParams {
  [filterKeys.TRANSACTION_TYPE]: TransactionType;
  [filterKeys.ACCOUNT_ID]: OptionalFilters;
  [filterKeys.ACCOUNT_PUBLICKEY]: string;
  [filterKeys.ACCOUNT_BALANCE]: OptionalFilters;
}

export class Accounts extends HasMoreMirrorNode<
  AccountParams,
  AccountsResponse
> {
  protected params: Partial<AccountParams> = {};
  constructor(
    mirrorNodeClient: BaseMirrorClient,
    protected url: string,
    accountId?: string
  ) {
    super(mirrorNodeClient);
    if (accountId) this.setAccountId(accountId);
  }
  /**
   * returns Accounts Mirror Client with version 1
   */
  static v1(mirrorNodeClient: BaseMirrorClient, accountId?: string) {
    return new this(mirrorNodeClient, "/api/v1/accounts", accountId);
  }

  setBalance(val: OptionalFilters) {
    this.params[filterKeys.ACCOUNT_BALANCE] = val;
    return this;
  }

  setAccountId(val: OptionalFilters) {
    this.params[filterKeys.ACCOUNT_ID] = val;
    return this;
  }

  setPublicKey(val: string) {
    this.params[filterKeys.ACCOUNT_PUBLICKEY] = val;
    return this;
  }
  setTransactionType(val: TransactionType) {
    this.params[filterKeys.TRANSACTION_TYPE] = val;
    return this;
  }
  async get() {
    console.log(this.params)
    return this.fetch(this.url);
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
  alias: null;
  auto_renew_period: number;
  balance: Balance;
  created_timestamp: string;
  decline_reward: boolean;
  deleted: boolean;
  ethereum_nonce: number;
  evm_address: string;
  expiry_timestamp: string;
  key: Key;
  max_automatic_token_associations: number;
  memo: string;
  pending_reward: number;
  receiver_sig_required: boolean;
  staked_account_id: null;
  staked_node_id: null;
  stake_period_start: null;
}

interface Key {
  _type: string;
  key: string;
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
