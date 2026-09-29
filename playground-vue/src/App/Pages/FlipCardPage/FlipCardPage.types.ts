import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-vue";

export type FlipCardPressedExampleProps = {
    "axis": FlipCardAxis;
    "transitionDurationMs": number;
    "flipped": boolean;
    "onUpdate:flipped"?: (isFlipped: boolean) => void;
    "onTurn": (direction: FlipCardTurnDirection) => void;
};
