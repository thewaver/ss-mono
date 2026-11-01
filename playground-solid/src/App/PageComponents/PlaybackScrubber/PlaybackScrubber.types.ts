import type { SignalPair } from "@thewaver/ss-components-solid";

export type PagePlaybackScrubberProps = {
    id: string;
    ariaLabel: string;
    playback: SignalPair<boolean>;
    progress: SignalPair<number>;
};
