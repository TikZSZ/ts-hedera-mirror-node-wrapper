### `Typescript Hedera Mirror Node Rest API wrapper with complete declarative abstraction layer`

# Features
- Typed Library
- Typed Responses
- Flexible with different http clients like axios, fetch etc
- No need to remember how and what params exist for different resources in raw form
- Easily maintainable

# Getting Started

## Installation

### npm
```shell
npm install @tikz/hedera-mirror-node-ts
```
### yarn
```shell
yarn add @tikz/hedera-mirror-node-ts
```

## Initialize
Client needs to be initialized with base url depending upon network. `BaseURL should not contain forward slashes at end` 
```typescript
/**
* https://previewnet.mirrornode.hedera.com
* https://mainnet-public.mirrornode.hedera.com
*/

const client = new Client(baseURL)
```

# Usage

## Get Topic Messages
```typescript
const client = new Client('https://testnet.mirrornode.hedera.com')
const msgCursor = topicMessages(client)
  .setTopicId('0.0.16430')
  .setLimit(10)
  .order('asc')
  .sequenceNumber(optionalFilters.greaterThan(20))

// get initial data
// -> 20 < sequenceNumber <= 30
const msgs = await msgCursor.get() 

// get next set of data
// -> 30 < sequenceNumber <= 40
const msgs2 = await msgCursor.next() 

// get next set of data
// -> 40 < sequenceNumber <= 50
const msgs3 = await msgCursor.next() 
```
### Refer [TopicMessages](#topicmessages) `for full api`

## Get Accounts
```typescript
const accountCursor = accounts(client)
  .setAccountId(optionalFilters.lessThan('0.0.15678177'))
  .setLimit(2)
const accounts1 = await accountCursor.get()
const accounts2 = await accountCursor.next()
```
### Refer [Accounts](#accounts) `for full api`

## Get Transactions
```typescript
const transactionCursor = transactions(client)
  .setAccountId('0.0.15678177')
  .setLimit(2)
  .setType('debit')
  .setResult('success')
const txns = await transactionCursor.get()
const txns2 = await transactionCursor.next()
``` 
### Refer [Transactions](#transactions) `for full api`


## Network Supply
```typescript 
const supply = await networkSupply(client).get()
```
### Refer [NetworkSupply](#networksupply) `for full api`

# Using different client
`By default axios is used to make requests which can be easily changed`

```typescript
// BaseMirrorClient.ts
interface BaseMirrorClient{
  baseURL:string
  fetch<D=any>(baseURL:string,params:Params):Promise<D>
}

// Client.ts
class AxiosClient implements BaseMirrorClient{
  public baseURL = 'https://mainnet-public.mirrornode.hedera.com'
  public async fetch<D>(url:string,params:Params):Promise<D>{
    const response = await axios.get(baseURL,{url,url:params:params})
    return response.data
  }
}
// index.ts
const client = new AxiosClient()
``` 

# References

## TopicMessages
```typescript
interface ConsensusParams {
  [filterKeys.SEQUENCE_NUMBER]: OptionalFilters;
}
// Methods
sequenceNumber(val: ConsensusParams['sequencenumber']): TopicMessages;
setTopicId(val: string): TopicMessages;
get(): Promise<MessagesResponse>;
next(): Promise<MessagesResponse>;
```

## Accounts
```typescript
interface AccountParams {
  [filterKeys.TRANSACTION_TYPE]: TransactionType;
  [filterKeys.ACCOUNT_ID]: string;
  [filterKeys.ACCOUNT_PUBLICKEY]: OptionalFilters;
  [filterKeys.ACCOUNT_BALANCE]: OptionalFilters;
}
// Methods
setBalance(val: AccountParams['account.balance']): Accounts;
setAccountId(val: AccountParams['account.id']): Accounts;
setPublicKey(val: AccountParams['account.publickey']): Accounts;
setTransactionType(val: AccountParams['transactiontype']): Accounts;
get(): Promise<AccountsResponse>;
next(): Promise<AccountsResponse>;
```

## Transactions
```typescript
interface TransactionParams {
  [filterKeys.TRANSACTION_TYPE]: TransactionType; 
  [filterKeys.ACCOUNT_ID]: string;
  [filterKeys.RESULT]: 'fail' | 'success';
  [filterKeys.CREDIT_TYPE]: 'credit' | 'debit';
}
// Methods 
setAccountId(val: OptionalFilters): Transaction;
setResult(val: TransactionParams['result']): Transaction;
setType(val: TransactionParams['type']): Transaction;
setTransactionType(val: TransactionParams['transactiontype']): Transaction;
get(): Promise<TransactionsResponse>;
next(): Promise<TransactionsResponse>;
```

## NetworkSupply
```typescript
// Methods
get(): Promise<NetworkSupplyResponse>;
// Response
interface NetworkSupplyResponse {
  released_supply: string;
  timestamp: string;
  total_supply: string;
}
```

## Order
```typescript
type Order = "asc" | "desc"
```
## OptionalFilters 
```typescript
// optionalFilters is a helper provided in package for navigating cursors
type OptionalFilters = `gt:${string}` | `gte:${string}` | `lt:${string}` | `lte:${string}` | string;
const optionalFilters: {
  greaterThan(val: any): OptionalFilters;
  greaterThanEqualTo(val: any): OptionalFilters;
  lessThan(val: any): OptionalFilters;
  lessThanEqualTo(val: any): OptionalFilters;
};
```

## TransactionType
```typescript
enum TransactionType {
    CONSENSUSCREATETOPIC = "CONSENSUSCREATETOPIC",
    CONSENSUSDELETETOPIC = "CONSENSUSDELETETOPIC",
    CONSENSUSSUBMITMESSAGE = "CONSENSUSSUBMITMESSAGE",
    CONSENSUSUPDATETOPIC = "CONSENSUSUPDATETOPIC",
    CONTRACTCALL = "CONTRACTCALL",
    CONTRACTCREATEINSTANCE = "CONTRACTCREATEINSTANCE",
    CONTRACTDELETEINSTANCE = "CONTRACTDELETEINSTANCE",
    CONTRACTUPDATEINSTANCE = "CONTRACTUPDATEINSTANCE",
    CRYPTOADDLIVEHASH = "CRYPTOADDLIVEHASH",
    CRYPTOCREATEACCOUNT = "CRYPTOCREATEACCOUNT",
    CRYPTODELETE = "CRYPTODELETE",
    CRYPTODELETELIVEHASH = "CRYPTODELETELIVEHASH",
    CRYPTOTRANSFER = "CRYPTOTRANSFER",
    CRYPTOUPDATEACCOUNT = "CRYPTOUPDATEACCOUNT",
    FILEAPPEND = "FILEAPPEND",
    FILECREATE = "FILECREATE",
    FILEDELETE = "FILEDELETE",
    FILEUPDATE = "FILEUPDATE",
    FREEZE = "FREEZE",
    SCHEDULECREATE = "SCHEDULECREATE",
    SCHEDULEDELETE = "SCHEDULEDELETE",
    SCHEDULESIGN = "SCHEDULESIGN",
    SYSTEMDELETE = "SYSTEMDELETE",
    SYSTEMUNDELETE = "SYSTEMUNDELETE",
    TOKENASSOCIATE = "TOKENASSOCIATE",
    TOKENBURN = "TOKENBURN",
    TOKENCREATION = "TOKENCREATION",
    TOKENDELETION = "TOKENDELETION",
    TOKENDISSOCIATE = "TOKENDISSOCIATE",
    TOKENFEESCHEDULEUPDATE = "TOKENFEESCHEDULEUPDATE",
    TOKENFREEZE = "TOKENFREEZE",
    TOKENGRANTKYC = "TOKENGRANTKYC",
    TOKENMINT = "TOKENMINT",
    TOKENPAUSE = "TOKENPAUSE",
    TOKENREVOKEKYC = "TOKENREVOKEKYC",
    TOKENUNFREEZE = "TOKENUNFREEZE",
    TOKENUNPAUSE = "TOKENUNPAUSE",
    TOKENUPDATE = "TOKENUPDATE",
    TOKENWIPE = "TOKENWIPE",
    UNCHECKEDSUBMIT = "UNCHECKEDSUBMIT"
}
```

