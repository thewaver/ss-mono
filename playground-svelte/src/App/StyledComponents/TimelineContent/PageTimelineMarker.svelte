<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTimelineMarkerProps } from "./TimelineContent.types";

    let props: PageTimelineMarkerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

{#if props.marker.isInView}
    <div class={[`${styles.timelineMarker} ${styles.timelineMarkerTones[props.tone]}`, layerClass]}></div>
{/if}
