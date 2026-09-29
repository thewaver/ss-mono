<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TabCellProps } from "./TabContent.types";

    let props: TabCellProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.hexTab,
        layerClass,
        props.isSelected && styles.isSelected,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
