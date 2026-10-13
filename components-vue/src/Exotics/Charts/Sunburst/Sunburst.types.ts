import type { VNodeChild } from "vue";

import type { BaseSunburstProps, SunburstArcState, SunburstNode } from "@thewaver/ss-components";

export type SunburstProps<T> = BaseSunburstProps<T> & {
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
