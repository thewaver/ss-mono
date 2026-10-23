<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import { TableUtils, TableStyles as styles } from "@thewaver/ss-components";

    import { setTableCellContext } from "./Table.context.js";
    import type { TableCellProps } from "./Table.types.js";

    const FIRST_ARIA_INDEX = TableUtils.FIRST_ARIA_INDEX;

    let props: TableCellProps<T> = $props();

    setTableCellContext({
        getRenderProps: () => props.renderProps,
        toggle: () => props.context.toggle(),
        registerExpander: () => props.context.registerExpander(),
    });
</script>

<div
    {@attach (element) => on(element, "click", props.onClick)}
    id={props.cellId}
    class={[styles.tableCell, props.pinClass]}
    style={props.pinStyle}
    role="gridcell"
    aria-colindex={props.columnIndex + FIRST_ARIA_INDEX}
    aria-disabled={props.isDisabled || undefined}
    tabindex={props.isRoving ? 0 : -1}
>
    {@render props.column.renderCell(props.row, props.renderProps)}
</div>
