import type { BaseParticleSpawnerProps } from "@thewaver/ss-components";

export type ParticleSpawnerProps = BaseParticleSpawnerProps & {
    /** Whether particles are being sent. It is the only thing that starts or stops them. */
    playback?: readonly [boolean, (value: boolean) => void];
};
