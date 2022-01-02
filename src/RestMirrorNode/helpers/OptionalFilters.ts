export type OptionalFilters =
  | `gt:${string}`
  | `gte:${string}`
  | `lt:${string}`
  | `lte:${string}`
  | `ne:${string}`
  | string;

export const optionalFilters = {
  greaterThan(val: any): OptionalFilters {
    return `gt:${val}`;
  },
  greaterThanEqualTo(val: any): OptionalFilters {
    return `gte:${val}`;
  },
  lessThan(val: any): OptionalFilters {
    return `lt:${val}`;
  },
  lessThanEqualTo(val: any): OptionalFilters {
    return `lte:${val}`;
  },
  notEqualTo(val:any): OptionalFilters{
    return `ne:${val}`;
  },
  equalTo(val:any): OptionalFilters{
    return `eq:${val}`;
  }
}
