import { useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ConsumerSortedExample } from "./Examples/ConsumerSorted";
import { DisabledExample } from "./Examples/Disabled";
import { PartsExample } from "./Examples/Parts";
import { ReorderableExample } from "./Examples/Reorderable";
import { ResizableExample } from "./Examples/Resizable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { SingleSelectionExample } from "./Examples/SingleSelection";
import { VirtualizedExample } from "./Examples/Virtualized";
import type { Part } from "./TablePage.types";
import { STRESS_PART_COUNT, createStressParts } from "./TablePageReact.const";

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

    const rightToLeftSortState = useState<TableSort | undefined>();
    const rightToLeftSelectionState = useState<Part[]>([]);
    const rightToLeftWidthsState = useState<Record<string, number>>({});
    const rightToLeftOrderState = useState<string[]>([]);

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
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `sort: ${spellSort(defaultSortState[0])} | selected: ${spellSelection(defaultSelectionState[0])} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
            component: () => <PartsExample sort={defaultSortState} selection={defaultSelectionState} />,
            path: `${EXAMPLES_ROOT}/Parts.tsx`,
        },
        {
            key: "singleSelection",
            name: EXAMPLE_NAMES.singleSelection,
            readout: () =>
                `selected: ${spellSelection(singleSelectionState[0])} — the same grid with room for one row in the selection, so picking a second drops the first`,
            component: () => <SingleSelectionExample sort={singleSortState} selection={singleSelectionState} />,
            path: `${EXAMPLES_ROOT}/SingleSelection.tsx`,
        },
        {
            key: "resizable",
            span: 2,
            name: EXAMPLE_NAMES.resizable,
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
            name: EXAMPLE_NAMES.reorderable,
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
            key: "rightToLeft",
            span: 2,
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `widths: ${JSON.stringify(rightToLeftWidthsState[0])} | order: ${rightToLeftOrderState[0].join(", ") || "as declared"} — the box around the table sets dir="rtl", so the columns run from the right, a column's resize edge is on its left, and the arrows swap meaning`,
            component: () => (
                <RightToLeftExample
                    sort={rightToLeftSortState}
                    selection={rightToLeftSelectionState}
                    widths={rightToLeftWidthsState}
                    order={rightToLeftOrderState}
                />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "consumerSorted",
            name: EXAMPLE_NAMES.consumerSorted,
            readout: () =>
                `sort: ${spellSort(consumerSortState[0])} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
            component: () => <ConsumerSortedExample sort={consumerSortState} selection={consumerSelectionState} />,
            path: `${EXAMPLES_ROOT}/ConsumerSorted.tsx`,
        },
        {
            key: "virtualized",
            span: 2,
            name: EXAMPLE_NAMES.virtualized,
            readout: () =>
                `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelectionState[0].length} selected | sort: ${spellSort(stressSortState[0])} — the header stays put, and only the rows on screen exist`,
            component: () => (
                <VirtualizedExample rows={stressParts} sort={stressSortState} selection={stressSelectionState} />
            ),
            path: `${EXAMPLES_ROOT}/Virtualized.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () =>
                `sort: ${spellSort(disabledSortState[0])} — nothing sorts, nothing selects, and every cell still reads out to a screen reader`,
            component: () => <DisabledExample sort={disabledSortState} selection={disabledSelectionState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
