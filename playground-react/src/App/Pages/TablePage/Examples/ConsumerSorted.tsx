import { useState } from "react";

import type { TableColumn, TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
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
        renderHeader: (renderProps) => <PageTableHeader renderProps={renderProps}>{"SKU"}</PageTableHeader>,
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps}>{part.sku}</PageTableCellContent>
        ),
    },
    {
        id: "name",
        header: "Name",
        minWidthPx: 140,
        isSortable: true,
        renderHeader: (renderProps) => <PageTableHeader renderProps={renderProps}>{"Name"}</PageTableHeader>,
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps}>{part.name}</PageTableCellContent>
        ),
    },
    {
        id: "category",
        header: "Category",
        widthPx: 140,
        renderHeader: (renderProps) => <PageTableHeader renderProps={renderProps}>{"Category"}</PageTableHeader>,
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps}>{part.category}</PageTableCellContent>
        ),
    },
];

export const ConsumerSortedExample = (props: TableExampleProps) => {
    const [rows, setRows] = useState<Part[]>(PARTS);

    const reorder = (sort: TableSort | undefined) => {
        if (sort === undefined) {
            setRows(PARTS);

            return;
        }

        const sign = sort.direction === "ascending" ? 1 : -1;

        setRows((prev) => [...prev].sort((a, b) => sign * COMPARATORS[sort.columnId](a, b)));
    };

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={COLUMNS}
                rows={rows}
                sort={props.sort}
                selection={props.selection}
                ariaLabel={"Parts sorted by the page"}
                onSortChange={reorder}
            />
        </div>
    );
};
