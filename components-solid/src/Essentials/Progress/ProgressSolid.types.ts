import type { JSX } from "solid-js";

import type { BaseProgressValues, ProgressState } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues } from "../../Utils/typeUtils";

export type ProgressProps = AccessorValues<BaseProgressValues> &
    AccessorProps<{
        /** Draws the bar, and is told how far along it is. */
        renderContent: (getState: () => ProgressState) => JSX.Element;
    }>;
