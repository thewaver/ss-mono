<script lang="ts">
    import type { Snippet } from "svelte";

    import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { AccordionHeaderProps } from "./AccordionContentSvelte.types";

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
        props.flags.isExpanded && styles.headerJoins[props.side ?? COLLAPSIBLE_DEFAULTS.side],
    ]}
>
    <div>{@render props.children?.()}</div>

    <div class={styles.accordionMarker} data-side={props.side} aria-hidden="true">▶</div>
</div>
