import type { Snippet } from "svelte";

import type { BaseParticleDissolveProps } from "@thewaver/ss-components";

export type ParticleDissolveProps = BaseParticleDissolveProps & {
    /** The content that dissolves and rebuilds. */
    children?: Snippet;
};
