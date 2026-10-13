import type { Snippet } from "svelte";

import type { BasePlacementBoxProps } from "@thewaver/ss-components";

export type PlacementBoxProps = BasePlacementBoxProps & {
    /**
     * The box element, so a consumer can measure it. Bind it with `bind:ref`; it reads `undefined` until the element
     * exists and again once it is gone.
     */
    ref?: HTMLElement;
    /** The items, each a `PlacementItem`. */
    children?: Snippet;
};
