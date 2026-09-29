<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/BreadcrumbContent/BreadcrumbContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { BreadcrumbContentProps } from "./BreadcrumbContent.types";

    let props: BreadcrumbContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.breadcrumbContent,
        layerClass,
        props.flags.isCurrent && styles.isCurrent,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
