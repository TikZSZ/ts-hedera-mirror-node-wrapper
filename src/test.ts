import { Accounts, axiosMirrorClient, greaterThan, lessThan, NetworkSupply, TopicMessages, Transactions } from "."

async function test(){
  const msgCursor = new TopicMessages(axiosMirrorClient, '0.0.16430783')
  .setLimit(10)
  .order('asc')
  .sequenceNumber(greaterThan(20))
  const msgs = await msgCursor.get()
  const msgs2 = await msgCursor.next()
  const msgs3 = await msgCursor.next()

  const accountCursor = new Accounts(axiosMirrorClient)
    .setAccountId(lessThan('0.0.15678177'))
    .setLimit(2)
  const accounts = await accountCursor.get()
  const accounts2 = await accountCursor.next()

  const transactionCursor = await new Transactions(axiosMirrorClient)
    .setAccountId('0.0.15678177')
    .setLimit(2)
    .setType('debit')
    .setResult('success')
  const txns = await transactionCursor.get()
  const txns2 = (await transactionCursor.next())

  const supply = await new NetworkSupply(axiosMirrorClient).get()
  console.dir({msgs,msgs2,msgs3,accounts,accounts2,txns,txns2,supply},{depth:4});

}
test()
