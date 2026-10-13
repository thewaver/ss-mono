import type { ReactNode } from "react";

import type { BaseProximityTextProps } from "@thewaver/ss-components";

export type ProximityTextProps = BaseProximityTextProps & {
    /** The text whose letters answer to the point, with whatever markup, links and images it carries. */
    children?: ReactNode;
};
