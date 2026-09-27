import type { Store } from "@thewaver/ss-utils";

export type TypeaheadDefs = {
    getTimeoutMs?: () => number | undefined;
};

export type TypeaheadHandle = {
    getQuery: () => string;
    push: (e: KeyboardEvent) => string | undefined;
    clear: () => void;
};

export type TypeaheadBuffer = Store<string> & {
    push: (e: KeyboardEvent) => string | undefined;
    clear: () => void;
};
