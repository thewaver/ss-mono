import { createMemo, createSignal } from "solid-js";

import type { TableColumn, TableSort } from "@thewaver/ss-components";
import { Table } from "@thewaver/ss-components";

import { PageTableCellContent, PageTableHeaderContent } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

import * as styles from "../TablePage.css";

const COMPARATORS: Record<string, (a: Part, b: Part) => number> = {
    sku: (a, b) => a.sku.localeCompare(b.sku),
    name: (a, b) => a.name.localeCompare(b.name),
};

const COLUMNS: TableColumn<Part>[] = [
    {
        id: "sku",
        header: "SKU",
        widthPx: 110,
        isSortable: true,
        renderHeader: (getFlags) => <PageTableHeaderContent flags={getFlags}>{"SKU"}</PageTableHeaderContent>,
        renderCell: (getPart, getFlags) => (
            <PageTableCellContent flags={getFlags}>{getPart().sku}</PageTableCellContent>
        ),
    },
    {
        id: "name",
        header: "Name",
        minWidthPx: 140,
        isSortable: true,
        renderHeader: (getFlags) => <PageTableHeaderContent flags={getFlags}>{"Name"}</PageTableHeaderContent>,
        renderCell: (getPart, getFlags) => (
            <PageTableCellContent flags={getFlags}>{getPart().name}</PageTableCellContent>
        ),
    },
    {
        id: "category",
        header: "Category",
        widthPx: 140,
        renderHeader: (getFlags) => <PageTableHeaderContent flags={getFlags}>{"Category"}</PageTableHeaderContent>,
        renderCell: (getPart, getFlags) => (
            <PageTableCellContent flags={getFlags}>{getPart().category}</PageTableCellContent>
        ),
    },
];

export const ConsumerSortedExample = (props: TableExampleProps) => {
    const [getRows, setRows] = createSignal<Part[]>(PARTS);

    const getColumns = createMemo(() => COLUMNS);

    const reorder = (sort: TableSort | undefined) => {
        if (sort === undefined) {
            setRows(() => PARTS);

            return;
        }

        const sign = sort.direction === "ascending" ? 1 : -1;

        setRows((prev) => [...prev].sort((a, b) => sign * COMPARATORS[sort.columnId](a, b)));
    };

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={getRows}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                ariaLabel={"Parts sorted by the page"}
                onSortChange={reorder}
            />
        </div>
    );
};
