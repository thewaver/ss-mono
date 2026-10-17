import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { Point2d } from "@thewaver/ss-utils";

export type HoverCardExampleProps = AccessorProps<{
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    visibility: Signal<boolean>;
    following: Signal<boolean>;
}>;
