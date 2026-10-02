import type { Snippet } from "svelte";

import type { DieFaceState, DieShape } from "@thewaver/ss-components";

export type DieController = {
    /**
     * Whether a roll is under way. It is live: read in an effect, a `$derived` or markup, it updates as a roll starts
     * and lands.
     */
    getIsRolling: () => boolean;
    /** Starts a roll and reports whether it did. It declines while one is already under way. */
    roll: () => boolean;
};

export type DieProps = {
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
     * die keeps it itself, starting on the first face. Bind it with `bind:face` to drive or follow it.
     */
    face?: number;
    /** Chooses which face a roll lands on. It may answer later, so the result can come from a server. */
    computeRollTarget: () => number | Promise<number>;
    /** Runs once a roll has landed, with the face it landed on. */
    onRollEnd?: (index: number) => void;
    /** Draws one face. The face's box is clipped to its contour, so the painter can simply fill it. */
    renderFace: Snippet<[index: number, state: DieFaceState]>;
    /** Hands the consumer a controller once the die is up, for rolling it from outside. */
    onMount?: (controller: DieController) => void;
};
