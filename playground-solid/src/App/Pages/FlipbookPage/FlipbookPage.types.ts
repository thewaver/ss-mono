import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type FlipbookExampleProps = AccessorProps<{
    transitionDurationMs: number;
    index: Signal<number>;
}>;
