import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    autoplayDelayMs?: number;
    indexSignal: Signal<number>;
    playingSignal?: Signal<boolean>;
}>;
