import type { VNodeChild } from "vue";

import type { BaseProximityTextProps } from "@thewaver/ss-components";

export type ProximityTextProps = BaseProximityTextProps;

export type ProximityTextSlots = {
    /** The text, with whatever markup, links and images it carries. It is measured, then redrawn letter by letter. */
    default?: () => VNodeChild;
};
