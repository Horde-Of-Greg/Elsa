export interface Resettable {
    reset(): void;
}

export interface ResettableAsync {
    reset(): Promise<void>;
}
