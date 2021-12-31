import { AxiosInstance } from "axios"

export interface BaseMirrorClient{
  url:string|null;
  baseURL:string;
  fetch<D = any>(params:any):Promise<D>
  setUrl(url:string):void
}

