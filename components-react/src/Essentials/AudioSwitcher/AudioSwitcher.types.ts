import type { AudioSwitcherController as AudioSwitcherCoreController } from "@thewaver/ss-components";

export type AudioSwitcherController = AudioSwitcherCoreController & {
    /**
     * Calls `listener` whenever the playback the switcher last reported has changed, until the returned function is
     * called. The Solid controller has no getters to follow, so this is the one thing a consumer's own control can
     * re-render from — the moment the browser actually starts or stops a track, rather than the moment it was asked.
     */
    subscribe: (listener: () => void) => () => void;
};

export type AudioSwitcherProps = {
    /** The track to play. Changing it is what the switcher crossfades between. */
    src: string;
    /** How long the old track takes to fade out while the new one fades in. */
    crossfadeMs?: number;
    /** Starts playing as soon as it is mounted, where the browser allows it. */
    shouldAutoPlayOnMount?: boolean;
    /** How loud the playback is. */
    volume?: number;
    /**
     * Whether audio is playing, with its setter. It is the only thing that starts or stops it; the switcher writes
     * through the setter once the browser has actually started a track, or refused to.
     */
    playback?: readonly [boolean, (isPlaying: boolean) => void];
    /** Hands the consumer a controller once the switcher is up, for driving playback from outside. */
    onMount?: (controller: AudioSwitcherController) => void;
};
