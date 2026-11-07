<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { AccordionWrapperProps } from "./AccordionContentSvelte.types";

    let props: AccordionWrapperProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.accordionWrapper,
        layerClass,
        props.flags.isExpanded && styles.isExpanded,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
