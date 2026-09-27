export type TrailExampleProps = {
    durationMs: number;
    isLooping: boolean;
    isTurning: boolean;
    progressState: readonly [number, (value: number) => void];
    playbackState: readonly [boolean, (value: boolean) => void];
};

export type TrailScrollExampleProps = Omit<TrailExampleProps, "progressState" | "playbackState"> & {
    isFollowing: boolean;
    onProgressChange: (progress: number) => void;
};
