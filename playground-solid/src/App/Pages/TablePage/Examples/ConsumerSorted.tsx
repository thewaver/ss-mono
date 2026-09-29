import { createMemo, createSignal } from "solid-js";

import type { TableColumn, TableSort } from "@thewaver/ss-components-solid";
import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableHeader } from "../../../PageComponents/TableHeader/TableHeader";
import { PageTableCellContent } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

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
        renderHeader: (getRenderProps) => <PageTableHeader renderProps={getRenderProps}>{"SKU"}</PageTableHeader>,
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().sku}</PageTableCellContent>
        ),
    },
    {
        id: "name",
        header: "Name",
        minWidthPx: 140,
        isSortable: true,
        renderHeader: (getRenderProps) => <PageTableHeader renderProps={getRenderProps}>{"Name"}</PageTableHeader>,
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().name}</PageTableCellContent>
        ),
    },
    {
        id: "category",
        header: "Category",
        widthPx: 140,
        renderHeader: (getRenderProps) => <PageTableHeader renderProps={getRenderProps}>{"Category"}</PageTableHeader>,
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().category}</PageTableCellContent>
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
                sort={props.sort}
                selection={props.selection}
                ariaLabel={"Parts sorted by the page"}
                onSortChange={reorder}
            />
        </div>
    );
};
