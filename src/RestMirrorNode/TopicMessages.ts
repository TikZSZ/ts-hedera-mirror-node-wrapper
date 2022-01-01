import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";
import { HasMoreMirrorNode } from "./HasMoreMirrorNode";

interface ConsensusParams {
  [filterKeys.SEQUENCE_NUMBER]: OptionalFilters;
}


export class TopicMessages extends HasMoreMirrorNode<ConsensusParams,MessagesResponse> {
  protected params: Partial<ConsensusParams> = {};
  constructor(mirrorNodeClient:BaseMirrorClient,url:string,private topicId?:string){
    super(mirrorNodeClient,url)

  }

  static v1(mirrorNodeClient:BaseMirrorClient,topicId?:string){
    return new this(mirrorNodeClient,`/api/v1/topics`,topicId)
  }

  sequenceNumber(val: ConsensusParams['sequencenumber']) {
    this.params[filterKeys.SEQUENCE_NUMBER] = val;
    return this;
  }

  setTopicId(val:string){
    this.topicId = val
    return this;
  }

  async get(){
    this.setURL(`${this.url}/${this.topicId}/messages`)
    return this.fetch()
  }
}

interface MessagesResponse {
  links: Links;
  messages: Message[];
}

interface Message {
  consensus_timestamp: string;
  topic_id: string;
  message: string;
  running_hash: string;
  running_hash_version: number;
  sequence_number: number;
}

interface Links {
  next: string;
}

