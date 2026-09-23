import type { ParentProps } from "solid-js";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type LabelOrientation = "horizontal" | "vertical";

export type LabelProps = ParentProps<
    AccessorProps<{
        /** Whether the caption sits beside the control or above it. */
        orientation?: LabelOrientation;
        /** The space between the caption and the control. */
        gap?: number;
    }>
>;
