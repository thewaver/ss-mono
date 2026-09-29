<script lang="ts" module>
    import type { PaginatorStep } from "@thewaver/ss-components-svelte";

    export const STEP_GLYPHS: Record<PaginatorStep, string> = {
        first: "«",
        previous: "‹",
        next: "›",
        last: "»",
    };
</script>

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorStepContentProps } from "./PaginatorContent.types";

    let props: PaginatorStepContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.paginatorStep,
        layerClass,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isActive && styles.isActive,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {STEP_GLYPHS[props.renderProps.step]}
</div>
