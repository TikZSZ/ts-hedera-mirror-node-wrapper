## This is a helper library built on top of [Hedera Mirror Node Rest API](https://docs.hedera.com/guides/docs/mirror-node-api/cryptocurrency-api) 

# Features
- Typed Library
- Typed Responses
- Flexible with different http clients like axios, fetch etc
- No need to remember how and what params exist for different resources in raw form


# Getting Started

## Installation

### npm
```shell
npm install @ts/wrapper
```
### yarn
```shell
yarn add @ts/wrapper
```

## Initialize
Client needs to be initialized with base url depending upon network. `BaseURL should not contain forward slashes at end` 
```typescript
/**
*https://previewnet.mirrornode.hedera.com/api/v1/transactions
*https://mainnet-public.mirrornode.hedera.com
*/
*
const client = new Client(baseURL)
```

# Examples

## Get Topic Messages


| Method         	| Type            	|
|----------------	|-----------------	|
| setTopicId     	| String          	|
| order          	| [Order](#order) 	|
| setLimit       	| Number          	|
| sequenceNumber 	| OptionalFilters 	|

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


## Get Accounts

```typescript
const accountCursor = accounts(client)
  .setAccountId(optionalFilters.lessThan('0.0.15678177'))
  .setLimit(2)
const accounts1 = await accountCursor.get()
const accounts2 = await accountCursor.next()
```

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

## Network Supply
```typescript 
const supply = await networkSupply(client).get()
```

# References
## Order
```typescript
const Order = "asc" | "desc"
```
## OptionalFilters 
```typescript
// optionalFilters is a helper provided in package for navigating cursors, includes-> 
greaterThan(n:number), 
greaterThanEqualTo(n:number), 
lessThan(n:number), 
lessThanEqualTo(n:number)
```
## BaseMirrorClient
```typescript
interface BaseMirrorClient{
  baseURL:string
  fetch<D=any>(baseURL:string,params:Params):Promise<D>
}
// Usage with axios

class AxiosClient implements BaseMirrorClient{
  public baseURL = 'https://mainnet-public.mirrornode.hedera.com'
  public async fetch<D=any>(url:string,params:Params):Promise<D>{
    const response = await axios.get(baseURL,{url,url:params:params})
    return response.data
  }
}
```
