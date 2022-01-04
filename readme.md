> Typescript [Hedera Mirror Node Rest API](https://docs.hedera.com/guides/docs/mirror-node-api/cryptocurrency-api) wrapper with complete declarative abstraction layer

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
import { Client } from "@tikz/hedera-mirror-node-ts";
/**
* https://previewnet.mirrornode.hedera.com
* https://mainnet-public.mirrornode.hedera.com
*/
const client = new Client(baseURL)
```



# Usage


## Get Topic Messages
```typescript
import { Client, topicMessages, optionalFilters } from "@tikz/hedera-mirror-node-ts";

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
import { accounts, optionalFilters } from "@tikz/hedera-mirror-node-ts";
const accountCursor = accounts(client)
  .setAccountId(
    optionalFilters.lessThan('0.0.15678177')
  )
  .setLimit(2)
const accounts1 = await accountCursor.get()
const accounts2 = await accountCursor.next()
```
### Refer [Accounts](#accounts) `for full api`

## Get Transactions
```typescript
import { transactions, optionalFilters, TransactionType } from "@tikz/hedera-mirror-node-ts";

const transactionCursor = transactions(client)
  .setAccountId('0.0.15678177')
  .setLimit(2)
  .setType('debit')
  .setTransactionType(
    TransactionType.CONSENSUSSUBMITMESSAGE
  )
  .setResult('success')
const txns = await transactionCursor.get()
// get next batch of transactions
const txns2 = await transactionCursor.next()
``` 
### Refer [Transactions](#transactions) `for full api`


## Network Supply
```typescript 
import { networkSupply } from "@tikz/hedera-mirror-node-ts";
const supply = await networkSupply(client).get()
```
### Refer [NetworkSupply](#networksupply) `for full api`

## Tokens
```typescript
import { tokenUtils } from "@tikz/hedera-mirror-node-ts";

const tokenUtil = tokenUtils(client)
// don't destructure {TokensCursor, TokenInfoCursor, TokenBalances} 
// token utils is a class

const tokenCursor = tokenUtil.Tokens
  .setLimit(2)
  .order("desc")
  .setTokenType(TokenTypeFilter.NON_FUNGIBLE_UNIQUE);
const tokensUnique = await tokenCursor.get();

const tokensCommon = await tokenCursor
  .setTokenType(TokenTypeFilter.FUNGIBLE_COMMON)
  .get();

// token information
const tokenInfoCursor = tokenUtil.TokenInfo
  .setTokenId('0.0....');
const tokenInfo = await tokenInfoCursor.get();

// get token balances
const tokenBalance = await tokenInfoCursor.TokenBalances
  .get(); // no need to set token id 
 //or
const tokenBalance = await tokenUtil.TokenBalances
  .setTokenId('0.0....')
  .get();
```
### Refer [TokenUtils](#tokenutils) `for full api`

## NFTs
```typescript
import { nftUtils } from "@tikz/hedera-mirror-node-ts";

const nftUtil = nftUtils(client)

// get nfts
const nftsCursors = nftUtil.NFTs
  .setTokenId("0.0.....")
  .order("asc");
const nfts = await nftsCursors.get();

// get nft info
const nftInfoCursor = nftUtil.NFTInfo
  .setTokenId("0.0.....")
  .setSerialNumber(1);
const nftInfo = await nftInfoCursor.get();

// get nft transaction history
const nftTxns = await nftInfo // no need to set token id
  .getNFTTransactionHistory()
  .get();
  // or 
const nftTxns = await nftUtil.NFTTransactionHistory
  .setTokenId('0.0...')
  .setSerialNumber(0)
  .get();
```
### Refer [NFTUtils](#nftutils) `for full api`


## SmartContracts
```typescript
const contractCursor = smartContract(client);
const resp = await contractCursor
  .setLimit(2)
  .order("asc")
  .get();
```
### Refer [SmartContracts](#smartcontracts) `for full api`

## //TODO  ScheduleList, ScheduleTransaction, TransactionStateProof

# Using different client
`By default axios is used to make requests which can be easily changed`

```typescript
import { BaseMirrorClient } from "@tikz/hedera-mirror-node-ts";

// Client.ts
class AxiosClient implements BaseMirrorClient{
  public baseURL = 'https://mainnet-public.mirrornode.hedera.com'
  public async fetch<D>(url:string,params:Params):Promise<D>{
    const response = await axios.get(baseURL,{url:url,params:params})
    return response.data
  }
}
// index.ts
const client = new AxiosClient()
``` 

# Migrating from deprecated versions
When `/api/v1` gets deprecated then a more raw approach can be used till library gets updated
```typescript
import { Client, TopicMessages,Transactions ,optionalFilters, TokenUtils, NFTUtils } from "@tikz/hedera-mirror-node-ts";

const client = new Client('https://testnet.mirrornode.hedera.com')

const msgCursor = new TopicMessages(client,'/api/v2/topics')
  .setTopicId('0.0.16430')
  .setLimit(10)
  .order('asc')
  .sequenceNumber(optionalFilters.greaterThan(20))
// similarly
const transactionCursor = new Transactions(client,'/api/v2/transactions')
const networkSupplyCursor = new NetworkSupply(client,'/api/v2/network/supply')
const tokenUtils = new TokenUtils(client,'/api/v2/token')
const nftUtils = new NFTUtils(client,'/api/v2/token')
```


# References

## BasicParams
`Exists for all resource types that has next cursor link`
```typescript
order(order: "asc" | "desc")
setLimit(limit: number)
timestamp(timestamp: OptionalFilters)
```

## TopicMessages
```typescript
// Methods
sequenceNumber(val: OptionalFilters): TopicMessages;
setTopicId(val: string): TopicMessages;
get(): Promise<MessagesResponse>;
next(): Promise<MessagesResponse>;
```

## Accounts
```typescript
// Methods
setBalance(val: OptionalFilters): Accounts;
setAccountId(val: string): Accounts;
setPublicKey(val: OptionalFilters): Accounts;
setTransactionType(val: TransactionType): Accounts;
get(): Promise<AccountsResponse>;
next(): Promise<AccountsResponse>;
```

## Transactions
```typescript
// Methods 
setAccountId(val: OptionalFilters): Transaction;
setResult(val: 'fail' | 'success'): Transaction;
setType(val: 'credit' | 'debit'): Transaction;
setTransactionType(val: TransactionType): Transaction;
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

## TokenUtils
### Tokens
```typescript
// methods
setPublicKey(val: string): Tokens;
setTokenId(val: OptionalFilters): Tokens;
setTokenType(val: TokenTypeFilter): Tokens;
setAccountId(val: OptionalFilters): Tokens;
get(): Promise<TokensResponse>;
```
### TokenInfo
```typescript
// methods
setTokenId(val: string): TokenInfo;
get(): Promise<TokenInfoResponse>;
TokenBalances: TokenBalances;
```
### TokenBalances
```typescript
// methods
setPublicKey(val: string): this;
setAccountBalance(val: OptionalFilters): this;
setAccountId(val: OptionalFilters): this;
setTokenId(val: string): this;
get(): Promise<TokenBalanceResponse>;
```

## NFTUtils
### NFTs
```typescript
// methods
setAccountId(val: OptionalFilters): NFTs;
setTokenId(val: string): NFTs;
get(): Promise<NFTsResponse>;
```

### NFTInfo
```typescript
// methods
setTokenId(val: string): NFTInfo;
setSerialNumber(val: number): NFTInfo;
get(): Promise<NFTResponse>;
getNFTTransactionHistory: NFTTransactionHistory;
```
### NFTTransactionHistory
```typescript
// methods
setTokenId(val: string): NFTTransactionHistory;
setSerialNumber(val: number): NFTTransactionHistory;
get(): Promise<NftTransactionHistoryResponse>;
```

### SmartContracts
```typescript
// methods
setSmartContractId(val: OptionalFilters): SmartContracts;
get(): Promise<ContractResponse>;
```

## Order
```typescript
type Order = "asc" | "desc"
```
## TokenTypeFilter
```typescript
enum TokenTypeFilter {
  ALL = "all",
  FUNGIBLE_COMMON = "fungible_common",
  NON_FUNGIBLE_UNIQUE = "non_fungible_unique"
}
```


## OptionalFilters 
```typescript
// optionalFilters is a helper provided in package for navigating cursors
type OptionalFilters = `gt:${string}` | `gte:${string}` | `lt:${string}` | `lte:${string}` | `ne:${string}` | string;
type optionalFilters: {
  greaterThan(val: any): OptionalFilters;
  greaterThanEqualTo(val: any): OptionalFilters;
  lessThan(val: any): OptionalFilters;
  lessThanEqualTo(val: any): OptionalFilters;
  notEqualTo(val: any): OptionalFilters;
  equalTo(val: any): OptionalFilters;
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

