import type { Size2d } from "@thewaver/ss-utils";

export type BarrelAxis = "row" | "column";

export type BarrelFace = "front" | "back";

export type BarrelFaceDefs = {
    /** Names this face for assistive technology. */
    ariaLabel: string;
    /** Whether this face is kept out of the accessibility tree, which the faces turned away from the viewer are. */
    isHidden: boolean;
};

export type BaseBarrelValues<T> = {
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
    /** The faces, in the order they sit round the barrel. */
    faces: T[];
};

export type BaseBarrelCbs = {
    /** How one face is placed and drawn, for a barrel whose faces are not evenly spaced. */
    computeFaceDefs: (index: number, face: BarrelFace) => BarrelFaceDefs;
};

export type BaseBarrelProps<T> = BaseBarrelValues<T> & BaseBarrelCbs;
