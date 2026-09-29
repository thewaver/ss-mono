import type { Signal } from "solid-js";

export type PagePlaybackScrubberProps = {
    id: string;
    ariaLabel: string;
    playback: Signal<boolean>;
    progress: Signal<number>;
};
