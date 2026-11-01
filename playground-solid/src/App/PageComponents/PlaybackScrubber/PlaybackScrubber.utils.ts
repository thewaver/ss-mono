import { type Accessor, createSignal } from "solid-js";

import type { SignalPair } from "@thewaver/ss-components-solid";

export namespace PlaybackScrubberUtils {
    export const gate = (playback: SignalPair<boolean>, getIsAllowed: Accessor<boolean>): SignalPair<boolean> => [
        () => getIsAllowed() && playback[0](),
        playback[1],
    ];

    export const createGroup = (firstKey: string) => {
        const [getPlayingKey, setPlayingKey] = createSignal<string | undefined>(firstKey);

        return (key: string): SignalPair<boolean> => [
            () => getPlayingKey() === key,
            (isPlaying) =>
                setPlayingKey((playingKey) => (isPlaying ? key : playingKey === key ? undefined : playingKey)),
        ];
    };
}
