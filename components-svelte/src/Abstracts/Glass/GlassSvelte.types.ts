import type { GlassDefs } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type GlassSheenFilterProps = {
    /** The id the filter carries. */
    filterId: string;
    /** The element the pointer is tracked over. Without one the highlight sits wherever the tracker rests. */
    element: HTMLElement | undefined;
    /** The element's current size, which the pointer's position is scaled against. */
    size: Size2d;
    /** The glass description, filled out. */
    defs: GlassDefs;
};
