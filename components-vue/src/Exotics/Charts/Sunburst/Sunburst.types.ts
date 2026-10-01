import type { VNodeChild } from "vue";

import type { SunburstArcState, SunburstNode } from "@thewaver/ss-components";

export type SunburstProps<T> = {
    /** Names the sunburst for assistive technology. */
    "ariaLabel": string;
    /** How many rings are drawn around the center. The center takes the room of one ring more. */
    "ringCount"?: number;
    /** How long a zoom takes. `0` jumps straight to the new level, which is the route for reduced motion. */
    "zoomDurationMs"?: number;
    /**
     * The whole tree. A leaf's share of its ring comes from its `weight` and a branch's from the total of its children,
     * so a weight set on a branch is ignored. A child weighing nothing gets no arc.
     */
    "root": SunburstNode<T>;
    /**
     * The branch at the center, whose children make the first ring. Both sides write it: the sunburst when an arc is
     * activated or Escape is pressed, the consumer to move it from outside — which is how a way back out is drawn, in
     * the middle or anywhere else. Leave it unbound and the sunburst keeps it itself, starting at the root. A node
     * that is not a branch of the current tree puts the root at the center.
     */
    "branch"?: SunburstNode<T>;
    /** Receives the sunburst's own zooms, which is what `v-model:branch` binds. */
    "onUpdate:branch"?: (branch: SunburstNode<T>) => void;
};

export type SunburstSlots<T> = {
    /**
     * Draws one arc inside the sunburst's own drawing, whose origin is the center. It is handed where the arc sits at
     * this moment, which changes on every frame of a zoom; `SunburstUtils.computeArcPath` turns that into a path.
     */
    renderArc: (props: { node: SunburstNode<T>; state: SunburstArcState }) => VNodeChild;
};
