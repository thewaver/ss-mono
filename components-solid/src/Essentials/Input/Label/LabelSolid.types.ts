import type { ParentProps } from "solid-js";

import type { LabelOrientation } from "@thewaver/ss-components";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type LabelProps = ParentProps<
    AccessorProps<{
        /** Whether the caption sits beside the control or above it. */
        orientation?: LabelOrientation;
        /** The space between the caption and the control. */
        gap?: number;
    }>
>;
