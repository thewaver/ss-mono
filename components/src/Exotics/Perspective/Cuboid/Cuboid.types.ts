import type { Point3d } from "@thewaver/ss-utils";

export type CuboidFace = "front" | "right" | "back" | "left" | "top" | "bottom";

export type CuboidSize = {
    width: number;
    height: number;
    depth: number;
};

export type CuboidFaceState = {
    face: CuboidFace;
    isShowing: boolean;
};

export type CuboidTurns = {
    yaw: number;
    pitch: number;
};

export type CuboidArc = {
    axis: Point3d;
    degrees: number;
};

export type BaseCuboidValues = {
    /** How large the box is, in all three directions. */
    size: CuboidSize;
    /**
     * How long one turn from face to face takes, and how long the box takes to settle when a drag lets go.
     * The box reads no motion preference of its own, so `0` is how a consumer honors reduced motion: every
     * turn and every settle is then instant.
     */
    transitionDurationMs?: number;
    /** Names the box for assistive technology. */
    ariaLabel: string;
    /** What the box is called when it is announced, so a reader hears box rather than group. Defaults to "box". */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
    /**
     * Keeps whatever face is showing the right way up.
     *
     * Off, the two counts are a pose: the box turns across about its own upright axis, so once it has been
     * tipped over the top the far side shows upside down and turning across runs backwards. On, the box
     * remembers how it actually lies, every change of a count is a quarter turn about the screen's own
     * vertical or horizontal axis as seen, and the face it comes to rest on is spun about the line of sight
     * until it reads upright. The counts are then a record of presses rather than a pose, so the same two
     * numbers can mean different faces depending on the order they were reached in.
     */
    isUpright?: boolean;
    /**
     * Lets the box be turned by dragging it. It follows the pointer while held, and on release rounds to the
     * nearest quarter turns and writes them to the two counts, so a drag is recorded exactly as presses would
     * be. Dragging the front rightwards brings the left face round, whichever way up the box is.
     *
     * A drag is never the only way to turn it:
     * {@link https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html WCAG 2.5.7} asks for a single-pointer
     * route that is not a drag, and that route is the two counts and `turnTo`, wired to controls the consumer draws.
     */
    isDraggable?: boolean;
};

export type BaseCuboidCbs = {
    /** Names one face, so a reader is told which side is showing. */
    computeFaceLabel: (face: CuboidFace) => string;
};

export type BaseCuboidProps = BaseCuboidValues & BaseCuboidCbs;
