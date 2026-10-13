import type { ReactNode } from "react";

import type { BaseShadowCasterProps } from "@thewaver/ss-components";

export type ShadowCasterProps = BaseShadowCasterProps & {
    /** The content the effect is applied to. */
    children?: ReactNode;
};
