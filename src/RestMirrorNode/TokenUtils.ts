import { BaseMirrorClient } from "."
import { TokenBalances,Tokens,TokenInfo } from "./tokenBaseClasses"


/**
 * Utility class for interacting with fungible tokens on the Hedera network.
 * This class provides methods to retrieve information about tokens, token balances,
 * and detailed token information.
 */
export class TokenUtils {
  constructor(private mirrorClient: BaseMirrorClient, private url: string) {}

  /**
   * Creates a new instance of TokenUtils using the v1 API endpoint.
   * @param mirrorClient The BaseMirrorClient instance for making API calls.
   * @returns A new TokenUtils instance configured for the v1 API.
   */
  static v1(mirrorClient: BaseMirrorClient) {
    return new this(mirrorClient, '/api/v1/tokens');
  }

  /**
   * Provides access to methods for retrieving information about multiple tokens.
   * This method allows querying tokens using various filters such as token ID, account ID, public key, and token type.
   * The underlying endpoint used is: GET /api/v1/tokens
   * @returns A Tokens instance for querying token data.
   */
  get Tokens() {
    return new Tokens(this.mirrorClient, this.url);
  }

  /**
   * Provides access to methods for retrieving token balance information.
   * This method allows fetching token balances for specific accounts or tokens.
   * The underlying endpoint used is: GET /api/v1/tokens/{tokenId}/balances
   * @returns A TokenBalances instance for querying token balance data.
   */
  get TokenBalance() {
    return new TokenBalances(this.mirrorClient, this.url);
  }

  /**
   * Provides access to methods for retrieving detailed information about a specific token type.
   * This method allows fetching comprehensive data for a "token type" using its token ID. Like what keys are set.
   * The underlying endpoint used is: GET /api/v1/tokens/{tokenId}
   * @returns A TokenInfo instance for querying detailed token information.
   */
  get TokenInfo() {
    return new TokenInfo(this.mirrorClient, this.url);
  }
}
