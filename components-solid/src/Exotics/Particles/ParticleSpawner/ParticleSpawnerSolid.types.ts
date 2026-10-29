import type { BaseParticleSpawnerCbs, BaseParticleSpawnerValues } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type ParticleSpawnerProps = AccessorValues<BaseParticleSpawnerValues> &
    BaseParticleSpawnerCbs & {
        /** Whether particles are being sent. It is the only thing that starts or stops them. */
        playback?: SignalSource<boolean>;
    };
