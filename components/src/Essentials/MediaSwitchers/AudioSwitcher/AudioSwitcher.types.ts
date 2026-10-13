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

export type BaseAudioSwitcherValues = {
    /** The track to play. Changing it is what the switcher crossfades between. */
    src: string;
    /** How long the old track takes to fade out while the new one fades in. */
    crossfadeMs?: number;
    /** Starts playing as soon as it is mounted, where the browser allows it. */
    shouldAutoPlayOnMount?: boolean;
    /** How loud the playback is. */
    volume?: number;
};

export type AudioSwitcherCbs = {
    /**
     * Hands the consumer a controller once the switcher is up, for driving playback from outside. Whether a track is
     * playing is read from `playback`, which is written the moment the browser actually starts or stops one.
     */
    onMount?: (controller: AudioSwitcherController) => void;
};

export type BaseAudioSwitcherProps = BaseAudioSwitcherValues;
