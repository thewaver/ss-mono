import type { BaseParticleSpawnerProps } from "@thewaver/ss-components";

export type ParticleSpawnerProps = BaseParticleSpawnerProps & {
    /**
     * Whether particles are being sent. Paused, every particle of the round stays where it is, and playing again carries
     * on from there; once the last round is done, playing again starts the rounds over.
     */
    "playback"?: boolean;
    /** Receives a change of playback, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    /**
     * How far through the current round the particles are, `0`–`1`. The component writes it as the round runs, and
     * writing it moves the round there: while playing it carries on from the new point, and with playback paused it
     * scrubs, every particle drawn where it is at that point. It goes back to `0` at the start of each round and when
     * the count, the timing or the iteration patterns change.
     */
    "progress"?: number;
    /** Receives the round's progress as it runs, which is what `v-model:progress` binds. */
    "onUpdate:progress"?: (progress: number) => void;
};
