export type FlatRow<T> = {
    node: T;
    index: number;
    parentIndex: number | undefined;
    depth: number;
    position: number;
    setSize: number;
    isExpanded: boolean;
    isEntry: boolean;
    entryOffset: number;
    rows: FlatRow<T>[];
};

export type FlattenerDefs<T> = {
    computeChildren: (node: T) => T[] | undefined;
    computeIsBranch?: (node: T) => boolean;
    computeIsExpanded?: (node: T) => boolean;
    computeIsEntry?: (node: T) => boolean;
};
