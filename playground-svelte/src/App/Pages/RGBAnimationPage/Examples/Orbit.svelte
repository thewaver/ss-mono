<script lang="ts">
    import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    type Props = RGBAnimationExampleProps & { radiusPercent: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();

    const animation = $derived(RGBAnimationKeyframes.createOrbit({ radiusPercent: props.radiusPercent }));
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
/>
