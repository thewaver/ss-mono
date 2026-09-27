import type { Store } from "@thewaver/ss-utils";

export type SelectionMode = "none" | "single" | "multiple";

export type SelectionGesture = {
    isToggling?: boolean;
    isExtending?: boolean;
};

export type SelectionDefs<T> = {
    getMode: () => SelectionMode;
    getItems: () => T[];
    selectionSignal: [get: () => T[], set: (value: T[]) => void];
};

export type SelectionController<T> = Store<T | undefined> & {
    pick: (item: T, gesture?: SelectionGesture) => void;
    selectAll: () => void;
    clear: () => void;
};

export type SelectionHandle<T> = {
    getAnchor: () => T | undefined;
    pick: (item: T, gesture?: SelectionGesture) => void;
    selectAll: () => void;
    clear: () => void;
};

export type SelectionBranchDefs<T> = {
    computeChildren: (item: T) => T[] | undefined;
};
