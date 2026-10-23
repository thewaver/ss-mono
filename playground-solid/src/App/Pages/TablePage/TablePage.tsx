import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ConsumerSortedExample } from "./Examples/ConsumerSorted";
import { DisabledExample } from "./Examples/Disabled";
import { ExpandableExample } from "./Examples/Expandable";
import { PartsExample } from "./Examples/Parts";
import { PinnedExample } from "./Examples/Pinned";
import { ReorderableExample } from "./Examples/Reorderable";
import { ResizableExample } from "./Examples/Resizable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { SingleSelectionExample } from "./Examples/SingleSelection";
import { VirtualizedExample } from "./Examples/Virtualized";
import type { Part } from "./TablePage.types";
import { STRESS_PART_COUNT, createStressParts } from "./TablePageSolid.const";

const spellSort = (sort: TableSort | undefined) =>
    sort === undefined ? "unsorted" : `${sort.columnId} ${sort.direction}`;

const spellSelection = (parts: Part[]) => (parts.length < 1 ? "nothing" : parts.map((part) => part.sku).join(", "));

export const TablePage = () => {
    const defaultSortSignal = createSignal<TableSort | undefined>();
    const defaultSelectionSignal = createSignal<Part[]>([]);

    const singleSortSignal = createSignal<TableSort | undefined>();
    const singleSelectionSignal = createSignal<Part[]>([]);

    const resizableSortSignal = createSignal<TableSort | undefined>();
    const resizableSelectionSignal = createSignal<Part[]>([]);
    const resizableWidthsSignal = createSignal<Record<string, number>>({});

    const reorderableSortSignal = createSignal<TableSort | undefined>();
    const reorderableSelectionSignal = createSignal<Part[]>([]);
    const reorderableOrderSignal = createSignal<string[]>([]);

    const rightToLeftSortSignal = createSignal<TableSort | undefined>();
    const rightToLeftSelectionSignal = createSignal<Part[]>([]);
    const rightToLeftWidthsSignal = createSignal<Record<string, number>>({});
    const rightToLeftOrderSignal = createSignal<string[]>([]);

    const consumerSortSignal = createSignal<TableSort | undefined>();
    const consumerSelectionSignal = createSignal<Part[]>([]);

    const stressSortSignal = createSignal<TableSort | undefined>();
    const stressSelectionSignal = createSignal<Part[]>([]);
    const stressParts = createStressParts();

    const pinnedSortSignal = createSignal<TableSort | undefined>();
    const pinnedSelectionSignal = createSignal<Part[]>([]);
    const pinnedWidthsSignal = createSignal<Record<string, number>>({});
    const pinnedOrderSignal = createSignal<string[]>([]);

    const expandableSortSignal = createSignal<TableSort | undefined>();
    const expandableSelectionSignal = createSignal<Part[]>([]);
    const expandableExpandedSignal = createSignal<Part[]>([]);

    const disabledSortSignal = createSignal<TableSort | undefined>();
    const disabledSelectionSignal = createSignal<Part[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "default",
            span: 2,
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `sort: ${spellSort(defaultSortSignal[0]())} | selected: ${spellSelection(defaultSelectionSignal[0]())} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
            component: () => <PartsExample sort={defaultSortSignal} selection={defaultSelectionSignal} />,
            path: `${EXAMPLES_ROOT}/Parts.tsx`,
        },
        {
            key: "singleSelection",
            name: EXAMPLE_NAMES.singleSelection,
            readout: () =>
                `selected: ${spellSelection(singleSelectionSignal[0]())} — the same grid with room for one row in the selection, so picking a second drops the first`,
            component: () => <SingleSelectionExample sort={singleSortSignal} selection={singleSelectionSignal} />,
            path: `${EXAMPLES_ROOT}/SingleSelection.tsx`,
        },
        {
            key: "resizable",
            span: 2,
            name: EXAMPLE_NAMES.resizable,
            readout: () =>
                `widths: ${JSON.stringify(resizableWidthsSignal[0]())} — drag a column's right edge, or focus a header cell and hold Ctrl with the left and right arrows`,
            component: () => (
                <ResizableExample
                    sort={resizableSortSignal}
                    selection={resizableSelectionSignal}
                    widths={resizableWidthsSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Resizable.tsx`,
        },
        {
            key: "reorderable",
            span: 2,
            name: EXAMPLE_NAMES.reorderable,
            readout: () =>
                `order: ${reorderableOrderSignal[0]().join(", ") || "as declared"} — drag a header sideways, or focus a header cell and hold Shift with the left and right arrows`,
            component: () => (
                <ReorderableExample
                    sort={reorderableSortSignal}
                    selection={reorderableSelectionSignal}
                    order={reorderableOrderSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Reorderable.tsx`,
        },
        {
            key: "rightToLeft",
            span: 2,
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `widths: ${JSON.stringify(rightToLeftWidthsSignal[0]())} | order: ${rightToLeftOrderSignal[0]().join(", ") || "as declared"} — the box around the table sets dir="rtl", so the columns run from the right, a column's resize edge is on its left, and the arrows swap meaning`,
            component: () => (
                <RightToLeftExample
                    sort={rightToLeftSortSignal}
                    selection={rightToLeftSelectionSignal}
                    widths={rightToLeftWidthsSignal}
                    order={rightToLeftOrderSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "consumerSorted",
            name: EXAMPLE_NAMES.consumerSorted,
            readout: () =>
                `sort: ${spellSort(consumerSortSignal[0]())} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
            component: () => <ConsumerSortedExample sort={consumerSortSignal} selection={consumerSelectionSignal} />,
            path: `${EXAMPLES_ROOT}/ConsumerSorted.tsx`,
        },
        {
            key: "virtualized",
            span: 2,
            name: EXAMPLE_NAMES.virtualized,
            readout: () =>
                `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelectionSignal[0]().length} selected | sort: ${spellSort(stressSortSignal[0]())} — the header stays put, and only the rows on screen exist`,
            component: () => (
                <VirtualizedExample
                    rows={() => stressParts}
                    sort={stressSortSignal}
                    selection={stressSelectionSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "pinned",
            name: EXAMPLE_NAMES.pinned,
            readout: () =>
                `widths: ${JSON.stringify(pinnedWidthsSignal[0]())} | order: ${pinnedOrderSignal[0]().join(", ") || "as declared"} — SKU is held at the start and Price at the end while the rest scroll sideways; resize SKU and the scrolling columns slide under it, and a pinned column only moves among its own kind`,
            component: () => (
                <PinnedExample
                    sort={pinnedSortSignal}
                    selection={pinnedSelectionSignal}
                    widths={pinnedWidthsSignal}
                    order={pinnedOrderSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pinned.tsx`,
        },
        {
            key: "expandable",
            span: 2,
            name: EXAMPLE_NAMES.expandable,
            readout: () =>
                `open: ${spellSelection(expandableExpandedSignal[0]())} | selected: ${spellSelection(expandableSelectionSignal[0]())} — press the arrow by a SKU, or Enter on a row's first cell, to open its detail; the down arrow walks into it. Parts out of stock have nothing to open`,
            component: () => (
                <ExpandableExample
                    sort={expandableSortSignal}
                    selection={expandableSelectionSignal}
                    expanded={expandableExpandedSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Expandable.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () =>
                `sort: ${spellSort(disabledSortSignal[0]())} — nothing sorts, nothing selects, and every cell still reads out to a screen reader`,
            component: () => <DisabledExample sort={disabledSortSignal} selection={disabledSelectionSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
