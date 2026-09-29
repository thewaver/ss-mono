<script lang="ts">
    import { untrack } from "svelte";

    import {
        PLACEMENT_ITEM_DEFAULTS,
        PlacementItemUtils,
        PlacementItemStyles as styles,
    } from "@thewaver/ss-components";

    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import { getPlacementBoxContext } from "../PlacementBox/PlacementBox.context.js";
    import type { PlacementItemProps } from "./PlacementItem.types.js";

    const NO_TRANSITION_MS = 0;

    let props: PlacementItemProps = $props();

    const context = getPlacementBoxContext();
    const glideWatcher = PlacementItemUtils.createGlideWatcher();

    let item = $state<HTMLDivElement>();
    let isGliding = $state(false);

    const transitionDelayMs = $derived(props.transitionDelayMs ?? PLACEMENT_ITEM_DEFAULTS.transitionDelayMs);

    watchChange(
        () => props.placement,
        () => {
            isGliding = context.getTransitionDurationMs() > NO_TRANSITION_MS;
        },
        { isBeforeRender: true },
    );

    $effect(() => {
        const element = item;

        props.placement;

        if (!element || !isGliding) return;

        untrack(() =>
            glideWatcher.watch(element, () => {
                isGliding = false;
            }),
        );
    });

    const effectStyle = $derived(PlacementItemUtils.computeEffectStyle(props.placement, context));

    const transition = $derived(
        isGliding ? PlacementItemUtils.toTransition(context.getTransitionDurationMs(), transitionDelayMs) : undefined,
    );

    const style = $derived(
        toStyle(PlacementItemUtils.computeStyleValues(props.placement, props.stackAt, effectStyle, transition)),
    );
</script>

<div bind:this={item} class={styles.placementItem} {style} role="presentation">
    {@render props.children?.()}
</div>
