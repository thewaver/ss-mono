import type { VNodeChild } from "vue";

import type { BasePlacementItemProps } from "@thewaver/ss-components";

export type PlacementItemProps = BasePlacementItemProps;

export type PlacementItemSlots = {
    /** What the item holds. */
    default?: () => VNodeChild;
};
