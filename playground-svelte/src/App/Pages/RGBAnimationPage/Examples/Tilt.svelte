<script lang="ts">
    import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    type Props = RGBAnimationExampleProps & { maxDegrees: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();

    const animation = $derived(RGBAnimationKeyframes.createTilt({ maxDegrees: props.maxDegrees }));
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
