import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type AudioSwitcherExampleProps = AccessorProps<{
    src: string;
    crossfadeMs: number;
    volume: number;
    playback: Signal<boolean>;
}>;
