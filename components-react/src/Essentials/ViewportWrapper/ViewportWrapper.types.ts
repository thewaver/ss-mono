import type { ReactNode } from "react";

import type { BaseViewportWrapperProps } from "@thewaver/ss-components";

export type ViewportWrapperProps = BaseViewportWrapperProps & {
    /** What is laid out inside the viewport, at its design size. */
    children?: ReactNode;
};
