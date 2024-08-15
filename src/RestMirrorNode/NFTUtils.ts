import { BaseMirrorClient } from "."
import { NFTs,NFTInfo ,NFTTransactionHistory} from "./nftBaseClasses"

/**
 * Utility class for interacting with NFTs (Non-Fungible Tokens) on the Hedera network.
 * This class provides methods to retrieve information about NFTs, their transaction history,
 * and NFTs owned by specific accounts.
 */
export class NFTUtils {
  constructor(private mirrorClient: BaseMirrorClient, private url: string) {}

  /**
   * Creates a new instance of NFTUtils using the v1 API endpoint.
   * @param mirrorClient The BaseMirrorClient instance for making API calls.
   * @returns A new NFTUtils instance configured for the v1 API.
   */
  static v1(mirrorClient: BaseMirrorClient) {
    return new this(mirrorClient, '/api/v1/tokens');
  }

  /**
   * Provides access to methods for retrieving NFTs associated with a token ID or owned by a user ID.
   * This method allows querying NFTs using various filters such as token ID, account ID, and more.
   * The underlying endpoint used is: GET /api/v1/tokens/{tokenId}/nfts
   * @returns An NFTs instance for querying NFT data.
   */
  get NFTs() {
    return new NFTs(this.mirrorClient, this.url);
  }

  /**
   * Provides access to methods for retrieving detailed information about a specific NFT.
   * This method allows fetching data for a single NFT using its token ID and serial number.
   * The underlying endpoint used is: GET /api/v1/tokens/{tokenId}/nfts/{serialNumber}
   * @returns An NFTInfo instance for querying detailed information about an NFT.
   */
  get NFTInfo() {
    return new NFTInfo(this.mirrorClient, this.url);
  }

  /**
   * Provides access to methods for retrieving the transaction history of an NFT.
   * This method allows fetching all transactions related to a specific NFT, identified by its token ID and serial number.
   * The underlying endpoint used is: GET /api/v1/tokens/{tokenId}/nfts/{serialNumber}/transactions
   * @returns An NFTTransactionHistory instance for querying NFT transaction history.
   */
  get NFTTransactionHistory() {
    return new NFTTransactionHistory(this.mirrorClient, this.url);
  }
}
