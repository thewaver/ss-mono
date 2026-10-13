import type { ReactNode } from "react";

import type { BaseEdgeFaderProps } from "@thewaver/ss-components";

export type EdgeFaderProps = BaseEdgeFaderProps & {
    /** The content that scrolls inside the box and is faded at its edges. */
    children?: ReactNode;
};
