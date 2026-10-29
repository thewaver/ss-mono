<script lang="ts">
    import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    type Props = RGBAnimationExampleProps & { distancePercent: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();

    const opts = $derived({ distancePercent: props.distancePercent });

    const animation = $derived(RGBAnimationKeyframes.createEcho(opts));
</script>

<RGBAnimation
    bind:playback
    bind:progress
    src={props.src}
    ariaLabel={props.ariaLabel}
    colorMixing={props.colorMixing}
    animationDurationMs={props.animationDurationMs}
    animationIterationDelayMs={props.animationIterationDelayMs}
    computeRootAnimation={(timeline) => ({ translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, opts) })}
    computeSliceAnimation={animation}
/>
