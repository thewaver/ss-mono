import type { AudioSwitcherController } from "@thewaver/ss-components";

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
     * Whether audio is playing. Bind it with `bind:playback` to drive or follow it; it is the only thing that starts
     * or stops the audio, and the switcher writes it once the browser has actually started a track, or refused to.
     * Left unbound, the switcher keeps its own, starting stopped.
     */
    playback?: boolean;
    /**
     * Hands the consumer a controller once the switcher is up, for driving playback from outside. Whether a track is
     * playing is read from `playback`, which is written the moment the browser actually starts or stops one.
     */
    onMount?: (controller: AudioSwitcherController) => void;
};
