import type { TableColumn } from "@thewaver/ss-components-solid";
import { formatPrice } from "@thewaver/ss-playground-core/App/Pages/TablePage/TableParts.const";

import { PageTableHeader } from "../../PageComponents/TableHeader/TableHeader";
import { PageTableCellContent } from "../../StyledComponents/TableContent/TableContent";
import type { Part, PartColumnDefs } from "./TablePage.types";

export * from "@thewaver/ss-playground-core/App/Pages/TablePage/TableParts.const";

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
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.name.localeCompare(b.name),
        renderHeader: (getRenderProps) => <PageTableHeader renderProps={getRenderProps}>{"Name"}</PageTableHeader>,
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().name}</PageTableCellContent>
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
        renderHeader: (getRenderProps) => <PageTableHeader renderProps={getRenderProps}>{"Category"}</PageTableHeader>,
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps}>{getPart().category}</PageTableCellContent>
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
        renderHeader: (getRenderProps) => (
            <PageTableHeader renderProps={getRenderProps} align={"end"}>
                {"In stock"}
            </PageTableHeader>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps} align={"end"}>
                {getPart().stock.toLocaleString("en-GB")}
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
        renderHeader: (getRenderProps) => (
            <PageTableHeader renderProps={getRenderProps} align={"end"}>
                {"Price"}
            </PageTableHeader>
        ),
        renderCell: (getPart, getRenderProps) => (
            <PageTableCellContent renderProps={getRenderProps} align={"end"}>
                {formatPrice(getPart().pricePence)}
            </PageTableCellContent>
        ),
    },
];
