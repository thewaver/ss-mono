<script lang="ts" generics="T">
    import { FORMATION_DEFAULTS, type PlacementRect } from "@thewaver/ss-components";

    import PlacementBox from "../../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../../Primitives/PlacementItem/PlacementItem.svelte";
    import type { FormationProps } from "./Formation.types.js";

    const EMPTY_PLACEMENT: PlacementRect = { topShare: 0, leftShare: 0, widthShare: 0, heightShare: 0 };
    const FIRST_OCCURRENCE = 0;
    const NEXT = 1;

    let props: FormationProps<T> = $props();

    let knownIds = new Map<T, number>();
    let nextId = 0;

    const itemCount = $derived(props.items.length);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? FORMATION_DEFAULTS.transitionDurationMs);
    const staggerMs = $derived(props.staggerMs ?? FORMATION_DEFAULTS.staggerMs);

    const layout = $derived(props.computeLayout({ itemCount }));

    const entries = $derived.by(() => {
        const itemIds = new Map<T, number>();
        const occurrences = new Map<T, number>();

        props.items.forEach((item) => {
            if (itemIds.has(item)) return;

            itemIds.set(item, knownIds.get(item) ?? nextId++);
        });

        knownIds = itemIds;

        return props.items.map((item) => {
            const occurrence = occurrences.get(item) ?? FIRST_OCCURRENCE;

            occurrences.set(item, occurrence + NEXT);

            return { item, key: `${itemIds.get(item)}:${occurrence}` };
        });
    });
</script>

<PlacementBox {layout} computeEffect={props.computeEffect} {transitionDurationMs}>
    {#each entries as entry, index (entry.key)}
        {@const placement = layout.placements[index] ?? EMPTY_PLACEMENT}
        <PlacementItem
            {placement}
            stackAt={props.isStackedInReverse ? itemCount - index : index + NEXT}
            transitionDelayMs={index * staggerMs}
        >
            {@render props.renderItem(entry.item, { index, itemCount, placement })}
        </PlacementItem>
    {/each}
</PlacementBox>
