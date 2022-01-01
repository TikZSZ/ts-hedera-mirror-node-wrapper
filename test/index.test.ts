import {expect,describe,it, beforeAll} from "vitest"
import {accounts, Client,networkSupply,optionalFilters,topicMessages, transactions} from "../src"
import { TransactionType } from "../src/RestMirrorNode/TransactionType"
let client :Client 

beforeAll(()=>{
  client = new Client('https://testnet.mirrornode.hedera.com')
})

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

describe("should get transactions",async () =>{

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



