import { Client, optionalFilters, topicMessages,accounts,transactions, TransactionType, tokenUtils, nftUtils } from "."

const client = new Client('https://mainnet.mirrornode.hedera.com')

const tokenUtilss = tokenUtils(client)
const nftUtilss = nftUtils(client)
const accountId = "0.0.6734263"
const tokenId = "0.0.3872504"
async function main(){
  try{
    const resp = await nftUtilss.NFTTransactionHistory.setTokenId(tokenId).setSerialNumber(317).get()
    console.log(resp)
    console.log(JSON.stringify(resp))
  }catch(err){
    console.dir(err,{depth:null})
  }
  // const accounts = await accountsCursor.get()
  // // console.log(accounts.accounts.map((account) => ({balance:account})))
  // console.dir(accounts.accounts.map((account)=>({balance:account.balance})),{depth:null})
}
main()