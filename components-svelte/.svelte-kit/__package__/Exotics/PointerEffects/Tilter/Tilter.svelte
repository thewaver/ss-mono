<script lang="ts">
    import { PointerEffectsUtils, TILTER_DEFAULTS, TilterStyles as styles } from "@thewaver/ss-components";

    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SmootherSvelteUtils } from "../../../Abstracts/Smoother/SmootherSvelte.utils.svelte.js";
    import type { TilterProps } from "./Tilter.types.js";

    const NO_LEAN = 0;

    let props: TilterProps = $props();

    let element = $state<HTMLDivElement>();

    const isDisabled = $derived(props.isDisabled ?? false);

    const pointer = PointerTrackerSvelteUtils.create(
        () => element ?? undefined,
        () => isDisabled,
    );

    const isResting = $derived(
        PointerEffectsUtils.getIsResting(
            isDisabled,
            pointer.getIsPointerPresent(),
            pointer.getReading(),
            props.activeRangePx,
        ),
    );

    const boxRatio = $derived(PointerEffectsUtils.getBoxRatio(pointer.getReading()));

    const strength = $derived(
        isResting
            ? NO_LEAN
            : PointerEffectsUtils.computeEdgeStrength(
                  pointer.getReading(),
                  props.tiltRangePx ?? TILTER_DEFAULTS.tiltRangePx,
              ),
    );

    const getLean = SmootherSvelteUtils.create(
        () => PointerEffectsUtils.computeLeanTargets(boxRatio, strength),
        () => props.smoothingMs ?? TILTER_DEFAULTS.smoothingMs,
    );

    const tilterState = $derived(
        PointerEffectsUtils.computeTilterState(
            getLean(),
            boxRatio,
            props.maxTiltDegrees ?? TILTER_DEFAULTS.maxTiltDegrees,
            isResting,
        ),
    );
</script>

<div
    bind:this={element}
    class={styles.tilterRoot}
    style:perspective={`${props.perspectivePx ?? TILTER_DEFAULTS.perspectivePx}px`}
>
    <div class={styles.tilterSurface} style:transform={PointerEffectsUtils.getTiltTransform(tilterState.tilt)}>
        {@render props.children?.()}

        {#if props.renderSheen}
            <div class={styles.tilterSheen}>{@render props.renderSheen(tilterState)}</div>
        {/if}
    </div>
</div>
