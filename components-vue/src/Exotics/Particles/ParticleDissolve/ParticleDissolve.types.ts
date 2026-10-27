import type { VNodeChild } from "vue";

import type { BaseParticleDissolveProps, ParticleDissolveParticleDefs } from "@thewaver/ss-components";

export type ParticleDissolveProps = BaseParticleDissolveProps;

export type ParticleDissolveSlots = {
    /** The content that dissolves and rebuilds. */
    default?: () => VNodeChild;
    /**
     * Draws one particle, given where it came from and the color of what it came from, and told how far through its
     * life it is. Called only for a spot of the content that is painted, so no particle rises from empty space.
     */
    renderParticle: (props: { defs: ParticleDissolveParticleDefs; t: number }) => VNodeChild;
};
