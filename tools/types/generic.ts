export type Brand<Value, BrandName extends string> = Value & {
    readonly __brand: BrandName;
};
