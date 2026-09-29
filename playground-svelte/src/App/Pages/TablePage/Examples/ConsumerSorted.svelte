<script lang="ts">
    import type {
        TableCellRenderProps,
        TableColumn,
        TableColumnRenderProps,
        TableSort,
    } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableHeader from "../../../PageComponents/TableHeader/TableHeader.svelte";
    import PageTableCellContent from "../../../StyledComponents/TableContent/PageTableCellContent.svelte";
    import { PARTS } from "../TablePage.const.svelte";
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
            renderHeader: skuHeader,
            renderCell: skuCell,
        },
        {
            id: "name",
            header: "Name",
            minWidthPx: 140,
            isSortable: true,
            renderHeader: nameHeader,
            renderCell: nameCell,
        },
        {
            id: "category",
            header: "Category",
            widthPx: 140,
            renderHeader: categoryHeader,
            renderCell: categoryCell,
        },
    ];

    type Props = TableExampleProps;

    let { sort = $bindable(), selection = $bindable() }: Props = $props();

    let rows = $state.raw<Part[]>(PARTS);

    const reorder = (sort: TableSort | undefined) => {
        if (sort === undefined) {
            rows = PARTS;

            return;
        }

        const sign = sort.direction === "ascending" ? 1 : -1;

        rows = [...rows].sort((a, b) => sign * COMPARATORS[sort.columnId](a, b));
    };
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

<div class={styles.tableFrameShort}>
    <Table
        columns={COLUMNS}
        {rows}
        bind:sort
        bind:selection
        ariaLabel={"Parts sorted by the page"}
        onSortChange={reorder}
    />
</div>
