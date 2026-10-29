import type { VNodeChild } from "vue";

import type { BaseParticleDissolveProps } from "@thewaver/ss-components";

export type ParticleDissolveProps = BaseParticleDissolveProps;

export type ParticleDissolveSlots = {
    /** The content that dissolves and rebuilds. */
    default?: () => VNodeChild;
};
