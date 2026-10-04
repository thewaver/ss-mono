import type { Snippet } from "svelte";

import type { DieFaceState, DieShape, RollerDirection, RollerPhase } from "@thewaver/ss-components";
import type { Point3d } from "@thewaver/ss-utils";

export type DieController = {
    /**
     * Which face is nearest the viewer right now, which moves while the die turns. Like every getter here it is live:
     * read in an effect, a `$derived` or markup, it updates as the die turns.
     */
    getCurrentFace: () => number;
    /** What the die is doing: still, idling, rolling, settling onto a face, being dragged, or coasting after a drag. */
    getPhase: () => RollerPhase;
    /** Whether a roll can be started right now. Never, for a die with no `computeRollTarget`. */
    getIsRollable: () => boolean;
    /** Whether a roll is under way, from the moment it is asked for until it lands. */
    getIsRolling: () => boolean;
    /** Whether the die is turning on its own rather than because somebody asked. */
    getIsAutoSpinning: () => boolean;
    /**
     * Starts a roll and reports whether it did. It declines while anything else is under way, and always without
     * `computeRollTarget`.
     */
    roll: () => boolean;
    /**
     * Turns the die one face in a direction and reports whether it did, which is the route a page's own buttons take
     * to everything a drag can do. A step right does what a drag to the right does: the face on the left comes round.
     * It declines during a roll and a drag.
     */
    step: (direction: RollerDirection) => boolean;
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
    /** Names one face, which is what a reader is told is showing and what is announced when the die lands. */
    computeFaceLabel: (index: number) => string;
    /** What the die is called when it is announced, so a reader hears die rather than group. Defaults to "die". */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
    /**
     * The face the die is heading for or last landed on, which is the one face offered to a screen reader. Both sides
     * write it: the die as soon as a roll's result is known, before the roll lands, and when a step or a drag picks a
     * face; the consumer to settle it onto a face directly, without tumbling. Turning by itself leaves it alone. Leave
     * it out and the die keeps it itself, starting on the first face. Bind it with `bind:face` to drive or follow it.
     */
    face?: number;
    /**
     * Whether the die turns by itself, given `idleDelayMs`. It is `true` when left out; writing `false` stops it where
     * it is. Anything turning for more than five seconds owes its user a way to stop it, and this is what that control
     * writes. Bind it with `bind:autoSpin`.
     */
    autoSpin?: boolean;
    /**
     * Chooses which face a roll lands on. It may answer later, so the result can come from a server. Leave it out for
     * a die that never rolls, and `roll` declines.
     */
    computeRollTarget?: () => number | Promise<number>;
    /** Runs once a roll has landed, with the face it landed on. */
    onRollEnd?: (index: number) => void;
    /** Draws one face. The face's box is clipped to its contour, so the painter can simply fill it. */
    renderFace: Snippet<[index: number, state: DieFaceState]>;
    /** Hands the consumer a controller once the die is up, for rolling and stepping it from outside. */
    onMount?: (controller: DieController) => void;
};
