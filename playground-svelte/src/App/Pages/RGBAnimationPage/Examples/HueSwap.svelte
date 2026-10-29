<script lang="ts">
    import { RGBAnimation, RGBAnimationKeyframes, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    type Props = RGBAnimationExampleProps & { turns: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();

    let pass = $state(0);

    const animation = $derived(
        RGBAnimationKeyframes.createHueSwap({
            turns: props.turns,
            anchor: RGB_ANIMATION_CHANNELS[pass % RGB_ANIMATION_CHANNELS.length],
        }),
    );
</script>

<RGBAnimation
    bind:playback
    bind:progress
    src={props.src}
    ariaLabel={props.ariaLabel}
    colorMixing={props.colorMixing}
    animationDurationMs={props.animationDurationMs}
    animationIterationDelayMs={props.animationIterationDelayMs}
    computeSliceAnimation={animation}
    onIterationEnd={() => {
        pass += 1;
    }}
/>
