import type { ParentProps } from "solid-js";

import type { AccessorProps } from "../../Utils/typeUtils";

export type EdgeFaderEdge = "top" | "right" | "bottom" | "left";

export type EdgeFaderProps = ParentProps<
    AccessorProps<{
        /** Which sides of the box fade out. Any mix of the four; an empty list fades nothing. */
        edges?: EdgeFaderEdge[];
        /** How far in from each chosen side the fade reaches, in pixels. */
        size?: number;
        /**
         * Whether a side fades only while there is more to scroll to past it. The fade shrinks as that end is
         * approached and is gone once it is reached, so a box whose contents fit shows no fade at all. Left off, the
         * chosen sides are always faded, scrolling or not.
         */
        isScrollAware?: boolean;
        /**
         * What the box is called while it scrolls. Given, a scrolling box is announced as a region by this name; left
         * off, it is still reachable by keyboard when it needs to be, but unnamed. A box that does not scroll ignores it.
         */
        ariaLabel?: string;
    }>
>;
