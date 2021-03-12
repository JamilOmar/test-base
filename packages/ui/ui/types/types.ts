export interface SelectionEvent<T> {
    originalEvent: MouseEvent;
    value: T[];
}

/**
 * @description Generic Dictionary
 * @example const x: Dictionary<number> = { 'one': 1 };
 */
export interface Dictionary<T> {
    [Key: string]: T;
}
