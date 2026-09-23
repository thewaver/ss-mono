import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "../../Primitives/Barrel/Barrel.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type FlipCardAxis = BarrelAxis;

export type FlipCardFace = BarrelFace;

export type FlipCardTurnDirection = "forward" | "backward";

export type FlipCardState = {
    face: FlipCardFace;
    isShowing: boolean;
};

export type FlipCardProps = AccessorProps<{
    /** Which way the card turns over. */
    axis?: FlipCardAxis;
    /** How large the card is. */
    size: Size2d;
    /** How long one turn takes. */
    transitionDurationMs?: number;
    /**
     * How far the card leans toward its other side without turning over, from `0`, lying flat, to `1`, turned
     * all the way. It never touches `flippedSignal`: the side that counts as showing, and the one a reader can
     * reach, stay where they were however far the card leans, so deciding that a lean has gone far enough to
     * become a turn is the caller's to do.
     *
     * The lean goes the way the next turn would, so with `turnDirection` set it follows that. While the card is
     * leaning it follows this number directly rather than easing toward it, so it can be driven from a drag or
     * a slider; set back to `0`, it settles flat over `transitionDurationMs`.
     */
    peekRatio?: number;
    /** Names the card for assistive technology. */
    ariaLabel: string;
    /** Names one face, so a reader is told which side is showing. */
    computeFaceLabel: (face: FlipCardFace) => string;
    /**
     * What the card is called when it is announced, so a reader hears flip card rather than group. Defaults to
     * "flip card".
     */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
    /** Which side is showing. It is the only thing that turns the card. */
    flippedSignal: SignalSource<boolean>;
    /** Draws the front. */
    renderFront: (getState: Accessor<FlipCardState>) => JSX.Element;
    /** Draws the back. */
    renderBack: (getState: Accessor<FlipCardState>) => JSX.Element;
}> & {
    /**
     * Which way the card turns over, read afresh on every turn. `forward` is the way a card turns by default on
     * its first turn: the right edge goes away from the viewer on a row card, and the top edge on a column one.
     * `backward` is the other way.
     *
     * Set, every turn goes that way and the card keeps turning round rather than rocking back, so a page can
     * turn it toward whichever edge was pressed. Left unset, a turn to the back goes forward and a turn to the
     * front goes backward, so the card retraces the way it came, which is what a hand does with a card.
     */
    turnDirection?: MaybeAccessor<FlipCardTurnDirection | undefined>;
};
