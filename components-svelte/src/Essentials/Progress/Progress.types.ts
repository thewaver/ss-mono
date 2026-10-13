import type { Snippet } from "svelte";

import type { BaseProgressProps, ProgressState } from "@thewaver/ss-components";

export type ProgressProps = BaseProgressProps & {
    /** Draws the bar, and is told how far along it is. */
    renderContent: Snippet<[state: ProgressState]>;
};
