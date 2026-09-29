import { createEffect, on, onCleanup, onMount } from "solid-js";

import { AUDIO_SWITCHER_DEFAULTS, AudioSwitcherUtils } from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { AudioSwitcherProps } from "./AudioSwitcherSolid.types";

export const AudioSwitcher = (props: AudioSwitcherProps) => {
    const [getIsPlaying, setIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, false);

    const getVolume = () => access(props.volume) ?? AUDIO_SWITCHER_DEFAULTS.volume;

    const switcher = AudioSwitcherUtils.createSwitcher({
        getVolume,
        getCrossfadeMs: () => access(props.crossfadeMs) ?? AUDIO_SWITCHER_DEFAULTS.crossfadeMs,
        getIsPlaying,
        setIsPlaying,
    });

    let stop: (() => void) | undefined;

    onCleanup(() => stop?.());

    createEffect(() => switcher.followPlayback());

    createEffect(on(getVolume, () => switcher.applyVolume()));

    createEffect(() => switcher.setSource(access(props.src), access(props.shouldAutoPlayOnMount) ?? false));

    onMount(() => {
        stop = switcher.mount();
        props.onMount?.(switcher.controller);
    });

    return null;
};
