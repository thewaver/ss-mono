import type { ReactNode } from "react";

import type { BaseProgressProps, ProgressState } from "@thewaver/ss-components";

export type ProgressProps = BaseProgressProps & {
    /** Draws the bar, and is told how far along it is. */
    renderContent: (state: ProgressState) => ReactNode;
};
