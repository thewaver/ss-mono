import type { BaseParticleSpawnerProps } from "@thewaver/ss-components";

export type ParticleSpawnerProps = BaseParticleSpawnerProps & {
    /**
     * Whether particles are being sent. Bind it with `bind:playback`. Paused, every particle of the round stays where it
     * is, and playing again carries on from there; once the last round is done, playing again starts the rounds over.
     * Sending when left out.
     */
    playback?: boolean;
    /**
     * How far through the current round the particles are, `0`–`1`. Bind it with `bind:progress`. The component writes
     * it as the round runs, and writing it moves the round there: while playing it carries on from the new point, and
     * with playback paused it scrubs, every particle drawn where it is at that point. It goes back to `0` at the start of
     * each round and when the count, the timing or the iteration patterns change.
     */
    progress?: number;
};
