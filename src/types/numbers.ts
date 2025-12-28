export type PositiveNumber = number & { readonly __brand: "positive" };
export type StrictPositiveNumber = number & { readonly __brand: "strict_positive" };
