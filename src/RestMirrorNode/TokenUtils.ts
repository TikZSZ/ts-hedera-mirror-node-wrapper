import { BaseMirrorClient } from "."
import { TokenBalances,Tokens,TokenInfo } from "./tokenBaseClasses"


export class TokenUtils{
  constructor(private mirrorClient: BaseMirrorClient, private url: string){}

  static v1(mirrorClient: BaseMirrorClient){
    return new this(mirrorClient, '/api/v1/tokens')
  }

  get Tokens(){
    return new Tokens(this.mirrorClient,this.url)
  }

  get TokenBalance(){
    return new TokenBalances(this.mirrorClient,this.url)
  }

  get TokenInfo(){
    return new TokenInfo(this.mirrorClient,this.url)
  }
}
