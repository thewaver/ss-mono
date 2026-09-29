<svelte:options namespace="svg" />

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageCirclePackingCircleProps } from "./CirclePackingContent.types";

    let props: PageCirclePackingCircleProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const gradientId = $props.id();
</script>

<defs>
    <radialGradient id={gradientId} cx={0.7} cy={0.3} r={0.8}>
        <stop
            offset={0}
            class={props.state.isBranch ? styles.circlePackingStopLight : styles.circlePackingLeafStopLight}
        />
        <stop
            offset={1}
            class={props.state.isBranch ? styles.circlePackingStopDark : styles.circlePackingLeafStopDark}
        />
    </radialGradient>
</defs>

<circle
    class={[styles.circlePackingCircle, layerClass, props.state.isBranch && styles.circlePackingBranch]}
    style:fill={`url(#${gradientId})`}
    cx={props.state.x}
    cy={props.state.y}
    r={Math.max(0, props.state.radius)}
>
    <title>{props.title}</title>
</circle>
