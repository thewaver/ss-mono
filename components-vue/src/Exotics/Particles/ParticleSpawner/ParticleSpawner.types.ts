import type { VNodeChild } from "vue";

import type { BaseParticleSpawnerProps } from "@thewaver/ss-components";

export type ParticleSpawnerProps = BaseParticleSpawnerProps & {
    /** Whether particles are being sent. It is the only thing that starts or stops them. */
    "playback"?: boolean;
    /** Receives a change of playback, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
};

export type ParticleSpawnerSlots = {
    /** Draws one particle, and is told how far along its path it is. */
    renderParticle: (props: { index: number; t: number }) => VNodeChild;
};
