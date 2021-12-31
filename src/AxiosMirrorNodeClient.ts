import axios, { AxiosInstance } from "axios"
import { BaseMirrorClient } from "./RestMirrorNode/BaseMirrorClient"

class AxiosClient implements BaseMirrorClient{
  private baseApi:AxiosInstance
  constructor(public baseURL:string){
    this.baseApi = axios.create({baseURL:baseURL})
  }
  public url:BaseMirrorClient['url'] = null
  async fetch(params:any){
    if(!this.url) throw new Error('no url set')
    return (await this.baseApi.get(this.url,{params})).data
  }
  public setUrl(url:string){
    this.url = url
  }
}

export const axiosMirrorClient = new AxiosClient('https://testnet.mirrornode.hedera.com')