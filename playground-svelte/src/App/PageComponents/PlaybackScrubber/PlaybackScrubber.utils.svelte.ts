import type { PlaybackSlot } from "./PlaybackScrubber.types";

export namespace PlaybackScrubberUtils {
    export const createGroup = (firstKey: string) => {
        let playingKey = $state<string | undefined>(firstKey);

        return (key: string): PlaybackSlot => ({
            get value() {
                return playingKey === key;
            },
            set value(isPlaying: boolean) {
                playingKey = isPlaying ? key : playingKey === key ? undefined : playingKey;
            },
        });
    };
}
