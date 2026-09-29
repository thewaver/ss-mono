import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-svelte";

export type FlipCardPressedExampleProps = {
    axis: FlipCardAxis;
    transitionDurationMs: number;
    flipped: boolean;
    onTurn: (direction: FlipCardTurnDirection) => void;
};
