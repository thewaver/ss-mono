<script lang="ts" module>
    import type { TableCellRenderProps, TableColumn, TableColumnRenderProps } from "@thewaver/ss-components-svelte";
    import { formatPrice } from "@thewaver/ss-playground/App/Pages/TablePage/TableParts.const";

    import PageTableHeader from "../../PageComponents/TableHeader/TableHeader.svelte";
    import PageTableCellContent from "../../StyledComponents/TableContent/PageTableCellContent.svelte";
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
            renderHeader: skuHeader,
            renderCell: skuCell,
        },
        {
            id: "name",
            header: "Name",
            minWidthPx: 140,
            isSortable: true,
            isResizable: defs.isResizable,
            isReorderable: defs.isReorderable,
            compare: (a, b) => a.name.localeCompare(b.name),
            renderHeader: nameHeader,
            renderCell: nameCell,
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
            renderHeader: categoryHeader,
            renderCell: categoryCell,
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
            renderHeader: stockHeader,
            renderCell: stockCell,
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
            renderHeader: priceHeader,
            renderCell: priceCell,
        },
    ];
</script>

{#snippet skuHeader(renderProps: TableColumnRenderProps)}
    <PageTableHeader {renderProps}>SKU</PageTableHeader>
{/snippet}

{#snippet skuCell(part: Part, renderProps: TableCellRenderProps)}
    <PageTableCellContent {renderProps}>{part.sku}</PageTableCellContent>
{/snippet}

{#snippet nameHeader(renderProps: TableColumnRenderProps)}
    <PageTableHeader {renderProps}>Name</PageTableHeader>
{/snippet}

{#snippet nameCell(part: Part, renderProps: TableCellRenderProps)}
    <PageTableCellContent {renderProps}>{part.name}</PageTableCellContent>
{/snippet}

{#snippet categoryHeader(renderProps: TableColumnRenderProps)}
    <PageTableHeader {renderProps}>Category</PageTableHeader>
{/snippet}

{#snippet categoryCell(part: Part, renderProps: TableCellRenderProps)}
    <PageTableCellContent {renderProps}>{part.category}</PageTableCellContent>
{/snippet}

{#snippet stockHeader(renderProps: TableColumnRenderProps)}
    <PageTableHeader {renderProps} align={"end"}>In stock</PageTableHeader>
{/snippet}

{#snippet stockCell(part: Part, renderProps: TableCellRenderProps)}
    <PageTableCellContent {renderProps} align={"end"}>{part.stock.toLocaleString("en-GB")}</PageTableCellContent>
{/snippet}

{#snippet priceHeader(renderProps: TableColumnRenderProps)}
    <PageTableHeader {renderProps} align={"end"}>Price</PageTableHeader>
{/snippet}

{#snippet priceCell(part: Part, renderProps: TableCellRenderProps)}
    <PageTableCellContent {renderProps} align={"end"}>{formatPrice(part.pricePence)}</PageTableCellContent>
{/snippet}
