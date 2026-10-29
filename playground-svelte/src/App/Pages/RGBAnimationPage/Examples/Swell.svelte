<script lang="ts">
    import { RGBAnimation } from "@thewaver/ss-components-svelte";
    import type { RGBAnimationChannel } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    const SCALE_DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };

    const computeSwell = (timeline: number) => (1 - Math.cos(timeline * 2 * Math.PI)) * 0.5;

    type Props = RGBAnimationExampleProps & { scalePercent: number };

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
        const scale = 100 + SCALE_DIRECTIONS[defs.channel] * props.scalePercent * computeSwell(timeline);

        return { scale: [scale, scale] };
    }}
/>
