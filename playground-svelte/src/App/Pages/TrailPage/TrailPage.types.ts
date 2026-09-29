export type TrailExampleProps = {
    durationMs: number;
    isLooping: boolean;
    isTurning: boolean;
    progress: number;
    playback: boolean;
};

export type TrailScrollExampleProps = Omit<TrailExampleProps, "progress" | "playback"> & {
    isFollowing: boolean;
    onProgressChange: (progress: number) => void;
};
