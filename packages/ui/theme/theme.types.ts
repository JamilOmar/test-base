export interface Dictionary<T> {
    [Key: string]: T;
}

export interface Theme {
    name: string;
    properties: Dictionary<string>;
    extend?: string;
}
