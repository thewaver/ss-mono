import type { ReactNode } from "react";

import type { BaseParticleSpawnerProps } from "@thewaver/ss-components";

export type ParticleSpawnerProps = BaseParticleSpawnerProps & {
    /** Whether particles are being sent. It is the only thing that starts or stops them. */
    playback?: readonly [boolean, (value: boolean) => void];
    /** Draws one particle, and is told how far along its path it is. */
    renderParticle: (index: number, t: number) => ReactNode;
};
