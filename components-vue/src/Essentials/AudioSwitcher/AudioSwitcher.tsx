import { defineComponent } from "vue";

import { AUDIO_SWITCHER_DEFAULTS, AudioSwitcherUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../Utils/propUtils";
import type { AudioSwitcherProps } from "./AudioSwitcher.types";

export const AudioSwitcher = defineComponent(
    (props: AudioSwitcherProps) => {
        const isPlaying = useTwoWay(props, "playback", false);

        const getVolume = () => props.volume ?? AUDIO_SWITCHER_DEFAULTS.volume;

        const switcher = AudioSwitcherUtils.createSwitcher({
            getVolume,
            getCrossfadeMs: () => props.crossfadeMs ?? AUDIO_SWITCHER_DEFAULTS.crossfadeMs,
            getIsPlaying: () => isPlaying.value,
            setIsPlaying: (value) => {
                isPlaying.value = value;
            },
        });

        watchAfterRender([], () => switcher.mount());

        watchAfterRender([isPlaying], () => switcher.followPlayback());

        watchAfterRender([getVolume], () => switcher.applyVolume());

        watchAfterRender([() => props.src], ([src]) => switcher.setSource(src, props.shouldAutoPlayOnMount ?? false));

        watchAfterRender([], () => {
            props.onMount?.(switcher.controller);
        });

        return () => null;
    },
    {
        name: "AudioSwitcher",
        props: declareProps<AudioSwitcherProps>({
            "src": null,
            "crossfadeMs": null,
            "shouldAutoPlayOnMount": Boolean,
            "volume": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "onMount": null,
        }),
    },
);
