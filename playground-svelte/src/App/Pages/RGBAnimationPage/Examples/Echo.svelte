<script lang="ts">
    import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    const LAG_SHARE = 0.1;
    const TRAVEL_SHARE = 1 - LAG_SHARE * (RGB_ANIMATION_CHANNELS.length - 1);

    const computePath = (timeline: number, distance: number) => {
        if (timeline <= 0 || timeline >= TRAVEL_SHARE) return [0, 0];

        const turn = (timeline / TRAVEL_SHARE) * 2 * Math.PI;

        return [distance * Math.sin(turn), distance * Math.sin(turn * 2) * 0.5];
    };

    type Props = RGBAnimationExampleProps & { distancePercent: number };

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
    computeRootAnimation={(timeline) => ({ translate: computePath(timeline, props.distancePercent) })}
    computeSliceAnimation={(defs, timeline) => {
        const lag = RGB_ANIMATION_CHANNELS.indexOf(defs.channel) * LAG_SHARE;
        const [rootX, rootY] = computePath(timeline, props.distancePercent);
        const [laggedX, laggedY] = computePath(timeline - lag, props.distancePercent);

        return { translate: [laggedX - rootX, laggedY - rootY] };
    }}
/>
