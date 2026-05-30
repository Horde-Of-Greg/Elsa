export type PositiveNumber = number & { readonly __positive: true };
export type StrictPositiveNumber = PositiveNumber & { readonly __strict_positive: true };
