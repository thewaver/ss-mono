import type { Snippet } from "svelte";

import type { BaseProximityTextProps } from "@thewaver/ss-components";

export type ProximityTextProps = BaseProximityTextProps & {
    /**
     * The text whose letters answer the point, with whatever markup, links and images it carries. It is measured,
     * then redrawn.
     */
    children?: Snippet;
};
