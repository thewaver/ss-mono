import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-react";

export type FlipCardPressedExampleProps = {
    axis: FlipCardAxis;
    transitionDurationMs: number;
    flippedState: readonly [boolean, (isFlipped: boolean) => void];
    onTurn: (direction: FlipCardTurnDirection) => void;
};
