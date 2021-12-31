import { AxiosInstance } from "axios";
import { BaseMirrorNode } from "./BaseMirrorNode";
import { filterKeys } from "./filterKeys";
import { BaseMirrorClient } from "./BaseMirrorClient";
import { OptionalFilters } from "./OptionalFilters";
import { Cursor } from "./Cursor";

interface ConsensusParams {
  [filterKeys.SEQUENCE_NUMBER]: OptionalFilters;
  [filterKeys.TOPIC_ID]:string;
}


export class TopicMessages extends BaseMirrorNode<ConsensusParams,RootObject> {
  protected params: Partial<ConsensusParams> = {};
  private cursor:Cursor<RootObject>
  constructor(private mirrorNodeClient:BaseMirrorClient,private topicId:string){
    super(mirrorNodeClient)
    this.cursor = new Cursor(this.setURLAndFetch)
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
    const res = await this.setURLAndFetch(`/api/v1/topics/${this.topicId}/messages`)
    this.cursor.link = res.links.next
    return res
  }
  get next(){
    return this.cursor.next
  }
}

interface RootObject {
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