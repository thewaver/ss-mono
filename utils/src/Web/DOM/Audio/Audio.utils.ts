/** Questions about an audio element's playback. */
export namespace AudioUtils {
    /**
     * Whether an audio element is playing right now.
     *
     * Playing means started, not paused, not finished, and holding enough data to keep going — a play that is still
     * buffering its start does not count.
     *
     * @param audioElement The element to ask.
     * @returns `true` while it is audibly playing.
     */
    export const isPlaying = (audioElement: HTMLAudioElement) =>
        !!audioElement && !audioElement.paused && !audioElement.ended && audioElement.readyState > 2;
}
