import type { AudioSwitcherController } from "@thewaver/ss-components";

export type { AudioSwitcherController };

export type AudioSwitcherProps = {
    /** The track to play. Changing it is what the switcher crossfades between. */
    "src": string;
    /** How long the old track takes to fade out while the new one fades in. */
    "crossfadeMs"?: number;
    /** Starts playing as soon as it is mounted, where the browser allows it. */
    "shouldAutoPlayOnMount"?: boolean;
    /** How loud the playback is. */
    "volume"?: number;
    /**
     * Whether audio is playing. It is the only thing that starts or stops it; the switcher writes it back once the
     * browser has actually started a track, or refused to.
     */
    "playback"?: boolean;
    /** Receives the switcher's own reports of starting or stopping, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    /** Hands the consumer a controller once the switcher is up, for driving playback from outside. */
    "onMount"?: (controller: AudioSwitcherController) => void;
};
