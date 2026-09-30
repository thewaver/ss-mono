<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTimelineBlockProps } from "./TimelineContent.types";

    let props: PageTimelineBlockProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const flags = $derived(props.flags);
</script>

<div
    class={[
        `${styles.timelineBlock} ${styles.timelineBlockFamily[props.family]}`,
        layerClass,
        flags.isHovered && styles.isHovered,
        flags.isFocusVisible && styles.isFocusVisible,
        flags.isDisabled && styles.isDisabled,
        flags.heldEdge === "start" && styles.isHeldStart,
        flags.heldEdge === "end" && styles.isHeldEnd,
    ]}
>
    <span class={styles.timelineBlockName}>{props.name}</span><span class={styles.timelineBlockNote}>{props.note}</span>
</div>
