import type { PropsWithChildren } from "react";

import type { BasePlacementBoxProps } from "@thewaver/ss-components";

export type PlacementBoxProps = PropsWithChildren<
    BasePlacementBoxProps & {
        /**
         * Receives the box element once it exists, so a consumer can measure it, and `null` once it is gone.
         */
        ref?: (element: HTMLElement | null) => void;
    }
>;
