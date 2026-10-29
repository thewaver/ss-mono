import type { BaseParticleDissolveCbs, BaseParticleDissolveValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type ParticleDissolveProps = AccessorValues<BaseParticleDissolveValues> & BaseParticleDissolveCbs;
