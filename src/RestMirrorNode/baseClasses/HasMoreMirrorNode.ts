import { filterKeys, OptionalFilters } from "..";
import { BaseMirrorNode } from "./BaseMirrorNode";
import {BasicParams} from "."
interface Response {
  [k:string]:any,
  links?:{next?:string}
}



export abstract class HasMoreMirrorNode<P,D extends Response> extends BaseMirrorNode<D>{
  private nextLink?:string
  private basicParams: Partial<BasicParams> = {};
  protected abstract params: Partial<P> 
  protected override fetch = async<T extends Response = D>(url:string) => {
    const res = await this.mirrorClient.fetch<T>(url,this.completeParams)
    this.nextLink = res.links?.next
    return res
  }
  order(order: "asc" | "desc") {
    this.basicParams[filterKeys.ORDER] = order;
    return this;
  }
  setLimit(limit: number) {
    this.basicParams[filterKeys.LIMIT] = limit;
    return this;
  }
  timestamp(timestamp: OptionalFilters) {
    this.basicParams[filterKeys.TIMESTAMP] = timestamp;
    return this;
  }

  protected get completeParams(){
    return {...this.basicParams,...this.params}
  }

  async next():Promise<D|null>{
    if(!this.nextLink) return null
    const res = await this.mirrorClient.fetch<D>(this.nextLink,{})
    this.nextLink = res.links?.next
    return res
  }
}