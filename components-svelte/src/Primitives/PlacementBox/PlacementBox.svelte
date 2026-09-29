<script lang="ts">
    import {
        PLACEMENT_BOX_DEFAULTS,
        PlacementBoxUtils,
        PlacementUtils,
        PlacementBoxStyles as styles,
    } from "@thewaver/ss-components";

    import { MediaQueryMonitorSvelteUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import { PointerTrackerSvelteUtils } from "../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { setPlacementBoxContext } from "./PlacementBox.context.js";
    import type { PlacementBoxProps } from "./PlacementBox.types.js";

    let { ref = $bindable(), ...props }: PlacementBoxProps = $props();

    const hasEffect = $derived(props.computeEffect !== undefined);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? PLACEMENT_BOX_DEFAULTS.transitionDurationMs);

    const pointer = PointerTrackerSvelteUtils.create(
        () => ref,
        () => !hasEffect,
    );

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion(
        () => !PlacementBoxUtils.getIsMotionQueryNeeded(hasEffect, transitionDurationMs),
    );

    const pointerPoint = $derived(
        PlacementBoxUtils.computePointerPoint(
            props.layout,
            pointer.getReading().boxRatio,
            pointer.getIsPointerPresent(),
            hasEffect,
        ),
    );

    const arrangement = $derived(PlacementBoxUtils.computeArrangement(props.layout, hasEffect));

    const overreach = $derived(PlacementBoxUtils.computeOverreach(props.layout, pointerPoint));

    const effectiveDurationMs = $derived(
        PlacementBoxUtils.computeTransitionDurationMs(transitionDurationMs, getPrefersReducedMotion()),
    );

    setPlacementBoxContext({
        getPointerPoint: () => pointerPoint,
        getArrangement: () => arrangement,
        getOverreach: () => overreach,
        getPrefersReducedMotion,
        getComputeEffect: () => props.computeEffect,
        getTransitionDurationMs: () => effectiveDurationMs,
    });
</script>

<div bind:this={ref} class={styles.placementBox} role="presentation">
    <div
        class={styles.placementSpacer}
        style:height={PlacementUtils.toContainerWidth(props.layout.heightRatio)}
        aria-hidden="true"
    ></div>

    {@render props.children?.()}
</div>
