import type { Signal } from "solid-js";

import type { AccessorProps, FlipCardAxis } from "@thewaver/ss-components";

export type FlipCardExampleProps = AccessorProps<{
    axis: FlipCardAxis;
    transitionDurationMs: number;
    flippedSignal: Signal<boolean>;
}>;
