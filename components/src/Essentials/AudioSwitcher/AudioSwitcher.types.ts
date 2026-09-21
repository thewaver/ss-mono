import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type AudioSwitcherController = {
    /**
     * Rewinds the playing track to its start, leaving it playing or paused as it was.
     *
     * @returns `true`, since it always acts.
     */
    reset: () => boolean;
};

export type AudioSwitcherProps = AccessorProps<{
    /** The track to play. Changing it is what the switcher crossfades between. */
    src: string;
    /** How long the old track takes to fade out while the new one fades in. */
    crossfadeMs?: number;
    /** Starts playing as soon as it is mounted, where the browser allows it. */
    shouldAutoPlayOnMount?: boolean;
    /** How loud the playback is. */
    volume?: number;
    /** Whether audio is playing. It is the only thing that starts or stops it. */
    playbackSignal?: SignalSource<boolean>;
    /** Hands the consumer a controller once the switcher is up, for driving playback from outside. */
    onMount?: (controller: AudioSwitcherController) => void;
}>;
