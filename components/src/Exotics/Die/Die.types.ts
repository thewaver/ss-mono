import type { Accessor, JSX } from "solid-js";

import type { Point3d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

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
    outline: { x: number; y: number }[];
};

export type DieQuaternion = {
    w: number;
    x: number;
    y: number;
    z: number;
};

export type DieFaceState = {
    /** Which face this is, counting from zero in the order the shape lists its faces. */
    index: number;
    /** Whether this is the face turned towards the viewer with the die at rest. No face is showing while it turns. */
    isShowing: boolean;
    /** Which way the face points, out from the die's center, before the die is turned. A unit vector. */
    normal: Point3d;
    /** How large the face's own box is, in pixels; the face's outline is centered in it. */
    size: Size2d;
};

export type DieController = {
    /** Whether a roll is under way. */
    getIsRolling: Accessor<boolean>;
    /** Starts a roll and reports whether it did. It declines while one is already under way. */
    roll: () => boolean;
};

export type DieProps = AccessorProps<{
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
    /** Names the die for assistive technology. */
    ariaLabel: string;
    /** Names one face, which is what a reader is told is showing and what is announced when a roll lands. */
    computeFaceLabel: (index: number) => string;
    /** What the die is called when it is announced, so a reader hears die rather than group. Defaults to "die". */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
    /**
     * The face turned towards the viewer. Both sides write it: the die as soon as a roll's result is known, before the
     * roll lands, and the consumer to turn it to a face directly, which it does without tumbling. Leave it out and the
     * die keeps it itself, starting on the first face.
     */
    faceSignal?: SignalSource<number>;
    /** Chooses which face a roll lands on. It may answer later, so the result can come from a server. */
    computeRollTarget: () => number | Promise<number>;
    /** Runs once a roll has landed, with the face it landed on. */
    onRollEnd?: (index: number) => void;
    /** Draws one face. The face's box is clipped to its outline, so the painter can simply fill it. */
    renderFace: (getIndex: Accessor<number>, getState: Accessor<DieFaceState>) => JSX.Element;
    /** Hands the consumer a controller once the die is up, for rolling it from outside. */
    onMount?: (controller: DieController) => void;
}>;
