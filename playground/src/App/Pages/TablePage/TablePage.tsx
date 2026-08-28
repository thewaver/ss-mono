import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ConsumerSortedExample } from "./Examples/ConsumerSorted";
import { DisabledExample } from "./Examples/Disabled";
import { PartsExample } from "./Examples/Parts";
import { ResizableExample } from "./Examples/Resizable";
import { SingleSelectionExample } from "./Examples/SingleSelection";
import { VirtualizedExample } from "./Examples/Virtualized";
import { STRESS_PART_COUNT, createStressParts } from "./TablePage.const";
import type { Part } from "./TablePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TablePage/Examples";

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

    const consumerSortSignal = createSignal<TableSort | undefined>();
    const consumerSelectionSignal = createSignal<Part[]>([]);

    const stressSortSignal = createSignal<TableSort | undefined>();
    const stressSelectionSignal = createSignal<Part[]>([]);
    const stressParts = createStressParts();

    const disabledSortSignal = createSignal<TableSort | undefined>();
    const disabledSelectionSignal = createSignal<Part[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "default",
            span: 2,
            name: "Default",
            readout: () =>
                `sort: ${spellSort(defaultSortSignal[0]())} | selected: ${spellSelection(defaultSelectionSignal[0]())} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
            component: () => <PartsExample sortSignal={defaultSortSignal} selectionSignal={defaultSelectionSignal} />,
            path: `${EXAMPLES_ROOT}/Parts.tsx`,
        },
        {
            key: "singleSelection",
            name: "One row at a time",
            readout: () =>
                `selected: ${spellSelection(singleSelectionSignal[0]())} — the same grid with room for one row in the selection, so picking a second drops the first`,
            component: () => (
                <SingleSelectionExample sortSignal={singleSortSignal} selectionSignal={singleSelectionSignal} />
            ),
            path: `${EXAMPLES_ROOT}/SingleSelection.tsx`,
        },
        {
            key: "resizable",
            span: 2,
            name: "Resizable columns",
            readout: () =>
                `widths: ${JSON.stringify(resizableWidthsSignal[0]())} — drag a column's right edge, or focus a header cell and hold Ctrl with the left and right arrows`,
            component: () => (
                <ResizableExample
                    sortSignal={resizableSortSignal}
                    selectionSignal={resizableSelectionSignal}
                    widthsSignal={resizableWidthsSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Resizable.tsx`,
        },
        {
            key: "consumerSorted",
            name: "Sorted by the page",
            readout: () =>
                `sort: ${spellSort(consumerSortSignal[0]())} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
            component: () => (
                <ConsumerSortedExample sortSignal={consumerSortSignal} selectionSignal={consumerSelectionSignal} />
            ),
            path: `${EXAMPLES_ROOT}/ConsumerSorted.tsx`,
        },
        {
            key: "virtualized",
            span: 2,
            name: "Virtualized",
            readout: () =>
                `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelectionSignal[0]().length} selected | sort: ${spellSort(stressSortSignal[0]())} — the header stays put, and only the rows on screen exist`,
            component: () => (
                <VirtualizedExample
                    rows={() => stressParts}
                    sortSignal={stressSortSignal}
                    selectionSignal={stressSelectionSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () =>
                `sort: ${spellSort(disabledSortSignal[0]())} — nothing sorts, nothing selects, and every cell still reads out to a screen reader`,
            component: () => (
                <DisabledExample sortSignal={disabledSortSignal} selectionSignal={disabledSelectionSignal} />
            ),
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
