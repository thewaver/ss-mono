import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type AudioSwitcherExampleProps = AccessorProps<{
    src: string;
    crossfadeMs: number;
    volume: number;
    playbackSignal: Signal<boolean>;
}>;
