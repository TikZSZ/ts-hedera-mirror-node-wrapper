import { Client,accounts,transactions,optionalFilters,topicMessages,networkSupply } from "."

//* 


async function test(){
  const client = new Client('https://testnet.mirrornode.hedera.com')
  const msgCursor = topicMessages(client)
  .setTopicId('0.0.16430783')
  .setLimit(10)
  .order('asc')
  .sequenceNumber(optionalFilters.greaterThan(20))
  const msgs = await msgCursor.get()
  const msgs2 = await msgCursor.next()
  const msgs3 = await msgCursor.next()

  const accountCursor = accounts(client)
    .setAccountId(optionalFilters.lessThan('0.0.15678177'))
    .setLimit(2)
  const accounts1 = await accountCursor.get()
  const accounts2 = await accountCursor.next()
  ;(await fetch('')).json()
  const transactionCursor = transactions(client)
    .setAccountId('0.0.15678177')
    .setLimit(2)
    .setType('debit')
    .setResult('success')
  const txns = await transactionCursor.get()
  const txns2 = await transactionCursor.next()

  const supply = await networkSupply(client).get()
  console.dir({msgs,msgs2,msgs3,accounts1,accounts2,txns,txns2,supply},{depth:4});
}
test()
