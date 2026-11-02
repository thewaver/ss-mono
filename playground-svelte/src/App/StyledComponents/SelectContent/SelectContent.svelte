<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectContent/SelectContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SelectContentProps } from "./SelectContentSvelte.types";

    let props: SelectContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.selectContent,
        layerClass,
        props.flags.isEmpty && styles.isEmpty,
        props.flags.isFiltering && styles.isFiltering,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isOpen && styles.isOpen,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
    style:width={props.width ? `${props.width}px` : undefined}
>
    <div class={styles.selectValue}>{@render props.children?.()}</div>
    {#if props.hasClearSpace && !props.flags.isEmpty}
        <div class={styles.selectClearSpace}></div>
    {/if}
    <div class={styles.selectChevron}></div>
</div>
