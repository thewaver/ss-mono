import type { ReactNode } from "react";

import type { BaseRGBSplitterProps } from "@thewaver/ss-components";

export type RGBSplitterProps = BaseRGBSplitterProps & {
    /** The content the effect is applied to. */
    children?: ReactNode;
};
