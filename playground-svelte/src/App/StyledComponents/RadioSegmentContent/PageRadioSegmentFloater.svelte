<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioSegmentContent/RadioSegmentContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RadioSegmentFloaterProps } from "./RadioSegmentContent.types";

    let props: RadioSegmentFloaterProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.segmentFloater, layerClass, props.visibilityTarget === 1 && styles.isVisible]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
    data-floater=""
></div>
