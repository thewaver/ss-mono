import type { Snippet } from "svelte";

import type { BaseParticleSpawnerProps } from "@thewaver/ss-components";

export type ParticleSpawnerProps = BaseParticleSpawnerProps & {
    /**
     * Whether particles are being sent. Bind it with `bind:playback`; it is the only thing that starts or stops them.
     * Sending when left out.
     */
    playback?: boolean;
    /** Draws one particle, and is told how far along its path it is. */
    renderParticle: Snippet<[index: number, t: number]>;
};
