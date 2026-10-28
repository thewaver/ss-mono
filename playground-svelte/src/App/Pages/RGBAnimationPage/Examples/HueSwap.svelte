<script lang="ts">
    import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-svelte";
    import type { RGBAnimationChannel } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    const FULL_TURN_DEGREES = 360;

    const computeDirection = (channel: RGBAnimationChannel, anchor: RGBAnimationChannel) => {
        if (channel === anchor) return 0;

        return RGB_ANIMATION_CHANNELS.find((other) => other !== anchor) === channel ? 1 : -1;
    };

    type Props = RGBAnimationExampleProps & { turns: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();

    let pass = $state(0);

    const anchor = $derived(RGB_ANIMATION_CHANNELS[pass % RGB_ANIMATION_CHANNELS.length]);
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
        "hue-rotate": computeDirection(defs.channel, anchor) * props.turns * FULL_TURN_DEGREES * timeline,
    })}
    onIterationEnd={() => {
        pass += 1;
    }}
/>
