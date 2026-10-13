import type { VNodeChild } from "vue";

import type { BaseDieProps, DieFaceState, RollerDirection, RollerPhase } from "@thewaver/ss-components";

export type DieController = {
    /**
     * Which face is nearest the viewer right now, which moves while the die turns. Like every getter here it reads the
     * die's reactive state, so a template or a `computed` calling it follows the die.
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

export type DieProps = BaseDieProps & {
    /**
     * The face the die is heading for or last landed on, which is the one face offered to a screen reader. Both sides
     * write it: the die as soon as a roll's result is known, before the roll lands, and when a step or a drag picks a
     * face; the consumer to settle it onto a face directly, without tumbling. Turning by itself leaves it alone. Leave
     * it unbound and the die keeps it itself, starting on the first face.
     */
    "face"?: number;
    /** Receives the face the die is heading for as soon as it is known, which is what `v-model:face` binds. */
    "onUpdate:face"?: (index: number) => void;
    /**
     * Whether the die turns by itself, given `idleDelayMs`. It is `true` when left out; writing `false` stops it where
     * it is. Anything turning for more than five seconds owes its user a way to stop it, and this is what that control
     * writes.
     */
    "autoSpin"?: boolean;
    /** Receives the die starting or stopping its own turning, which is what `v-model:autoSpin` binds. */
    "onUpdate:autoSpin"?: (isAutoSpinning: boolean) => void;
    /** Hands the consumer a controller once the die is up, for rolling and stepping it from outside. */
    "onMount"?: (controller: DieController) => void;
};

export type DieSlots = {
    /** Draws one face. The face's box is clipped to its contour, so the painter can simply fill it. */
    renderFace: (props: { index: number; state: DieFaceState }) => VNodeChild;
};
