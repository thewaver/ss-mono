<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { AccordionHeaderProps } from "./AccordionContent.types";

    let props: AccordionHeaderProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.accordionHeader,
        layerClass,
        props.flags.isExpanded && styles.isExpanded,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <div>{@render props.children?.()}</div>

    <div class={styles.accordionMarker} aria-hidden="true">▶</div>
</div>
