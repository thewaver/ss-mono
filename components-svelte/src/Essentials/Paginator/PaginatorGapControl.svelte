<script lang="ts">
    import { untrack } from "svelte";

    import { type PaginatorGapEntry, PaginatorStyles as styles } from "@thewaver/ss-components";

    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import type { PaginatorEntryControlProps } from "./Paginator.types.js";
    import { PaginatorSvelteUtils } from "./PaginatorSvelte.utils.svelte.js";

    let props: PaginatorEntryControlProps<PaginatorGapEntry> = $props();

    let element = $state<HTMLSpanElement>();

    const placed = PaginatorSvelteUtils.createPlacedControl(untrack(() => props.context), () => element);

    const placement = $derived(placed.getPlacement());
</script>

{#snippet gap()}
    <span bind:this={element} class={styles.paginatorGap} aria-hidden="true">
        {@render props.renderGap(props.entry, placement)}
    </span>
{/snippet}

{#if placement}
    <PlacementItem {placement} stackAt={placed.getStackAt()}>
        {@render gap()}
    </PlacementItem>
{:else}
    {@render gap()}
{/if}
