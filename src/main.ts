import { Client, optionalFilters, topicMessages,accounts,transactions, TransactionType, tokenUtils, nftUtils } from "."

const client = new Client('https://testnet.mirrornode.hedera.com')

const tokenUtilss = tokenUtils(client)
const nftUtilss = nftUtils(client)
const accountId = "0.0.6734263"
const tokenId = "0.0.3872504"
const transCursor = transactions(client)
async function main(){
const accountsCursor = accounts(client)
  try{
    // const resp = await nftUtilss.NFTTransactionHistory.setTokenId(tokenId).setSerialNumber(317).get()
    // console.log(resp)
    // console.log(JSON.stringify(resp))
    // const resp = await transCursor.setAccountId("0.0.4679069").order("desc").setLimit(1).get()
    const resp = await accountsCursor.setAccountId("0.0.4679069").get()
    console.log(resp.accounts[0].balance)
  }catch(err){
    console.dir(err,{depth:null})
  }
  // const accounts = await accountsCursor.get()
  // // console.log(accounts.accounts.map((account) => ({balance:account})))
  // console.dir(accounts.accounts.map((account)=>({balance:account.balance})),{depth:null})
}
main()