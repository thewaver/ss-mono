<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { AccordionPanelProps } from "./AccordionContent.types";

    let props: AccordionPanelProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.accordionPanel, layerClass]}
    style:opacity={props.visibilityTarget}
    style:transition={`opacity ${props.transitionDurationMs}ms`}
>
    {@render props.children?.()}
</div>
