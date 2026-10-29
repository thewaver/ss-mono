import type { BaseParticleFieldCbs, BaseParticleFieldValues } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type ParticleFieldProps = AccessorValues<BaseParticleFieldValues> &
    BaseParticleFieldCbs & {
        /** Whether the field is running. It is the only thing that starts or pauses it, and a pause freezes every particle. */
        playback?: SignalSource<boolean>;
        /**
         * How far through the current pass the field is, `0`–`1`. The component writes it as the pass runs, and writing it
         * moves the pass there: while playing it carries on from the new point, and with playback paused it scrubs.
         */
        progress?: SignalSource<number>;
    };
