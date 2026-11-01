import { createContext } from "svelte";

import type { PlaybackSlot } from "./PlaybackScrubber.types";
import { PlaybackScrubberUtils } from "./PlaybackScrubber.utils.svelte";

const [getContext, setContext, hasContext] = createContext<(key: string) => PlaybackSlot>();

export const setPlaybackGroupContext = (takePlayback: (key: string) => PlaybackSlot) => setContext(takePlayback);

export const usePagePlayback = (key: string) =>
    hasContext() ? getContext()(key) : PlaybackScrubberUtils.createGroup(key)(key);
