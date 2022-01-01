import { BasicParams } from "./BasicParams";
import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";


export abstract class BaseMirrorNode<P,D> {
  constructor(protected mirrorClient:BaseMirrorClient,protected url:string){}
  private basicParams: Partial<BasicParams> = {};
  protected abstract params: Partial<P> 
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
  protected get completeParams() {
    return { ...this.params, ...this.basicParams };
  }
  protected fetch = () =>{
    return this.mirrorClient.fetch<D>(this.url,this.completeParams)
  }
  protected setURL(url:string){
    this.url = url
  }
}

