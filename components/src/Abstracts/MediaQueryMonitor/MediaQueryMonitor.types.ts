import type { Store } from "@thewaver/ss-utils";

export type MediaQueryWatcher = Store<boolean> & {
    observe: () => () => void;
};
