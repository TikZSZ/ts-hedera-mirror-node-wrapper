export type OptionalFilters =
  | `gt:${string}`
  | `gte:${string}`
  | `lt:${string}`
  | `lte:${string}`
  | string;

export function greaterThan(val: any): OptionalFilters {
  return `gt:${val}`;
}
export function greaterThanEqualTo(val: any): OptionalFilters {
  return `gte:${val}`;
}
export function lessThan(val: any): OptionalFilters {
  return `lt:${val}`;
}
export function lessThanEqualTo(val: any): OptionalFilters {
  return `lte:${val}`;
}

