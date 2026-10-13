import type { ParentProps } from "solid-js";

import type { BasePlacementBoxCbs, BasePlacementBoxValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../Utils/typeUtils";

export type PlacementBoxProps = ParentProps<
    AccessorValues<BasePlacementBoxValues> &
        BasePlacementBoxCbs & {
            /** Receives the box element once it exists, so a consumer can measure it. */
            ref?: (element: HTMLElement) => void;
        }
>;
