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
    /** How large the face's own box is, in pixels; the face's contour is centered in it. */
    size: Size2d;
};

export type DieRollerState = {
    /** How the die is turned right now, part-way through a roll included. */
    orientation: DieQuaternion;
    /** Whether a roll is under way, from the moment it is asked for until it lands. */
    isRolling: boolean;
    /** The face the die has come to rest on, or `undefined` while it turns. */
    restingFace: number | undefined;
};

export type DieRollerOpts = {
    /** The face geometry the die is drawn with, at its current size. */
    getGeometry: () => DieFaceGeometry[];
    /** The face the owner says is showing, already clamped to the faces there are. */
    getShownFace: () => number;
    /** How long a roll takes. */
    getRollDurationMs: () => number;
    /** How many whole tumbles a roll makes on the way to its face. */
    getTumbleCount: () => number;
    /** Chooses which face a roll lands on. It may answer later. */
    computeRollTarget: () => number | Promise<number>;
    /** Names one face, which is what is announced when a roll lands. */
    computeFaceLabel: (index: number) => string;
    /** Writes the face showing back to its owner, as soon as a roll's result is known. */
    writeFace: (index: number) => void;
    /** Runs once a roll has landed. */
    onRollEnd?: (index: number) => void;
};

export type DieRoller = {
    /** The die's state. */
    get: () => DieRollerState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Puts the die straight onto a face, stopping any turn under way. */
    rest: (index: number) => void;
    /** Turns the die to a face the owner asked for, without tumbling. The echo of a roll's own write is ignored. */
    turnTo: (index: number) => void;
    /**
     * Answers a change of shape. A die at rest is put straight onto the face; a die part-way through a turn the owner
     * asked for turns on from where it is drawn to that face of the new shape; a roll is left to land where it lands.
     */
    reshape: (index: number) => void;
    /** Starts a roll and reports whether it did. It declines while one is already under way. */
    roll: () => boolean;
    /** Stops any turn under way, leaving the die where it is drawn. */
    stop: () => void;
};
