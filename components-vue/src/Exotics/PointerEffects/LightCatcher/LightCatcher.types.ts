import type { VNodeChild } from "vue";

import type { BaseLightCatcherProps } from "@thewaver/ss-components";

export type LightCatcherProps = BaseLightCatcherProps;

export type LightCatcherSlots = {
    /** The content the effect is applied to. */
    default?: () => VNodeChild;
};
