import { useEffect, useLayoutEffect, useState } from "react";

import { AUDIO_SWITCHER_DEFAULTS, AudioSwitcherUtils } from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { AudioSwitcherController, AudioSwitcherProps } from "./AudioSwitcher.types";

export const AudioSwitcher = (props: AudioSwitcherProps) => {
    const [isPlaying, setIsPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, false);

    const volume = props.volume ?? AUDIO_SWITCHER_DEFAULTS.volume;

    const latest = useLatest({
        volume,
        crossfadeMs: props.crossfadeMs ?? AUDIO_SWITCHER_DEFAULTS.crossfadeMs,
        isPlaying,
        setIsPlaying,
    });

    const [switcher] = useState(() =>
        AudioSwitcherUtils.createSwitcher({
            getVolume: () => latest.current.volume,
            getCrossfadeMs: () => latest.current.crossfadeMs,
            getIsPlaying: () => latest.current.isPlaying,
            setIsPlaying: (value) => latest.current.setIsPlaying(value),
        }),
    );

    const [playbackStore] = useState(() => StoreUtils.create(isPlaying));

    useLayoutEffect(() => {
        playbackStore.set(isPlaying);
    });

    const [controller] = useState<AudioSwitcherController>(() => ({
        ...switcher.controller,
        subscribe: playbackStore.subscribe,
    }));

    useEffect(() => switcher.mount(), [switcher]);

    useEffect(() => switcher.followPlayback(), [switcher, isPlaying]);

    useEffect(() => switcher.applyVolume(), [switcher, volume]);

    useEffect(() => switcher.setSource(props.src, props.shouldAutoPlayOnMount ?? false), [switcher, props.src]);

    useEffect(() => props.onMount?.(controller), [controller]);

    return null;
};
