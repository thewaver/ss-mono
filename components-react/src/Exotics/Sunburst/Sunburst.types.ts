import type { ReactNode } from "react";

import type { SunburstArcState, SunburstNode } from "@thewaver/ss-components";

export type SunburstProps<T> = {
    /** Names the sunburst for assistive technology. */
    ariaLabel: string;
    /** How many rings are drawn around the center. The center takes the room of one ring more. */
    ringCount?: number;
    /** How long a zoom takes. `0` jumps straight to the new level, which is the route for reduced motion. */
    zoomDurationMs?: number;
    /**
     * The whole tree. A leaf's share of its ring comes from its `weight` and a branch's from the total of its children,
     * so a weight set on a branch is ignored. A child weighing nothing gets no arc.
     */
    root: SunburstNode<T>;
    /**
     * The branch at the center, whose children make the first ring, and how to change it. Both sides write it: the
     * sunburst when an arc is activated or Escape is pressed, the consumer to move it from outside — which is how a
     * way back out is drawn, in the middle or anywhere else. Leave it out and the sunburst keeps it itself, starting
     * at the root. A node that is not a branch of the current tree puts the root at the center.
     */
    branchState?: readonly [SunburstNode<T>, (value: SunburstNode<T>) => void];
    /**
     * Draws one arc inside the sunburst's own drawing, whose origin is the center. It is handed where the arc sits at
     * this moment, which changes on every frame of a zoom; `SunburstUtils.computeArcPath` turns that into a path.
     */
    renderArc: (node: SunburstNode<T>, state: SunburstArcState) => ReactNode;
};
