export type TrailExampleProps = {
    "durationMs": number;
    "isLooping": boolean;
    "isTurning": boolean;
    "progress": number;
    "onUpdate:progress"?: (value: number) => void;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
};

export type TrailScrollExampleProps = Omit<
    TrailExampleProps,
    "progress" | "onUpdate:progress" | "playback" | "onUpdate:playback"
> & {
    isFollowing: boolean;
    onProgressChange: (progress: number) => void;
};
