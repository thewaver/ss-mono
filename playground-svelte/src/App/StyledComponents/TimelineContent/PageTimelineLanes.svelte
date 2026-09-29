<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTimelineLanesProps } from "./TimelineContent.types";

    let props: PageTimelineLanesProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.timelineLanes, layerClass]}>
    {#each props.names as name, index (index)}
        <div
            class={styles.timelineLaneName}
            style:height={`${props.laneSize}px`}
            style:margin-top={index === 0 ? undefined : `${props.laneGap}px`}
        >
            {name}
        </div>
    {/each}
</div>
