import type { PropsWithChildren } from "react";

import type { LabelOrientation } from "@thewaver/ss-components";

export type LabelProps = PropsWithChildren<{
    /** Whether the caption sits beside the control or above it. */
    orientation?: LabelOrientation;
    /** The space between the caption and the control. */
    gap?: number;
}>;
