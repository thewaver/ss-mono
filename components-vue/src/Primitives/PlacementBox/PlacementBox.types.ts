import type { VNodeChild } from "vue";

import type { BasePlacementBoxProps } from "@thewaver/ss-components";

export type PlacementBoxProps = BasePlacementBoxProps;

export type PlacementBoxSlots = {
    /** The items, each a `PlacementItem`. */
    default?: () => VNodeChild;
};
