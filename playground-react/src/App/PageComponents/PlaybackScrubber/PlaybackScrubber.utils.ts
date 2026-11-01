import { useState } from "react";

export namespace PlaybackScrubberUtils {
    export const gate = (
        playback: readonly [boolean, (isPlaying: boolean) => void],
        isAllowed: boolean,
    ): readonly [boolean, (isPlaying: boolean) => void] => [isAllowed && playback[0], playback[1]];

    export const useGroup = (firstKey: string) => {
        const [playingKey, setPlayingKey] = useState<string | undefined>(firstKey);

        return (key: string): readonly [boolean, (isPlaying: boolean) => void] => [
            playingKey === key,
            (isPlaying) =>
                setPlayingKey((current) => (isPlaying ? key : current === key ? undefined : current)),
        ];
    };
}
