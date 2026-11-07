<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SelectOptionContentProps } from "./SelectOptionContentSvelte.types";

    let props: SelectOptionContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.selectOptionContent,
        layerClass,
        props.hasHoverFloater && styles.hasHoverFloater,
        props.hasSelectionFloater && styles.hasSelectionFloater,
        (props.flags.isHovered || props.flags.isHighlighted) && styles.isHovered,
        props.flags.isSelected && styles.isSelected,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <div class={styles.selectOptionText}>
        <div>{@render props.children?.()}</div>

        {#if props.description}
            <div class={styles.selectOptionDescription}>{props.description}</div>
        {/if}
    </div>

    {#if props.shortcut}
        <div class={styles.selectOptionShortcut}>{props.shortcut}</div>
    {/if}

    {#if props.hasMark ?? true}
        <div class={styles.selectOptionMark} aria-hidden="true">✓</div>
    {/if}
</div>
