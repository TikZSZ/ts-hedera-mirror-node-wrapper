import { filterKeys } from "./helpers/filterKeys";
import { BaseMirrorClient,OptionalFilters } from "./";
import { HasMoreMirrorNode } from "./baseClasses/HasMoreMirrorNode";

interface SmartContractsParams {
  [filterKeys.CONTRACT_ID]: OptionalFilters;
}

export class SmartContracts extends HasMoreMirrorNode<SmartContractsParams,ContractResponse> {
  protected params: Partial<SmartContractsParams> = {};
  constructor(mirrorNodeClient:BaseMirrorClient,url:string,private topicId?:string){
    super(mirrorNodeClient,url)
  }

  static v1(mirrorNodeClient:BaseMirrorClient,topicId?:string){
    return new this(mirrorNodeClient,`/api/v1/contracts`,topicId)
  }

  setSmartContractId(val: SmartContractsParams['contract.id']) {
    this.params[filterKeys.CONTRACT_ID] = val;
    return this;
  }

  async get(){
    return this.fetch()
  }
}


export interface ContractResponse {
  contracts: Contract[];
  links: Links;
}

interface Links {
  next: string;
}

interface Contract {
  admin_key: Adminkey;
  auto_renew_period: number;
  contract_id: string;
  created_timestamp: string;
  deleted: boolean;
  expiration_timestamp?: any;
  file_id: string;
  memo: string;
  obtainer_id?: any;
  proxy_account_id?: any;
  solidity_address: string;
  timestamp: Timestamp;
}

interface Timestamp {
  from: string;
  to?: any;
}

interface Adminkey {
  _type: string;
  key: string;
}
