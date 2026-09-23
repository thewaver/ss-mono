import type { Accessor, JSX } from "solid-js";

import type { Point3d } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

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

export type CuboidController = {
    /**
     * Which face is towards the viewer. Without `isUpright` it follows from the two counts alone; with it, it
     * follows from the order the presses came in, which the counts no longer record.
     */
    getFacing: Accessor<CuboidFace>;
    /**
     * Turns the box to a face by the fewest quarter turns from where it actually is, turning across before
     * tipping when two routes are equally short. It works by writing the two counts, as a press would, so
     * whoever owns them sees the turn happen.
     *
     * @returns `false` when that face is already the one showing.
     */
    turnTo: (face: CuboidFace) => boolean;
};

export type CuboidProps = AccessorProps<{
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
    /** Names one face, so a reader is told which side is showing. */
    computeFaceLabel: (face: CuboidFace) => string;
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
     * A drag is never the only way to turn it: WCAG 2.5.7 asks for a single-pointer route that is not a drag,
     * and that route is the two counts and `turnTo`, wired to controls the consumer draws.
     */
    isDraggable?: boolean;
    /**
     * How many quarter turns across. Each change of one is a quarter turn that way: up by one brings the face
     * on the right round to the front. It is one of the two things that turn the box, alongside
     * `pitchSignal`.
     */
    yawSignal: SignalSource<number>;
    /**
     * How many quarter turns up. Each change of one is a quarter turn that way: up by one brings the face
     * above round to the front. It is one of the two things that turn the box, alongside `yawSignal`.
     */
    pitchSignal: SignalSource<number>;
    /** Draws one face, and is told which face it is. */
    renderFace: (getFace: Accessor<CuboidFace>, getState: Accessor<CuboidFaceState>) => JSX.Element;
    /**
     * Hands the consumer a controller once the box is up, for asking which face shows and for turning to one
     * by name. The box renders no controls, so any button that turns it is the consumer's to draw.
     */
    onMount?: (controller: CuboidController) => void;
}>;
