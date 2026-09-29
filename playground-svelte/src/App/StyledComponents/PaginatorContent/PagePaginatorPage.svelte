<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorPageContentProps } from "./PaginatorContent.types";

    let props: PaginatorPageContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.paginatorPage,
        layerClass,
        props.renderProps.isCurrent && styles.isCurrent,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isActive && styles.isActive,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {props.renderProps.page}
</div>
