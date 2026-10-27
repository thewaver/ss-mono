import type { Accessor, JSX } from "solid-js";

import type {
    BaseParticleDissolveCbs,
    BaseParticleDissolveValues,
    ParticleDissolveParticleDefs,
} from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type ParticleDissolveProps = AccessorValues<BaseParticleDissolveValues> &
    BaseParticleDissolveCbs & {
        /**
         * Draws one particle, given where it came from and the color of what it came from, and told how far through its
         * life it is. Called only for a spot of the content that is painted, so no particle rises from empty space.
         */
        renderParticle: (defs: ParticleDissolveParticleDefs, getT: Accessor<number>) => JSX.Element;
    };
