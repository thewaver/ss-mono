import type { ReactNode } from "react";

import type { CirclePackingCircleState, CirclePackingNode } from "@thewaver/ss-components";

export type CirclePackingProps<T> = {
    /** Names the circle packing for assistive technology. */
    ariaLabel: string;
    /** The space left between neighboring circles and around the inside of their parent, in pixels. */
    padding?: number;
    /** How long a zoom takes. `0` jumps straight to the new view, which is the route for reduced motion. */
    zoomDurationMs?: number;
    /**
     * The whole tree. A leaf's area comes from its `weight` and a branch is packed around its children, so a weight set
     * on a branch is ignored. A child weighing nothing gets no circle.
     */
    root: CirclePackingNode<T>;
    /**
     * The branch whose circle fills the view, and how to change it. Both sides write it: the component when a circle
     * is activated, when a press lands on nothing it can zoom into — which goes back to the root — or when Escape is
     * pressed, which goes up one level; the consumer to move it from outside. Leave it out and the component keeps it
     * itself, starting at the root. A node that is not a branch of the current tree shows the root.
     */
    branch?: readonly [CirclePackingNode<T>, (value: CirclePackingNode<T>) => void];
    /**
     * Draws one circle inside the component's own drawing, whose origin is the center. It is handed where the circle
     * sits at this moment, which changes on every frame of a zoom.
     */
    renderCircle: (node: CirclePackingNode<T>, state: CirclePackingCircleState) => ReactNode;
    /**
     * Draws one circle's label in a layer above every circle, so no circle drawn later can cover it. The layer takes no
     * pointer and is hidden from assistive technology, so the name a reader hears has to come from `renderCircle`.
     */
    renderLabel?: (node: CirclePackingNode<T>, state: CirclePackingCircleState) => ReactNode;
};
