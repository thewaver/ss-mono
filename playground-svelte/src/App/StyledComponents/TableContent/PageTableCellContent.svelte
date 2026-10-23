<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TableCellContentProps } from "./TableContentSvelte.types";
    import { DEFAULT_ALIGN } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";

    let props: TableCellContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.tableCellContent,
        styles.alignVariants[props.align ?? DEFAULT_ALIGN],
        layerClass,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.pin === "start" && styles.isPinnedStart,
        props.renderProps.pin === "end" && styles.isPinnedEnd,
        props.renderProps.isExpanded && styles.isExpanded,
    ]}
>
    {#if props.leading !== undefined}
        <div class={styles.tableCellLeading}>{@render props.leading()}</div>
    {/if}

    <div class={styles.tableText}>{@render props.children?.()}</div>
</div>
