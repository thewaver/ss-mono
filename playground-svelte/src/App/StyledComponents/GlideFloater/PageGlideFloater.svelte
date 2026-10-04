<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { GlideFloaterProps } from "./GlideFloater.types";

    let props: GlideFloaterProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        props.kind === "selection" ? styles.selectionGlideFloater : styles.highlightGlideFloater,
        layerClass,
        props.visibilityTarget === 1 && styles.isVisible,
    ]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
    data-floater={props.kind}
></div>
