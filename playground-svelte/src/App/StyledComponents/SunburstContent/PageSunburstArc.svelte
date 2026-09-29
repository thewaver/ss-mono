<svelte:options namespace="svg" />

<script lang="ts">
    import { SunburstUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageSunburstArcProps } from "./SunburstContent.types";

    const PAD_LENGTH = 1;
    const RING_GAP = 1;
    const MIN_LABEL_ANGLE = 0.03;
    const LABEL_SHOWN = 1;
    const LABEL_HIDDEN = 0;

    let props: PageSunburstArcProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const gradientId = $props.id();

    const isLabelShown = $derived(props.state.endAngle - props.state.startAngle > MIN_LABEL_ANGLE);
</script>

<defs>
    <linearGradient id={gradientId} x1={1} y1={0} x2={0} y2={1}>
        <stop offset={0} class={styles.sunburstStopLight[props.family]} />
        <stop offset={1} class={styles.sunburstStopDark[props.family]} />
    </linearGradient>
</defs>

<path
    class={[styles.sunburstArc, layerClass, props.state.isBranch && styles.sunburstArcBranch]}
    style:fill={`url(#${gradientId})`}
    d={SunburstUtils.computeArcPath(props.state, { padLength: PAD_LENGTH, ringGap: RING_GAP })}
>
    <title>{props.title}</title>
</path>

<text
    class={`${styles.sunburstText} ${styles.sunburstLabel[props.family]}`}
    style:fill-opacity={isLabelShown ? LABEL_SHOWN : LABEL_HIDDEN}
    transform={SunburstUtils.computeLabelTransform(props.state)}
    text-anchor="middle"
    dy="0.35em"
>
    {props.name}
</text>
