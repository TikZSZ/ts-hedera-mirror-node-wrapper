export * from "./RestMirrorNode"
export * from "./AxiosMirrorNodeClient"
export * from "./FetchClient"

import { Accounts, NetworkSupply, TopicMessages, Transactions } from "./"
import { BaseMirrorClient, TokenUtils, NFTUtils, SmartContracts } from "./RestMirrorNode"
export const accounts = (client:BaseMirrorClient) => Accounts.v1(client)
export const topicMessages = (client:BaseMirrorClient) => TopicMessages.v1(client)
export const networkSupply = (client:BaseMirrorClient) => NetworkSupply.v1(client)
export const transactions = (client:BaseMirrorClient) => Transactions.v1(client)
export const tokenUtils = (client:BaseMirrorClient) => TokenUtils.v1(client)
export const nftUtils = (client:BaseMirrorClient) => NFTUtils.v1(client)
export const smartContract = (client:BaseMirrorClient) => SmartContracts.v1(client)

