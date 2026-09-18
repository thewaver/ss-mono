import type { ParentProps } from "solid-js";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type LabelDir = "column" | "row";

export type LabelProps = ParentProps<
    AccessorProps<{
        /** Whether the caption sits beside the control or above it. */
        dir?: LabelDir;
        /** The space between the caption and the control. */
        gap?: number;
    }>
>;
