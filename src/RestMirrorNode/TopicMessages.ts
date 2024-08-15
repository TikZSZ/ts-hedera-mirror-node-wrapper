import { filterKeys } from "./helpers/filterKeys";
import { BaseMirrorClient,OptionalFilters } from "./";
import { HasMoreMirrorNode } from "./baseClasses/HasMoreMirrorNode";

interface ConsensusParams {
  [filterKeys.SEQUENCE_NUMBER]: OptionalFilters;
}
type MessageResponseType<T> = T extends number ? Message : MessagesResponse;

export class TopicMessages<T extends number | null = null> extends HasMoreMirrorNode<ConsensusParams, MessageResponseType<T>> {
  protected params: Partial<ConsensusParams> = {};
  private sequenceNumber:number|null = null 
  constructor(mirrorNodeClient:BaseMirrorClient,protected url:string,private topicId?:string){
    super(mirrorNodeClient)
  }
  static v1(mirrorNodeClient:BaseMirrorClient,topicId?:string){
    return new this(mirrorNodeClient,`/api/v1/topics`,topicId)
  }

  setSequenceNumber<S extends OptionalFilters | number>(val: S): TopicMessages<S extends number ? S : null> {
    if (typeof val === "number") {
      (this as any).sequenceNumber = val;
      return this as any;
    }
    this.params[filterKeys.SEQUENCE_NUMBER] = val;
    return this as any;
  }
  
  setTopicId(val:string){
    this.topicId = val
    return this;
  }

  protected override get completeParams(): { order?: "asc" | "desc" | undefined; limit?: number | undefined; timestamp?: string | undefined; } & Partial<ConsensusParams> {
      const params = super.completeParams
      if(this.sequenceNumber){
        console.warn("Sequence number is set query strings will be ignored")
        return {}
      }
      return params
  }

  async get(){
    if (!this.topicId) {
      throw new Error("Topic ID must be set before calling get()");
    }
    let url = this.url
    if(this.sequenceNumber){
      url = `${this.url}/${this.topicId}/messages/${this.sequenceNumber}`
    }else{
      url = `${this.url}/${this.topicId}/messages`
    }
    console.debug(url,this.params)
    return this.fetch(url)
  }
}

export interface MessagesResponse {
  links: Links;
  messages: Message[];
}

interface Message {
  chunk_info: Chunkinfo;
  consensus_timestamp: string;
  message: string;
  payer_account_id: string;
  running_hash: string;
  running_hash_version: number;
  sequence_number: number;
  topic_id: string;
}

interface Chunkinfo {
  initial_transaction_id: Initialtransactionid;
  number: number;
  total: number;
}

interface Initialtransactionid {
  account_id: string;
  nonce: number;
  scheduled: boolean;
  transaction_valid_start: string;
}

interface Links {
  next: string;
}

