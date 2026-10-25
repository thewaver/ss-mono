<script lang="ts">
    import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

    import ArrowBedTooltip from "../ArrowBedTooltip.svelte";
    import type { ArrowBedDocsExampleProps } from "../TooltipPageSvelte.types";

    const CENTER_INDEX = 4;

    const CELLS = [
        ...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX),
        undefined,
        ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX),
    ];

    type Props = ArrowBedDocsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.arrowBed}>
    {#each CELLS as placement, index (index)}
        {#if placement === undefined}
            <div class={styles.arrowBedAnchor}></div>
        {:else}
            <ArrowBedTooltip
                arrow={props.arrow}
                arrowWidth={props.arrowWidth}
                arrowLength={props.arrowLength}
                shape={props.shape}
                computeAim={(size) => computeArrowBedAim(placement, size)}
                label={`${placement.x} ${placement.y}`}
            />
        {/if}
    {/each}
</div>
