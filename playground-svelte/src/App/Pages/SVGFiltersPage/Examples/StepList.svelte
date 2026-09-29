<script lang="ts">
    import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-svelte";
    import { Sortable } from "@thewaver/ss-components-svelte";
    import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        STEP_LIST_GAP,
        STEP_LIST_MIN_HEIGHT,
        computeStepKey,
        computeStepLabel,
    } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
    import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFiltersPage.css";

    import PageSortableItemContent from "../../../StyledComponents/SortableContent/PageSortableItemContent.svelte";
    import PageSortableMarker from "../../../StyledComponents/SortableContent/PageSortableMarker.svelte";
    import PageSortableSurface from "../../../StyledComponents/SortableContent/PageSortableSurface.svelte";

    const GROUP_ID = "svgFiltersSteps";

    const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

    let {
        items = $bindable(),
        ...props
    }: {
        items: SortableItem<SVGFiltersStep>[];
        caption: string;
        emptyText: string;
    } = $props();
</script>

{#snippet renderStep(item: SortableItem<SVGFiltersStep>, flags: InteractionFlags<SortableItemFlags>)}
    <PageSortableItemContent {flags}>{item.value.name}</PageSortableItemContent>
{/snippet}

<div class={styles.stepColumn}>
    <div class={styles.stepCaption}>{props.caption}</div>

    <Sortable
        bind:items
        groupId={GROUP_ID}
        ariaLabel={props.caption}
        announcements={SORTABLE_ANNOUNCEMENTS}
        orientation={"vertical"}
        sizing={"fill"}
        gap={STEP_LIST_GAP}
        minHeight={STEP_LIST_MIN_HEIGHT}
        computeItemKey={computeStepKey}
        computeItemLabel={computeStepLabel}
        renderItem={renderStep}
    >
        {#snippet renderCarried(item)}
            {@render renderStep(item, RESTING_FLAGS)}
        {/snippet}

        {#snippet renderMarker(orientation)}
            <PageSortableMarker {orientation} />
        {/snippet}

        {#snippet renderDecoration(flags)}
            <PageSortableSurface {flags} emptyText={props.emptyText} />
        {/snippet}
    </Sortable>
</div>
