<script lang="ts">
    import { untrack } from "svelte";

    import { SlotTextUtils } from "@thewaver/ss-components";

    import type { SlotTextSlotProps } from "./SlotText.types.js";

    let props: SlotTextSlotProps = $props();

    let element = $state<HTMLDivElement>();
    let animation: Animation | undefined;

    $effect(() => {
        const phase = props.phase;
        const ref = element;

        if (!ref) return;

        untrack(() => {
            animation = SlotTextUtils.animateSlotWidth(ref, phase, animation, props.widthPx, props.durationMs, () => {
                animation = undefined;

                if (phase === "entering") props.onGrown();
                else props.onShrunk();
            });
        });
    });

    $effect(() => () => {
        animation?.cancel();
        animation = undefined;
    });
</script>

<div bind:this={element} class={props.class} style={props.style} aria-hidden={props.isHidden ? "true" : undefined}>
    {@render props.children()}
</div>
