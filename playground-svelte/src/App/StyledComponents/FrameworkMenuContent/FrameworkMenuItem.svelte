<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FrameworkMenuItemProps } from "./FrameworkMenuContent.types";

    let props: FrameworkMenuItemProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.selectOptionContent,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isHighlighted && styles.isHighlighted,
        props.flags.isChecked && styles.isSelected,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <div>{@render props.children?.()}</div>

    <div class={styles.selectOptionMark} aria-hidden="true">✓</div>
</div>
