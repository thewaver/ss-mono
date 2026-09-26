import type { Signal } from "solid-js";

export type PagePlaybackScrubberProps = {
    id: string;
    ariaLabel: string;
    playbackSignal: Signal<boolean>;
    progressSignal: Signal<number>;
};
