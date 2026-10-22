<script lang="ts">
    import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

    import { createArrowBed } from "../ArrowBed.utils.svelte";
    import ArrowBedKnobs from "../ArrowBedKnobs.svelte";
    import ArrowBedTooltip from "../ArrowBedTooltip.svelte";

    const CENTER_INDEX = 4;

    const CELLS = [
        ...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX),
        undefined,
        ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX),
    ];

    const arrowBed = createArrowBed();
</script>

<div class={styles.arrowBed}>
    {#each CELLS as placement, index (index)}
        {#if placement === undefined}
            <div class={styles.arrowBedAnchor}></div>
        {:else}
            <ArrowBedTooltip
                {arrowBed}
                computeAim={(size) => computeArrowBedAim(placement, size)}
                label={`${placement.x} ${placement.y}`}
            />
        {/if}
    {/each}
</div>

<ArrowBedKnobs {arrowBed} />
