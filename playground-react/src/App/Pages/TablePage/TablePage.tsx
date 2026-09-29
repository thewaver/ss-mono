import { useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ConsumerSortedExample } from "./Examples/ConsumerSorted";
import { DisabledExample } from "./Examples/Disabled";
import { PartsExample } from "./Examples/Parts";
import { ReorderableExample } from "./Examples/Reorderable";
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
    const defaultSortState = useState<TableSort | undefined>();
    const defaultSelectionState = useState<Part[]>([]);

    const singleSortState = useState<TableSort | undefined>();
    const singleSelectionState = useState<Part[]>([]);

    const resizableSortState = useState<TableSort | undefined>();
    const resizableSelectionState = useState<Part[]>([]);
    const resizableWidthsState = useState<Record<string, number>>({});

    const reorderableSortState = useState<TableSort | undefined>();
    const reorderableSelectionState = useState<Part[]>([]);
    const reorderableOrderState = useState<string[]>([]);

    const consumerSortState = useState<TableSort | undefined>();
    const consumerSelectionState = useState<Part[]>([]);

    const stressSortState = useState<TableSort | undefined>();
    const stressSelectionState = useState<Part[]>([]);
    const [stressParts] = useState(createStressParts);

    const disabledSortState = useState<TableSort | undefined>();
    const disabledSelectionState = useState<Part[]>([]);

    const examples = [
        {
            key: "default",
            span: 2,
            name: "Default",
            readout: () =>
                `sort: ${spellSort(defaultSortState[0])} | selected: ${spellSelection(defaultSelectionState[0])} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
            component: () => <PartsExample sort={defaultSortState} selection={defaultSelectionState} />,
            path: `${EXAMPLES_ROOT}/Parts.tsx`,
        },
        {
            key: "singleSelection",
            name: "One row at a time",
            readout: () =>
                `selected: ${spellSelection(singleSelectionState[0])} — the same grid with room for one row in the selection, so picking a second drops the first`,
            component: () => <SingleSelectionExample sort={singleSortState} selection={singleSelectionState} />,
            path: `${EXAMPLES_ROOT}/SingleSelection.tsx`,
        },
        {
            key: "resizable",
            span: 2,
            name: "Resizable columns",
            readout: () =>
                `widths: ${JSON.stringify(resizableWidthsState[0])} — drag a column's right edge, or focus a header cell and hold Ctrl with the left and right arrows`,
            component: () => (
                <ResizableExample
                    sort={resizableSortState}
                    selection={resizableSelectionState}
                    widths={resizableWidthsState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Resizable.tsx`,
        },
        {
            key: "reorderable",
            span: 2,
            name: "Reorderable columns",
            readout: () =>
                `order: ${reorderableOrderState[0].join(", ") || "as declared"} — drag a header sideways, or focus a header cell and hold Shift with the left and right arrows`,
            component: () => (
                <ReorderableExample
                    sort={reorderableSortState}
                    selection={reorderableSelectionState}
                    order={reorderableOrderState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Reorderable.tsx`,
        },
        {
            key: "consumerSorted",
            name: "Sorted by the page",
            readout: () =>
                `sort: ${spellSort(consumerSortState[0])} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
            component: () => <ConsumerSortedExample sort={consumerSortState} selection={consumerSelectionState} />,
            path: `${EXAMPLES_ROOT}/ConsumerSorted.tsx`,
        },
        {
            key: "virtualized",
            span: 2,
            name: "Virtualized",
            readout: () =>
                `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelectionState[0].length} selected | sort: ${spellSort(stressSortState[0])} — the header stays put, and only the rows on screen exist`,
            component: () => (
                <VirtualizedExample rows={stressParts} sort={stressSortState} selection={stressSelectionState} />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () =>
                `sort: ${spellSort(disabledSortState[0])} — nothing sorts, nothing selects, and every cell still reads out to a screen reader`,
            component: () => <DisabledExample sort={disabledSortState} selection={disabledSelectionState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
