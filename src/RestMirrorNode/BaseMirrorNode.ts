import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BasicParams } from "./BasicParams";
import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";

interface Response {
  [k:string]:any,
  links?:{next:string}
}

export class BaseMirrorNode<P,D extends Response> {
  constructor(protected mirrorClient:BaseMirrorClient){}
  private basicParams: Partial<BasicParams> = {};
  protected params: Partial<P> = {}
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

  protected setURLAndFetch = (url:string):Promise<D> =>{
    this.mirrorClient.setUrl(url)
    return this.mirrorClient.fetch(this.completeParams)
  }
}

