import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type SplitPaneExampleProps = AccessorProps<{
    gutterSize: number;
    isDisabled: boolean;
}> & {
    ratiosSignal: Signal<number[]>;
};
