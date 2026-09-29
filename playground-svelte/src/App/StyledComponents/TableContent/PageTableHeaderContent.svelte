<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TableAlign, TableHeaderContentProps } from "./TableContent.types";

    const DEFAULT_ALIGN: TableAlign = "start";

    let props: TableHeaderContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.tableHeaderContent,
        styles.alignVariants[props.align ?? DEFAULT_ALIGN],
        layerClass,
        props.renderProps.isSortable && styles.isSortable,
        props.renderProps.isResizable && styles.isResizable,
        props.renderProps.sortDirection !== undefined && styles.isSorted,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
