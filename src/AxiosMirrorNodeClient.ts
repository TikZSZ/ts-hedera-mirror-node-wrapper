import axios, { AxiosInstance } from "axios"
import { BaseMirrorClient,Params } from "./"

class AxiosClient implements BaseMirrorClient{
  private baseApi:AxiosInstance
  constructor(public baseURL:string){
    if (this.baseURL.endsWith('/')) {
      this.baseURL = this.baseURL.slice(0, -1);
    }
    
    this.baseApi = axios.create({ baseURL: this.baseURL });
  }
  public async fetch<D=any>(url:string,params:Params):Promise<D>{
    if(!this.baseURL) throw new Error('no url set')
    const response = await this.baseApi.get(url,{params})
    return response.data
  }
}

export {AxiosClient as AxiosClient}



