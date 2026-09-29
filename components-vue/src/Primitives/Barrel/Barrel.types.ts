import type { VNodeChild } from "vue";

import type { BarrelAxis, BarrelFace, BarrelFaceDefs } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type BarrelProps<T> = {
    /** How far the barrel is turned, in degrees. It is the only thing that turns it. */
    angle: number;
    /** Which way round the barrel turns. */
    axis?: BarrelAxis;
    /** How large one face is. */
    faceSize?: Size2d;
    /** Whether the faces have backs, for a barrel whose faces are seen from behind as it turns. */
    hasBacks?: boolean;
    /** How long a turn takes. */
    transitionDurationMs?: number;
    /** How long the barrel waits before starting a turn. */
    transitionDelayMs?: number;
    /** What a face is called when it is announced, so a reader hears slide or card rather than group. */
    faceRoleDescription: string;
    /** How one face is placed and drawn, for a barrel whose faces are not evenly spaced. */
    computeFaceDefs: (index: number, face: BarrelFace) => BarrelFaceDefs;
    /** The faces, in the order they sit round the barrel. */
    faces: T[];
};

export type BarrelSlots<T> = {
    /** Draws one face, and is told whether it is the front or the back. */
    renderFace: (props: { item: T; index: number; face: BarrelFace }) => VNodeChild;
};
