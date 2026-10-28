<script lang="ts">
    import { RGBAnimation } from "@thewaver/ss-components-svelte";
    import type { RGBAnimationChannel } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: -1, green: 0, blue: 1 };

    type Props = RGBAnimationExampleProps & { separationPercent: number };

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
    computeChannelAnimation={(defs, timeline) => ({
        translateX: DIRECTIONS[defs.channel] * props.separationPercent * Math.sin(timeline * Math.PI),
    })}
/>
