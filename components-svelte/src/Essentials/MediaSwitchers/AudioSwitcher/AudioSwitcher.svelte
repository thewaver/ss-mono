<script lang="ts">
    import { untrack } from "svelte";

    import { AUDIO_SWITCHER_DEFAULTS, AudioSwitcherUtils } from "@thewaver/ss-components";

    import type { AudioSwitcherProps } from "./AudioSwitcher.types.js";

    let { playback = $bindable(false), ...props }: AudioSwitcherProps = $props();

    const volume = $derived(props.volume ?? AUDIO_SWITCHER_DEFAULTS.volume);

    const switcher = AudioSwitcherUtils.createSwitcher({
        getVolume: () => volume,
        getCrossfadeMs: () => props.crossfadeMs ?? AUDIO_SWITCHER_DEFAULTS.crossfadeMs,
        getIsPlaying: () => playback,
        setIsPlaying: (value) => {
            playback = value;
        },
    });

    $effect(() => untrack(() => switcher.mount()));

    $effect(() => {
        playback;

        untrack(() => switcher.followPlayback());
    });

    $effect(() => {
        volume;

        untrack(() => switcher.applyVolume());
    });

    $effect(() => {
        const src = props.src;

        untrack(() => switcher.setSource(src, props.shouldAutoPlayOnMount ?? false));
    });

    $effect(() => untrack(() => props.onMount?.(switcher.controller)));
</script>
