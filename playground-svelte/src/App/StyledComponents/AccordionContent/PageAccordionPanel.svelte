<script lang="ts">
    import type { Snippet } from "svelte";

    import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { AccordionPanelProps } from "./AccordionContentSvelte.types";

    let props: AccordionPanelProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.accordionPanel,
        layerClass,
        props.visibilityTarget === 1 && styles.panelJoins[props.side ?? COLLAPSIBLE_DEFAULTS.side],
    ]}
    style:opacity={props.visibilityTarget}
    style:transition={`opacity ${props.transitionDurationMs}ms`}
>
    {@render props.children?.()}
</div>
