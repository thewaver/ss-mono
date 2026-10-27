import type { Point3d, Size2d } from "@thewaver/ss-utils";

export type DieShape = {
    vertices: Point3d[];
    faces: number[][];
};

export type DieFaceGeometry = {
    center: Point3d;
    normal: Point3d;
    right: Point3d;
    down: Point3d;
    size: Size2d;
    contour: { x: number; y: number }[];
    turnSymmetry: number;
};

export type DieFaceState = {
    /** Which face this is, counting from zero in the order the shape lists its faces. */
    index: number;
    /** Whether this is the face turned towards the viewer with the die at rest. No face is showing while it turns. */
    isShowing: boolean;
    /** Which way the face points, out from the die's center, before the die is turned. A unit vector. */
    normal: Point3d;
    /** How large the face's own box is, in pixels; the face's contour is centered in it. */
    size: Size2d;
};

export type BaseDieValues = {
    /**
     * The solid: its corners, and its faces as lists of corners. Each face must be flat, the solid must be convex, and a
     * face's first corner is the one its top points at when it is turned towards the viewer.
     */
    shape: DieShape;
    /** How far across the die is at its widest, corner to corner, in pixels. */
    size: number;
    /** How long a roll takes from the moment it starts to the moment it lands. */
    rollDurationMs?: number;
    /** How many whole tumbles a roll makes on the way to its face. */
    tumbleCount?: number;
    /**
     * How long the die takes to settle onto a face that was not rolled for: one written to `face`, one a step chose,
     * and the nearest one once a drag has coasted to a stop. `0` lands at once, the way to honor reduced motion.
     */
    settleDurationMs?: number;
    /** How long the die stands still after landing before it starts turning by itself again. Below `0` it stays still. */
    restDurationMs?: number;
    /**
     * How long the die keeps coasting after a drag lets go: after this long it has lost about 63% of its speed. `0`
     * settles straight onto the nearest face, the way to honor reduced motion.
     */
    momentumMs?: number;
    /**
     * How long the die takes to turn by itself through one face's share of a whole turn about `driftAxis`, the way a
     * wheel's is how long one wedge takes to pass. Leave it out and the die stands still until something turns it.
     */
    idleDelayMs?: number;
    /** The axis the die turns about by itself, on screen: `x` to the right, `y` down, `z` towards the viewer. */
    driftAxis?: Point3d;
    /**
     * Whether a person can turn the die by hand: dragging it, as if rolling a ball under the pointer, and the arrow
     * keys, which step one face at a time while the die itself has focus. Off by default, and while it is off the die
     * is not in the tab order. A drag lets go by coasting, slowing, and settling onto the nearest face.
     */
    isMovable?: boolean;
    /**
     * Whether a face turned away still paints, seen mirrored through the faces in front of it. For a die whose faces
     * are transparent, so what is painted on the far side shows through. Off by default.
     */
    isSeeThrough?: boolean;
    /** Names the die for assistive technology. */
    ariaLabel: string;
    /** What the die is called when it is announced, so a reader hears die rather than group. Defaults to "die". */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
};

export type BaseDieCbs = {
    /** Names one face, which is what a reader is told is showing and what is announced when the die lands. */
    computeFaceLabel: (index: number) => string;
    /**
     * Chooses which face a roll lands on. It may answer later, so the result can come from a server. Leave it out for
     * a die that never rolls, and `roll` declines.
     */
    computeRollTarget?: () => number | Promise<number>;
    /** Runs once a roll has landed, with the face it landed on. */
    onRollEnd?: (index: number) => void;
};

export type BaseDieProps = BaseDieValues & BaseDieCbs;
