import type { TableColumn } from "@thewaver/ss-components-react";
import { formatPrice } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.const";

import { PageTableHeader } from "../../PageComponents/TableHeader/TableHeader";
import { PageTableCellContent } from "../../StyledComponents/TableContent/TableContent";
import type { Part, PartColumnDefs } from "./TablePage.types";

export * from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.const";

export const createPartColumns = (defs: PartColumnDefs): TableColumn<Part>[] => [
    {
        id: "sku",
        header: "SKU",
        widthPx: 110,
        minWidthPx: 80,
        maxWidthPx: 260,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.sku.localeCompare(b.sku),
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
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.name.localeCompare(b.name),
        renderHeader: (renderProps) => <PageTableHeader renderProps={renderProps}>{"Name"}</PageTableHeader>,
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps}>{part.name}</PageTableCellContent>
        ),
    },
    {
        id: "category",
        header: "Category",
        widthPx: 120,
        minWidthPx: 90,
        maxWidthPx: 240,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.category.localeCompare(b.category),
        renderHeader: (renderProps) => <PageTableHeader renderProps={renderProps}>{"Category"}</PageTableHeader>,
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps}>{part.category}</PageTableCellContent>
        ),
    },
    {
        id: "stock",
        header: "In stock",
        widthPx: 100,
        minWidthPx: 70,
        maxWidthPx: 200,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.stock - b.stock,
        renderHeader: (renderProps) => (
            <PageTableHeader renderProps={renderProps} align={"end"}>
                {"In stock"}
            </PageTableHeader>
        ),
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps} align={"end"}>
                {part.stock.toLocaleString("en-GB")}
            </PageTableCellContent>
        ),
    },
    {
        id: "price",
        header: "Price",
        widthPx: 110,
        minWidthPx: 80,
        maxWidthPx: 220,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.pricePence - b.pricePence,
        renderHeader: (renderProps) => (
            <PageTableHeader renderProps={renderProps} align={"end"}>
                {"Price"}
            </PageTableHeader>
        ),
        renderCell: (part, renderProps) => (
            <PageTableCellContent renderProps={renderProps} align={"end"}>
                {formatPrice(part.pricePence)}
            </PageTableCellContent>
        ),
    },
];
