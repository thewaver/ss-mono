export type AudioSwitcherController = {
    /**
     * Rewinds the playing track to its start, leaving it playing or paused as it was.
     *
     * @returns `true`, since it always acts.
     */
    reset: () => boolean;
};

export type AudioSwitcherDefs = {
    getVolume: () => number;
    getCrossfadeMs: () => number;
    getIsPlaying: () => boolean;
    setIsPlaying: (isPlaying: boolean) => void;
};
