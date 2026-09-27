import type { Signal } from "solid-js";

import type { AccessorProps, FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-solid";

export type FlipCardPressedExampleProps = AccessorProps<{
    axis: FlipCardAxis;
    transitionDurationMs: number;
    flippedSignal: Signal<boolean>;
    onTurn: (direction: FlipCardTurnDirection) => void;
}>;
