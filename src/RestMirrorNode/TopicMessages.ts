import { filterKeys } from "./helpers/filterKeys";
import { BaseMirrorClient,OptionalFilters } from "./";
import { HasMoreMirrorNode } from "./baseClasses/HasMoreMirrorNode";

interface ConsensusParams {
  [filterKeys.SEQUENCE_NUMBER]: OptionalFilters;
}

export class TopicMessages extends HasMoreMirrorNode<ConsensusParams,MessagesResponse> {
  protected params: Partial<ConsensusParams> = {};
  constructor(mirrorNodeClient:BaseMirrorClient,protected url:string,private topicId?:string){
    super(mirrorNodeClient)
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
    return this.fetch(`${this.url}/${this.topicId}/messages`)
  }
}

export interface MessagesResponse {
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

