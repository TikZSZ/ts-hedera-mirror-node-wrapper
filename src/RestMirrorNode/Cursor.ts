export class Cursor<T extends {links:{next:string}}>{
  private  nextLink?:string = ''
  constructor(private fetch:(url:string)=>Promise<any>){}
  next = async ():Promise<T> => {
    if(!this.nextLink) return {} as any
    const res = await this.fetch(this.nextLink)
    this.nextLink = res.links.next
    return res
  }

  set link(link:string){
    this.nextLink = link
  }
}