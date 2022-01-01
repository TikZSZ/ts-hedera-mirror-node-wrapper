import { BaseMirrorNode } from "./BaseMirrorNode";

interface Response {
  [k:string]:any,
  links?:{next:string}
}


export abstract class HasMoreMirrorNode<P,D extends Response> extends BaseMirrorNode<P,D>{
  private nextLink?:string
  protected override fetch = async () => {
    const res = await this.mirrorClient.fetch<D>(this.url,this.completeParams)
    this.nextLink = res.links?.next
    return res
  }

  async next():Promise<D|null>{
    if(!this.nextLink) return null
    const res = await this.mirrorClient.fetch<D>(this.nextLink,this.completeParams)
    this.nextLink = res.links?.next
    return res
  }
}