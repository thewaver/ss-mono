export type TrailExampleProps = {
    durationMs: number;
    isLooping: boolean;
    isTurning: boolean;
    progress: readonly [number, (value: number) => void];
    playback: readonly [boolean, (value: boolean) => void];
};

export type TrailScrollExampleProps = Omit<TrailExampleProps, "progress" | "playback"> & {
    isFollowing: boolean;
    onProgressChange: (progress: number) => void;
};
