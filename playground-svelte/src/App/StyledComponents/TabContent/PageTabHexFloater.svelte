<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TabFloaterProps } from "./TabContent.types";

    let props: TabFloaterProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.hexTabFloater, layerClass, props.visibilityTarget === 1 && styles.isVisible]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
    data-floater=""
></div>
