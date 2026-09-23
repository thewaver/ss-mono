import type { AccessorProps, SignalSource } from "@thewaver/ss-components";

export type TrailExampleProps = AccessorProps<{
    durationMs: number;
    isLooping: boolean;
    isTurning: boolean;
    progressSignal: SignalSource<number>;
    playbackSignal: SignalSource<boolean>;
}>;

export type TrailScrollExampleProps = Omit<TrailExampleProps, "progressSignal" | "playbackSignal"> &
    AccessorProps<{
        isFollowing: boolean;
        onProgressChange: (progress: number) => void;
    }>;
