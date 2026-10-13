import type { Snippet } from "svelte";

import type { BaseLabelProps } from "@thewaver/ss-components";

export type LabelProps = BaseLabelProps & {
    /** The caption and the control it names. */
    children?: Snippet;
};
