import type { AccessorProps, SignalSource } from "@thewaver/ss-components-solid";

export type TrailExampleProps = AccessorProps<{
    durationMs: number;
    isLooping: boolean;
    isTurning: boolean;
    progress: SignalSource<number>;
    playback: SignalSource<boolean>;
}>;

export type TrailScrollExampleProps = Omit<TrailExampleProps, "progress" | "playback"> &
    AccessorProps<{
        isFollowing: boolean;
        onProgressChange: (progress: number) => void;
    }>;
