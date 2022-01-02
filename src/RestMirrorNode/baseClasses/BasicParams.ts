import { filterKeys, OptionalFilters } from "..";

export interface BasicParams {
  [filterKeys.ORDER]: "asc" | "desc";
  [filterKeys.LIMIT]: number;
  [filterKeys.TIMESTAMP]: OptionalFilters;
}
