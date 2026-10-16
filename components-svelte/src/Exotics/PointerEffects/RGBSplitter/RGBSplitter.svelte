<script lang="ts">
    import { untrack } from "svelte";

    import { PointerEffectsUtils, RGB_SPLITTER_DEFAULTS, RGBSplitterStyles as styles } from "@thewaver/ss-components";
    import { RGBSplitterConst } from "@thewaver/ss-components/internal";

    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SmootherSvelteUtils } from "../../../Abstracts/Smoother/SmootherSvelte.utils.svelte.js";
    import { SVGFilterDefsFactory } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory.js";
    import Markup from "../../../Utils/Markup.svelte";
    import type { RGBSplitterProps } from "./RGBSplitter.types.js";

    let props: RGBSplitterProps = $props();

    const filterId = $props.id();

    let element = $state<HTMLDivElement>();

    const isDisabled = $derived(props.isDisabled ?? false);

    const pointer = PointerTrackerSvelteUtils.create(
        () => element ?? undefined,
        () => isDisabled,
        () => props.pointSource,
    );

    const isResting = $derived(
        PointerEffectsUtils.getIsResting(
            isDisabled,
            pointer.getIsPointerPresent(),
            pointer.getReading(),
            props.activeRangePx,
        ),
    );

    const strength = $derived(
        isResting
            ? RGBSplitterConst.NO_STRENGTH
            : PointerEffectsUtils.computeCenterStrength(
                  pointer.getReading(),
                  props.splitRangePx ?? RGB_SPLITTER_DEFAULTS.splitRangePx,
              ),
    );

    const isReached = $derived(strength > RGBSplitterConst.NO_STRENGTH);

    let wasReached = false;
    let previousOpening: ReturnType<typeof PointerEffectsUtils.openSplit> | undefined;

    const opening = $derived.by(() => {
        const reached = isReached;
        const next =
            (reached && !wasReached) || !previousOpening
                ? PointerEffectsUtils.openSplit(untrack(() => element))
                : previousOpening;

        wasReached = reached;
        previousOpening = next;

        return next;
    });

    const maxOffsetPx = $derived(props.maxOffsetPx ?? RGB_SPLITTER_DEFAULTS.maxOffsetPx);

    const getSplit = SmootherSvelteUtils.create(
        () => PointerEffectsUtils.computeSplitTargets(opening.targets, strength, maxOffsetPx),
        () => props.smoothingMs ?? RGB_SPLITTER_DEFAULTS.smoothingMs,
    );

    const filterElement = $derived.by(() => {
        const maxOffset = maxOffsetPx;

        return untrack(() =>
            new SVGFilterDefsFactory(filterId)
                .addRGBSplitFilter({
                    red: () => PointerEffectsUtils.getSplitShift(getSplit(), 0),
                    green: () => PointerEffectsUtils.getSplitShift(getSplit(), 1),
                    blue: () => PointerEffectsUtils.getSplitShift(getSplit(), 2),
                    colorMixing: () => props.colorMixing ?? opening.colorMixing,
                    maxOffset,
                })
                .computeFilterPrimitives({ method: "chain" }),
        );
    });
</script>

<div
    bind:this={element}
    class={styles.rgbSplitterRoot}
    style:filter={filterElement && PointerEffectsUtils.getIsSplit(getSplit()) ? `url(#${filterId})` : undefined}
>
    <svg class={styles.rgbSplitterFilterHost} aria-hidden="true">
        <defs><Markup markup={filterElement} /></defs>
    </svg>

    {@render props.children?.()}
</div>
