import type { ReactNode } from "react";

import type { BaseLightCatcherProps } from "@thewaver/ss-components";

export type LightCatcherProps = BaseLightCatcherProps & {
    /** The content the effect is applied to. */
    children?: ReactNode;
};
