import { Client } from "./AxiosMirrorNodeClient";
import { TokenUtils, NFTUtils } from "./";
import { optionalFilters, SmartContracts, TokenTypeFilter } from "./RestMirrorNode";
import { TokenBalanceResponse } from "./RestMirrorNode/tokenBaseClasses";

async function main(){
  const client = new Client('https://testnet.mirrornode.hedera.com');
  const tokenUtils =  TokenUtils.v1(client)
  // const tokenCursor = tokenUtils.TokensCursor
  //   .setLimit(100)
  //   .order('desc')
  //   .setTokenType(TokenTypeFilter.NON_FUNGIBLE_UNIQUE)
  // const tokens = await tokenCursor.get()
  // const tokenInfo = await tokenUtils.TokenInfoCursor
  //   .setTokenId(tokens.tokens[1].token_id)
  //   .TokenBalances
  // const tokenBalances = await tokenInfo.get()
  // console.log(tokenBalances);

  const tokenCursor = tokenUtils.TokensCursor.setLimit(1)
      .order("desc")
      .setTokenType(TokenTypeFilter.NON_FUNGIBLE_UNIQUE);
    const tokensUnique = await tokenCursor.get();
    const tokenInfoCursor = tokenUtils.TokenInfoCursor
      .setTokenId(tokensUnique.tokens[0].token_id)
    const tokenInfo = await tokenInfoCursor.get()
    const tokenBalance = await tokenInfoCursor.TokenBalances.get()
  console.log(tokenBalance);
  
  // let txns:any = []
  // const promises:Promise<any>[] = []
  // for (let i = 0; i < tokens.tokens.length; i++) {
  //   promises.push(new Promise(async (res,rej)=>{
  //     const resp = await tokenUtils.TokenBalanceCursor
  //       .setTokenId(tokens.tokens[i].token_id)
  //       .setAccountBalance(optionalFilters.greaterThan(0))
  //       .get()
  //     resp.balances.length > 0 &&  txns.push(tokens.tokens[i])
  //     res(resp)
  //   })) 
  // }
  // const res = await Promise.all(promises)
  // console.dir(txns,{depth:4});
  
  // const tokenBalance = await tokenUtils.TokenBalanceCursor
  //   .setTokenId(tokens.tokens[0].token_id)
  //   .setAccountBalance(optionalFilters.greaterThan(0))
  //   .get()
  // console.dir({tokens,tokenBalance},{depth:4});

  
  // const nftUtils = NFTUtils.v1(client) 
  //   const nftsCursors = nftUtils.NFTsCursor.setTokenId('0.0.26176054')
  //   const nfts = await nftsCursors.get()
    // const nftInfo = await nftUtils.NFTInfoCursor
    //   .setTokenId('0.0.26176054')
    //   .setSerialNumber(1)
    //   .getNFTTransactionHistory()
    //     .get()
    // const tokenBalance = await nftUtils.NFTTransactionHistory
    //   .setTokenId(tokens.tokens[0].token_id)
    //   .get()
    // console.dir({nfts},{depth:4});

  // const contractCursor = SmartContracts.v1(client)
  // const resp = await contractCursor
  // .setSmartContractId(optionalFilters.lessThan('0.0.26176211'))
  // .get()
  // console.dir({resp},{depth:4});
  
  
}

main()


// {
//
//   symbol: 'HClubTest2',
//   token_id: '0.0.26176054',
//   type: 'NON_FUNGIBLE_UNIQUE'
// },
// {
//   symbol: 'LEAF',
//   token_id: '0.0.26176032',
//   type: 'NON_FUNGIBLE_UNIQUE'
// },
// {
//   symbol: 'LEAF',
//   token_id: '0.0.26176070',
//   type: 'NON_FUNGIBLE_UNIQUE'
// }