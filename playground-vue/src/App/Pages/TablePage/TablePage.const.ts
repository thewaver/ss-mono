import { h } from "vue";

import type { TableColumn } from "@thewaver/ss-components-vue";
import { formatPrice } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.const";

import PageTableHeader from "../../PageComponents/TableHeader/TableHeader.vue";
import PageTableCellContent from "../../StyledComponents/TableContent/PageTableCellContent.vue";
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
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps }, () => "SKU"),
        renderCell: ({ row, renderProps }) => h(PageTableCellContent, { renderProps }, () => row.sku),
    },
    {
        id: "name",
        header: "Name",
        minWidthPx: 140,
        isSortable: true,
        isResizable: defs.isResizable,
        isReorderable: defs.isReorderable,
        compare: (a, b) => a.name.localeCompare(b.name),
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps }, () => "Name"),
        renderCell: ({ row, renderProps }) => h(PageTableCellContent, { renderProps }, () => row.name),
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
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps }, () => "Category"),
        renderCell: ({ row, renderProps }) => h(PageTableCellContent, { renderProps }, () => row.category),
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
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps, align: "end" }, () => "In stock"),
        renderCell: ({ row, renderProps }) =>
            h(PageTableCellContent, { renderProps, align: "end" }, () => row.stock.toLocaleString("en-GB")),
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
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps, align: "end" }, () => "Price"),
        renderCell: ({ row, renderProps }) =>
            h(PageTableCellContent, { renderProps, align: "end" }, () => formatPrice(row.pricePence)),
    },
];
