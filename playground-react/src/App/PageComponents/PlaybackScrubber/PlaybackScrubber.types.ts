export type PagePlaybackScrubberProps = {
    id: string;
    ariaLabel: string;
    playback: readonly [boolean, (isPlaying: boolean) => void];
    progress: readonly [number, (progress: number) => void];
};
