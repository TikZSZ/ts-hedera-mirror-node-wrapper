import { expect, describe, it, beforeAll, afterAll } from "vitest";
import
{
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TransferTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TokenMintTransaction,
  Hbar,
  AccountCreateTransaction,
  ContractCreateTransaction,
  FileCreateTransaction,
} from "@hashgraph/sdk";
import
{
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
  Client as MirrorClient,
} from "../src";
import fs from 'fs';
import path from 'path';

const TEST_DATA_FILE = path.join( __dirname, 'test_data.json' );
const refresh = process.env.REFRESH_TEST_DATA === 'true';

let mirrorClient: MirrorClient;
let sdkClient: Client;
let operatorId: AccountId;
let operatorKey: PrivateKey;
let testAccountId: string;
let testTokenId: string;
let testTopicId: string;
let testContractId: string;
let testNftTokenId: string;
let newAccountPrivateKey: PrivateKey;

function saveTestData ()
{
  const data = {
    testAccountId,
    testTokenId,
    testTopicId,
    testContractId,
    testNftTokenId,
    newAccountPrivateKey: newAccountPrivateKey.toStringRaw(),
  };
  fs.writeFileSync( TEST_DATA_FILE, JSON.stringify( data, null, 2 ) );
  console.log( "Test data saved to", TEST_DATA_FILE );
}

function loadTestData ()
{
  if ( fs.existsSync( TEST_DATA_FILE ) )
  {
    const data = JSON.parse( fs.readFileSync( TEST_DATA_FILE, 'utf8' ) );
    testAccountId = data.testAccountId;
    testTokenId = data.testTokenId;
    testTopicId = data.testTopicId;
    testContractId = data.testContractId;
    testNftTokenId = data.testNftTokenId;
    newAccountPrivateKey = PrivateKey.fromStringED25519( data.newAccountPrivateKey );
    console.log( "Test data loaded from", TEST_DATA_FILE );
    return true;
  }
  return false;
}

beforeAll( async () =>
{
  // Initialize SDK client
  operatorId = AccountId.fromString( process.env.OPERATOR_ID! );
  operatorKey = PrivateKey.fromStringED25519( process.env.OPERATOR_KEY! );
  sdkClient = Client.forTestnet().setOperator( operatorId, operatorKey );

  // Initialize Mirror Node client
  mirrorClient = new MirrorClient( "https://testnet.mirrornode.hedera.com" );
  console.log( "Operator ID:", operatorId.toString() );

  if ( !refresh && loadTestData() )
  {
    return;
  }

  try
  {
    newAccountPrivateKey = PrivateKey.generateED25519();

    // Create test account
    const accountTx = await new AccountCreateTransaction()
      .setInitialBalance( new Hbar( 20 ) )
      .setKey( newAccountPrivateKey.publicKey )
      .execute( sdkClient );
    const accountReceipt = await accountTx.getReceipt( sdkClient );
    testAccountId = accountReceipt.accountId!.toString();
    console.log( "Test account created:", testAccountId );

    // Create test fungible token
    const tokenTx = await new TokenCreateTransaction()
      .setTokenName( "Test Token" )
      .setTokenSymbol( "TEST" )
      .setTokenType( TokenType.FungibleCommon )
      .setDecimals( 0 )
      .setInitialSupply( 100 )
      .setTreasuryAccountId( operatorId )
      .setSupplyType( TokenSupplyType.Infinite )
      .setSupplyKey( operatorKey )
      .execute( sdkClient );
    const tokenReceipt = await tokenTx.getReceipt( sdkClient );
    testTokenId = tokenReceipt.tokenId!.toString();
    console.log( "Test token created:", testTokenId );

    // Create test topic
    const topicTx = await new TopicCreateTransaction().execute( sdkClient );
    const topicReceipt = await topicTx.getReceipt( sdkClient );
    testTopicId = topicReceipt.topicId!.toString();
    console.log( "Test topic created:", testTopicId );

    // Submit messages to the topic
    for ( let i = 0; i < 30; i++ )
    {
      await new TopicMessageSubmitTransaction()
        .setTopicId( topicReceipt.topicId! )
        .setMessage( `Test message ${i}` )
        .execute( sdkClient );
    }
    console.log( "30 messages submitted to the topic" );

    // Create test smart contract
    const contractBytecodeTx = await new FileCreateTransaction()
      .setContents( "608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063cfae321714610030575b600080fd5b61003861004e565b6040518082815260200191505060405180910390f35b60008054905090565b6000548156fea265627a7a72315820f69baabc9a39a49d5a404b5a251b2744f9a2a792723c30c7ad9e97df77a4277364736f6c63430005100032" )
      .execute( sdkClient );
    const contractBytecodeReceipt = await contractBytecodeTx.getReceipt( sdkClient );
    const contractTx = await new ContractCreateTransaction()
      .setBytecodeFileId( contractBytecodeReceipt.fileId! )
      .setGas( 100000 )
      .execute( sdkClient );
    const contractReceipt = await contractTx.getReceipt( sdkClient );
    testContractId = contractReceipt.contractId!.toString();
    console.log( "Test contract created:", testContractId );

    // Create test NFT token
    const nftTokenTx = await new TokenCreateTransaction()
      .setTokenName( "Test NFT" )
      .setTokenSymbol( "TNFT" )
      .setTokenType( TokenType.NonFungibleUnique )
      .setTreasuryAccountId( operatorId )
      .setSupplyType( TokenSupplyType.Finite )
      .setMaxSupply( 10 )
      .setSupplyKey( operatorKey )
      .execute( sdkClient );
    const nftTokenReceipt = await nftTokenTx.getReceipt( sdkClient );
    testNftTokenId = nftTokenReceipt.tokenId!.toString();
    console.log( "Test NFT token created:", testNftTokenId );

    // Mint some NFTs
    for ( let i = 0; i < 5; i++ )
    {
      await new TokenMintTransaction()
        .setTokenId( nftTokenReceipt.tokenId! )
        .setMetadata( [ Uint8Array.from( Buffer.from( `NFT ${i}` ) ) ] )
        .execute( sdkClient );
    }
    console.log( "5 NFTs minted" );

    saveTestData();

    // Wait for a few seconds to allow the mirror node to update
    console.log( "Waiting for mirror node to update..." );
    await new Promise( resolve => setTimeout( resolve, 30000 ) );
  } catch ( error )
  {
    console.error( "Error during setup:", error );
    throw error;
  }
}, 120000 );

afterAll( () =>
{
  if ( refresh )
  {
    console.log( "Test data refreshed and saved." );
  }
} );

it( "should get messages", async () =>
{
  let limit = 10;
  let seqNo = 20;

  const msgCursor = topicMessages( mirrorClient )
    .setTopicId( testTopicId )
    .setLimit( limit )
    .order( "asc" )
    .setSequenceNumber( optionalFilters.greaterThan( seqNo ) );
  const msgs = await msgCursor.get();
  expect( msgs.messages.length ).toBeGreaterThan( 0 );
  if ( msgs.messages.length === limit )
  {
    expect( msgs.messages[ limit - 1 ].sequence_number ).toBeGreaterThan( seqNo );
  }

  const msgs2 = await msgCursor.next();
  if ( msgs2 && msgs2.messages.length > 0 )
  {
    expect( msgs2.messages[ 0 ].sequence_number ).toBeGreaterThan( msgs.messages[ msgs.messages.length - 1 ].sequence_number );
  }
} );

it( "should get current network supply", async () =>
{
  const msgCursor = networkSupply( mirrorClient );
  const supply = await msgCursor.get();
  expect( supply ).toBeDefined();
} );

it( "should get accounts", async () =>
{
  const accountCursor = accounts( mirrorClient ).setLimit( 2 ).order( "desc" );
  const accounts1 = await accountCursor.get();
  expect( accounts1.accounts.length ).toEqual( 2 );
  expect(
    accounts1.accounts[ 0 ].account.split( "." )[ 2 ] >
    accounts1.accounts[ 1 ].account.split( "." )[ 2 ]
  );

  const accounts2 = await accountCursor.setAccountId( testAccountId ).get();
  expect( accounts2.accounts[ 0 ].account ).toEqual( testAccountId );
} );

it( "should get smart contracts", async () =>
{
  const contractCursor = smartContract( mirrorClient );
  const resp = await contractCursor.setLimit( 2 ).order( "asc" ).get();
  expect( resp.contracts.length ).toEqual( 2 );
  expect( resp.contracts[ 1 ] > resp.contracts[ 0 ] );
} );

describe( "transactions", () =>
{
  it( "should get transfer txns", async () =>
  {
    const transactionCursor = transactions( mirrorClient );

    if ( refresh )
    {
      // Credit transaction
      await new TransferTransaction()
        .addHbarTransfer( operatorId, new Hbar( -1 ) )
        .addHbarTransfer( AccountId.fromString( testAccountId ), new Hbar( 1 ) )
        .execute( sdkClient );
    }

    const txns = await transactionCursor
      .setAccountId( testAccountId )
      .setLimit( 2 )
      .setType( "credit" )
      .setTransactionType( TransactionType.CRYPTOTRANSFER )
      .setResult( "success" )
      .get();

    expect( txns.transactions.length ).toBeGreaterThan( 0 );
    if ( txns.transactions.length > 0 )
    {
      const creditTransfer = txns.transactions[ 0 ].transfers.find( ( txn ) => txn.account === testAccountId );
      expect( creditTransfer?.amount ).toBeGreaterThan( 0 );
      expect( txns.transactions[ 0 ].name ).toEqual( TransactionType.CRYPTOTRANSFER );
      expect( txns.transactions[ 0 ].result ).toEqual( "SUCCESS" );
    }

    if ( refresh )
    {
      //Debit transaction
      sdkClient = Client.forTestnet().setOperator( testAccountId, newAccountPrivateKey );

      await new TransferTransaction()
        .addHbarTransfer( AccountId.fromString( testAccountId ), new Hbar( -1 ) )
        .addHbarTransfer( operatorId, new Hbar( 1 ) )
        .execute( sdkClient );
    }

    const txns2 = await transactionCursor.setType( "debit" ).get();
    expect( txns2.transactions.length ).toBeGreaterThan( 0 );
    if ( txns2.transactions.length > 0 )
    {
      const debitTransfer = txns2.transactions[ 0 ].transfers.find( ( txn ) => txn.account === testAccountId );
      expect( debitTransfer?.amount ).toBeLessThan( 0 );
    }
  } );

  it( "should get consensus msg txns", async () =>
  {
    const transactionCursor = transactions( mirrorClient );
    const txns = await transactionCursor
      .setTransactionType( TransactionType.CONSENSUSSUBMITMESSAGE )
      .setLimit( 1 )
      .get();
    expect( txns.transactions.length ).toBeGreaterThan( 0 );
    if ( txns.transactions.length > 0 )
    {
      expect( txns.transactions[ 0 ].name ).toEqual( TransactionType.CONSENSUSSUBMITMESSAGE );
    }
  } );
} );

describe( "tokens", () =>
{
  let tU: TokenUtils;
  beforeAll( () =>
  {
    tU = tokenUtils( mirrorClient );
  } );

  it( "should get tokens", async () =>
  {
    const tokenCursor = tU.Tokens.setLimit( 2 )
      .order( "desc" )
      .setTokenType( TokenTypeFilter.NON_FUNGIBLE_UNIQUE );
    const tokensUnique = await tokenCursor.get();
    expect( tokensUnique.tokens.length ).toEqual( 2 );
    expect( tokensUnique.tokens[ 0 ].type ).toEqual( TokenTypeFilter.NON_FUNGIBLE_UNIQUE.toUpperCase() );

    const tokensCommon = await tokenCursor
      .setTokenType( TokenTypeFilter.FUNGIBLE_COMMON )
      .get();
    expect( tokensCommon.tokens.length ).toEqual( 2 );
    expect( tokensCommon.tokens[ 0 ].type ).toEqual( TokenTypeFilter.FUNGIBLE_COMMON.toUpperCase() );
  } );

  it( "should get token information and balance", async () =>
  {
    const tokenInfoCursor = tU.TokenInfo.setTokenId( testTokenId );
    const tokenInfo = await tokenInfoCursor.get();
    expect( tokenInfo.token_id ).toEqual( testTokenId );
    const tokenBalance = await tokenInfoCursor.TokenBalances.get();
    expect( tokenBalance.balances ).toBeDefined();
  } );
} );

describe( "nfts", () =>
{
  let nU: NFTUtils;
  beforeAll( () =>
  {
    nU = nftUtils( mirrorClient );
  } );

  it( "should get nfts", async () =>
  {
    const nftsCursors = nU.NFTs.order( "asc" ).setTokenId( testNftTokenId );
    const nfts = await nftsCursors.get();
    expect( nfts.nfts.length ).toBeGreaterThanOrEqual( 2 );

    const nftInfoCursor = nU.NFTInfo.setTokenId( testNftTokenId ).setSerialNumber( 1 );
    const nftInfo = await nftInfoCursor.get();
    expect( nftInfo.token_id ).toEqual( testNftTokenId );

    const nftTxns = await nftInfoCursor.getNFTTransactionHistory.get();
    expect( nftTxns.transactions.length ).toBeGreaterThanOrEqual( 1 );
  } );
} );