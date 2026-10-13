import type { Snippet } from "svelte";

import type { BasePlacementItemProps } from "@thewaver/ss-components";

export type PlacementItemProps = BasePlacementItemProps & {
    /** What the item holds. */
    children?: Snippet;
};
