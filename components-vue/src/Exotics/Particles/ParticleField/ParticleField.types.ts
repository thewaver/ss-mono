import type { BaseParticleFieldProps } from "@thewaver/ss-components";

export type ParticleFieldProps = BaseParticleFieldProps & {
    /** Whether the field is running. It is the only thing that starts or pauses it, and a pause freezes every particle. */
    "playback"?: boolean;
    /** Receives a change of playback, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    /**
     * How far through the current pass the field is, `0`–`1`. The component writes it as the pass runs, and writing it
     * moves the pass there: while playing it carries on from the new point, and with playback paused it scrubs.
     */
    "progress"?: number;
    /** Receives the pass's progress as it runs, which is what `v-model:progress` binds. */
    "onUpdate:progress"?: (progress: number) => void;
};
