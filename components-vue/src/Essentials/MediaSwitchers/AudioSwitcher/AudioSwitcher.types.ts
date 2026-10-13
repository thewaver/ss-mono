import type { AudioSwitcherCbs, AudioSwitcherController, BaseAudioSwitcherProps } from "@thewaver/ss-components";

export type { AudioSwitcherController };

export type AudioSwitcherProps = BaseAudioSwitcherProps &
    AudioSwitcherCbs & {
        /**
         * Whether audio is playing. It is the only thing that starts or stops it; the switcher writes it back once the
         * browser has actually started a track, or refused to.
         */
        "playback"?: boolean;
        /** Receives the switcher's own reports of starting or stopping, which is what `v-model:playback` binds. */
        "onUpdate:playback"?: (isPlaying: boolean) => void;
    };
