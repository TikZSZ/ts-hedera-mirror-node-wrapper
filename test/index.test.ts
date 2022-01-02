import { expect, describe, it, beforeAll } from "vitest";
import {
  accounts,
  networkSupply,
  optionalFilters,
  topicMessages,
  TransactionType,
  transactions,
  tokenUtils,
  smartContract,
  TokenTypeFilter,
  nftUtils,
  NFTUtils,
  TokenUtils,
} from "../src";
import { Client } from "../src";
let client: Client;

beforeAll(() => {
  client = new Client("https://testnet.mirrornode.hedera.com");
});

it('should get messages',async ()=>{
  let limit = 10
  let seqNo = 20
  const msgCursor = topicMessages(client)
  .setTopicId('0.0.16430783')
  .setLimit(limit)
  .order('asc')
  .sequenceNumber(optionalFilters.greaterThan(seqNo))
  const msgs = await msgCursor.get()
  expect(msgs.messages.length).toEqual(10)
  expect(msgs.messages[limit-1].sequence_number).toEqual(limit+seqNo)
  const msgs2 = await msgCursor.next()
  const msgs3 = await msgCursor.next()
  expect(msgs2!.messages[limit-1].sequence_number).toEqual(limit+msgs.messages[limit-1].sequence_number)
  expect(msgs3!.messages[limit-1].sequence_number).toEqual(limit+msgs2!.messages[limit-1].sequence_number)
})

it('should get current network supply',async ()=>{
  let limit = 10
  let seqNo = 20
  const msgCursor = networkSupply(client)
  const supply = await msgCursor.get()
  expect(supply).toBeDefined()
})

it('should get accounts',async ()=>{
  const accountCursor = accounts(client)
  .setLimit(2)
  .order('desc')
  const accounts1 = await accountCursor.get()
  expect(accounts1.accounts.length).toEqual(2)
  expect(accounts1.accounts[0].account.split('.')[2]>accounts1.accounts[1].account.split('.')[2])
  console.log(accounts1.accounts[0].account.split('.')[2],accounts1.accounts[1].account.split('.')[2]);
  const accounts2 = await accountCursor.setAccountId('0.0.15678177').get()
  expect(accounts2.accounts[0].account).toEqual('0.0.15678177')
})

it('should get smart contracts', async () => {
  const contractCursor = smartContract(client)
  const resp = await contractCursor
  .setLimit(2)
  .order('asc')
  .get()
  expect(resp.contracts.length).toEqual(2)
  expect(resp.contracts[1] > resp.contracts[0])
})


describe("transactions",async () =>{
  it('should get transfer txns', async ()=>{
    let accountId = '0.0.15678177'
    const transactionCursor = transactions(client)
    it('should get credit txns', async ()=>{
      transactionCursor
        .setAccountId(accountId)
        .setLimit(2)
        .setType('credit')
        .setTransactionType(TransactionType.CRYPTOTRANSFER)
        .setResult('success')
      const txns = await transactionCursor.get()
      expect(txns.transactions[0].transfers.find((txn)=>{
        if(txn.account===accountId){
          return txn.amount
        }
      })?.amount).toBeGreaterThan(0)
      expect(txns.transactions.length).toEqual(2)
      expect(txns.transactions[0].name).toEqual(TransactionType.CRYPTOTRANSFER)
      expect(txns.transactions[0].result).toEqual('SUCCESS')})
    //
    it('should get debit txns', async ()=>{
      const txns2 = await transactionCursor.setType('debit').get()
      expect(txns2.transactions[0].transfers.find((txn)=>{
        if(txn.account===accountId){
          return txn.amount
        }
      })?.amount).toBeLessThan(0)
    })
  })

  it('should get consensus msg txns',async () => {
    let accountId = '0.0.15678177'
    const transactionCursor = transactions(client)
    const txns = await transactionCursor
      .setTransactionType(TransactionType.CONSENSUSSUBMITMESSAGE)
      .setLimit(1)
      .get()
    expect(txns.transactions[0].name).toEqual(TransactionType.CONSENSUSSUBMITMESSAGE)

  })
})

describe("tokens", async () => {
  let tU: TokenUtils;
  beforeAll(() => {
    tU = tokenUtils(client);
  });
  it("should get txns", async () => {
    const tokenCursor = tU.TokensCursor.setLimit(2)
      .order("desc")
      .setTokenType(TokenTypeFilter.NON_FUNGIBLE_UNIQUE);
    const tokensUnique = await tokenCursor.get();
    expect(tokensUnique.tokens.length).toEqual(2);
    expect(tokensUnique.tokens[0].type).toEqual(
      TokenTypeFilter.NON_FUNGIBLE_UNIQUE.toUpperCase()
    );
    const tokensCommon = await tokenCursor.setTokenType(TokenTypeFilter.FUNGIBLE_COMMON).get()
    expect(tokensCommon.tokens.length).toEqual(2);
    expect(tokensCommon.tokens[0].type).toEqual(
      TokenTypeFilter.FUNGIBLE_COMMON.toUpperCase()
    );
  });

  it("should get txnInformation and balance", async () => {
    const tokenCursor = tU.TokensCursor.setLimit(1)
      .order("desc")
      .setTokenType(TokenTypeFilter.NON_FUNGIBLE_UNIQUE);
    const tokensUnique = await tokenCursor.get();
    const tokenInfoCursor = tU.TokenInfoCursor
      .setTokenId(tokensUnique.tokens[0].token_id)
    const tokenInfo = await tokenInfoCursor.get()
    expect(tokenInfo.token_id).toEqual(tokensUnique.tokens[0].token_id)
    const tokenBalance = await tokenInfoCursor.TokenBalances.get()
    expect(tokenBalance.balances).toBeDefined()   
  });
});

describe('nfts', async () => {
  let nU: NFTUtils;
  beforeAll(() => {
    nU = nftUtils(client);
  });
  it('should get nfts', async () => {
    const nftsCursors = nU.NFTsCursor.order('asc').setTokenId('0.0.26176054')
    const nfts = await nftsCursors.get()
    expect(nfts.nfts.length).greaterThanOrEqual(2)

    const nftInfoCursor = nU.NFTInfoCursor
    .setTokenId('0.0.26176054')
    .setSerialNumber(1)
    const nftInfo = await nftInfoCursor.get()  
    expect(nftInfo.token_id).toEqual('0.0.26176054')

    const nftTxns = await nftInfoCursor
      .getNFTTransactionHistory()
        .get()
    expect(nftTxns.transactions.length).toBeGreaterThanOrEqual(1)
  })
})

