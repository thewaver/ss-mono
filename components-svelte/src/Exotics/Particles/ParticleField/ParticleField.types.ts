import type { BaseParticleFieldProps } from "@thewaver/ss-components";

export type ParticleFieldProps = BaseParticleFieldProps & {
    /**
     * Whether the field is running. Bind it with `bind:playback`; it is the only thing that starts or pauses it, and a
     * pause freezes every particle. Running when left out.
     */
    playback?: boolean;
    /**
     * How far through the current pass the field is, `0`–`1`. Bind it with `bind:progress`. The component writes it
     * as the pass runs, and writing it moves the pass there: while playing it carries on from the new point, and with
     * playback paused it scrubs.
     */
    progress?: number;
};
