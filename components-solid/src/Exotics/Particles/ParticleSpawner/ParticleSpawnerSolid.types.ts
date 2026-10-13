import type { Accessor, JSX } from "solid-js";

import type { BaseParticleSpawnerCbs, BaseParticleSpawnerValues } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type ParticleSpawnerProps = AccessorValues<BaseParticleSpawnerValues> &
    BaseParticleSpawnerCbs & {
        /** Whether particles are being sent. It is the only thing that starts or stops them. */
        playback?: SignalSource<boolean>;
        /** Draws one particle, and is told how far along its path it is. */
        renderParticle: (index: number, getT: Accessor<number>) => JSX.Element;
    };
