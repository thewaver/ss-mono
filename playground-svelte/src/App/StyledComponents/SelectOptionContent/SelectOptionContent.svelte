<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SelectOptionContentProps } from "./SelectOptionContent.types";

    let props: SelectOptionContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.selectOptionContent,
        layerClass,
        !props.isGliding && props.flags.isHovered && styles.isHovered,
        !props.isGliding && props.flags.isHighlighted && styles.isHighlighted,
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

    <div class={styles.selectOptionMark} aria-hidden="true">✓</div>
</div>
