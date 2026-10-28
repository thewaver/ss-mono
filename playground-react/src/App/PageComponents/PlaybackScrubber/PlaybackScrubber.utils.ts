export namespace PlaybackScrubberUtils {
    export const gate = (
        playback: readonly [boolean, (isPlaying: boolean) => void],
        isAllowed: boolean,
    ): readonly [boolean, (isPlaying: boolean) => void] => [isAllowed && playback[0], playback[1]];
}
