import type { Accessor, Signal } from "solid-js";

import type { SignalPair } from "@thewaver/ss-components-solid";

export namespace PlaybackScrubberUtils {
    export const gate = (playback: Signal<boolean>, getIsAllowed: Accessor<boolean>): SignalPair<boolean> => [
        () => getIsAllowed() && playback[0](),
        playback[1],
    ];
}
