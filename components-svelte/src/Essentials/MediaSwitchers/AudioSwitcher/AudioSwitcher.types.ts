import type { AudioSwitcherCbs, BaseAudioSwitcherProps } from "@thewaver/ss-components";

export type AudioSwitcherProps = BaseAudioSwitcherProps &
    AudioSwitcherCbs & {
        /**
         * Whether audio is playing. Bind it with `bind:playback` to drive or follow it; it is the only thing that starts
         * or stops the audio, and the switcher writes it once the browser has actually started a track, or refused to.
         * Left unbound, the switcher keeps its own, starting stopped.
         */
        playback?: boolean;
    };
