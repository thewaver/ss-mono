import type { ReactNode } from "react";

import type { BaseParticleDissolveProps } from "@thewaver/ss-components";

export type ParticleDissolveProps = BaseParticleDissolveProps & {
    /** The content that dissolves and rebuilds. */
    children?: ReactNode;
};
