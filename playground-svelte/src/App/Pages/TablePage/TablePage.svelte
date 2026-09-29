<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import ConsumerSortedExample from "./Examples/ConsumerSorted.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import PartsExample from "./Examples/Parts.svelte";
    import ReorderableExample from "./Examples/Reorderable.svelte";
    import ResizableExample from "./Examples/Resizable.svelte";
    import SingleSelectionExample from "./Examples/SingleSelection.svelte";
    import VirtualizedExample from "./Examples/Virtualized.svelte";
    import { STRESS_PART_COUNT, createStressParts } from "./TablePage.const.svelte";
    import type { Part } from "./TablePage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/TablePage/Examples";

    const spellSort = (sort: TableSort | undefined) =>
        sort === undefined ? "unsorted" : `${sort.columnId} ${sort.direction}`;

    const spellSelection = (parts: Part[]) =>
        parts.length < 1 ? "nothing" : parts.map((part) => part.sku).join(", ");

    let defaultSort = $state<TableSort | undefined>();
    let defaultSelection = $state.raw<Part[]>([]);

    let singleSort = $state<TableSort | undefined>();
    let singleSelection = $state.raw<Part[]>([]);

    let resizableSort = $state<TableSort | undefined>();
    let resizableSelection = $state.raw<Part[]>([]);
    let resizableWidths = $state<Record<string, number>>({});

    let reorderableSort = $state<TableSort | undefined>();
    let reorderableSelection = $state.raw<Part[]>([]);
    let reorderableOrder = $state<string[]>([]);

    let consumerSort = $state<TableSort | undefined>();
    let consumerSelection = $state.raw<Part[]>([]);

    let stressSort = $state<TableSort | undefined>();
    let stressSelection = $state.raw<Part[]>([]);
    const stressParts = createStressParts();

    let disabledSort = $state<TableSort | undefined>();
    let disabledSelection = $state.raw<Part[]>([]);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            span: 2,
            name: "Default",
            readout: () =>
                `sort: ${spellSort(defaultSort)} | selected: ${spellSelection(defaultSelection)} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
            component: partsExample,
            path: `${EXAMPLES_ROOT}/Parts.svelte`,
        },
        {
            key: "singleSelection",
            name: "One row at a time",
            readout: () =>
                `selected: ${spellSelection(singleSelection)} — the same grid with room for one row in the selection, so picking a second drops the first`,
            component: singleSelectionExample,
            path: `${EXAMPLES_ROOT}/SingleSelection.svelte`,
        },
        {
            key: "resizable",
            span: 2,
            name: "Resizable columns",
            readout: () =>
                `widths: ${JSON.stringify(resizableWidths)} — drag a column's right edge, or focus a header cell and hold Ctrl with the left and right arrows`,
            component: resizableExample,
            path: `${EXAMPLES_ROOT}/Resizable.svelte`,
        },
        {
            key: "reorderable",
            span: 2,
            name: "Reorderable columns",
            readout: () =>
                `order: ${reorderableOrder.join(", ") || "as declared"} — drag a header sideways, or focus a header cell and hold Shift with the left and right arrows`,
            component: reorderableExample,
            path: `${EXAMPLES_ROOT}/Reorderable.svelte`,
        },
        {
            key: "consumerSorted",
            name: "Sorted by the page",
            readout: () =>
                `sort: ${spellSort(consumerSort)} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
            component: consumerSortedExample,
            path: `${EXAMPLES_ROOT}/ConsumerSorted.svelte`,
        },
        {
            key: "virtualized",
            span: 2,
            name: "Virtualized",
            readout: () =>
                `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelection.length} selected | sort: ${spellSort(stressSort)} — the header stays put, and only the rows on screen exist`,
            component: virtualizedExample,
            path: `${EXAMPLES_ROOT}/Virtualized.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () =>
                `sort: ${spellSort(disabledSort)} — nothing sorts, nothing selects, and every cell still reads out to a screen reader`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
    ];
</script>

{#snippet partsExample()}
    <PartsExample bind:sort={defaultSort} bind:selection={defaultSelection} />
{/snippet}

{#snippet singleSelectionExample()}
    <SingleSelectionExample bind:sort={singleSort} bind:selection={singleSelection} />
{/snippet}

{#snippet resizableExample()}
    <ResizableExample bind:sort={resizableSort} bind:selection={resizableSelection} bind:widths={resizableWidths} />
{/snippet}

{#snippet reorderableExample()}
    <ReorderableExample
        bind:sort={reorderableSort}
        bind:selection={reorderableSelection}
        bind:order={reorderableOrder}
    />
{/snippet}

{#snippet consumerSortedExample()}
    <ConsumerSortedExample bind:sort={consumerSort} bind:selection={consumerSelection} />
{/snippet}

{#snippet virtualizedExample()}
    <VirtualizedExample rows={stressParts} bind:sort={stressSort} bind:selection={stressSelection} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:sort={disabledSort} bind:selection={disabledSelection} />
{/snippet}

<PageExamples items={examples} />
