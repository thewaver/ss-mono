export type PagePlaybackScrubberProps = {
    id: string;
    ariaLabel: string;
    playbackState: readonly [boolean, (isPlaying: boolean) => void];
    progressState: readonly [number, (progress: number) => void];
};
