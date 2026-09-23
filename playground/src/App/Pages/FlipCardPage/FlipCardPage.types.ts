import type { Signal } from "solid-js";

import type { AccessorProps, FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components";

export type FlipCardExampleProps = AccessorProps<{
    axis: FlipCardAxis;
    transitionDurationMs: number;
    flippedSignal: Signal<boolean>;
}>;

export type FlipCardPressedExampleProps = AccessorProps<{
    axis: FlipCardAxis;
    transitionDurationMs: number;
    flippedSignal: Signal<boolean>;
    onTurn: (direction: FlipCardTurnDirection) => void;
}>;
