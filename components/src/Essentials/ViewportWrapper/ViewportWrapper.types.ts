import { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

export type ViewportWrapperProps = AccessorProps<{
    /**
     * The size everything inside is laid out against. The contents are scaled to the real window from it, so a layout
     * can be written once at one size.
     */
    size: Size2d;
}>;
