<svelte:options namespace="svg" />

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageCirclePackingLabelProps } from "./CirclePackingContent.types";

    const LABEL_SHOWN = 1;
    const LABEL_HIDDEN = 0;

    let props: PageCirclePackingLabelProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<text
    class={[styles.circlePackingLabel, layerClass]}
    style:fill-opacity={props.state.isInView ? LABEL_SHOWN : LABEL_HIDDEN}
    style:stroke-opacity={props.state.isInView ? LABEL_SHOWN : LABEL_HIDDEN}
    x={props.state.x}
    y={props.state.y}
    text-anchor="middle"
    dy="0.35em"
>
    {props.name}
</text>
