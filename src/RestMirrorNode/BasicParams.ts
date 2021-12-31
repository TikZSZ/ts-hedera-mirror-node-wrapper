import { filterKeys } from "./filterKeys";
import { OptionalFilters } from "./OptionalFilters";

export interface BasicParams {
  [filterKeys.ORDER]: "asc" | "desc";
  [filterKeys.LIMIT]: number;
  [filterKeys.TIMESTAMP]: OptionalFilters;
}
