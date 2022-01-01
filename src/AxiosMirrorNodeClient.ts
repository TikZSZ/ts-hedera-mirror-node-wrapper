import axios, { AxiosInstance } from "axios"
import { BaseMirrorClient,Params } from "./RestMirrorNode/BaseMirrorClient"
import { Accounts, NetworkSupply, TopicMessages, Transactions } from "./RestMirrorNode"
class AxiosClient implements BaseMirrorClient{
  private baseApi:AxiosInstance
  constructor(public baseURL:string){
    this.baseApi = axios.create({baseURL:this.baseURL})
  }
  public async fetch<D=any>(url:string,params:Params):Promise<D>{
    if(!this.baseURL) throw new Error('no url set')
    const response = await this.baseApi.get(url,{params})
    return response.data
  }
}

export const accounts = (client:BaseMirrorClient) => Accounts.v1(client)
export const topicMessages = (client:BaseMirrorClient) => TopicMessages.v1(client)
export const networkSupply = (client:BaseMirrorClient) => NetworkSupply.v1(client)
export const transactions = (client:BaseMirrorClient) => Transactions.v1(client)

export {AxiosClient as Client}



