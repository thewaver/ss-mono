<script lang="ts">
    import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    type Props = RGBAnimationExampleProps & { radiusPercent: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();
</script>

<RGBAnimation
    bind:playback
    bind:progress
    src={props.src}
    ariaLabel={props.ariaLabel}
    colorMixing={props.colorMixing}
    animationDurationMs={props.animationDurationMs}
    animationIterationDelayMs={props.animationIterationDelayMs}
    computeSliceAnimation={(defs, timeline) => {
        const index = RGB_ANIMATION_CHANNELS.indexOf(defs.channel);
        const angle = (timeline + index / RGB_ANIMATION_CHANNELS.length) * 2 * Math.PI;
        const radius = props.radiusPercent * Math.sin(timeline * Math.PI);

        return { translate: [radius * Math.cos(angle), radius * Math.sin(angle)] };
    }}
/>
