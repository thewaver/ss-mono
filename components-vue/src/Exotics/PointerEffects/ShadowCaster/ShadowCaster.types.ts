import type { VNodeChild } from "vue";

import type { BaseShadowCasterProps } from "@thewaver/ss-components";

export type ShadowCasterProps = BaseShadowCasterProps;

export type ShadowCasterSlots = {
    /** The content the effect is applied to. */
    default?: () => VNodeChild;
};
