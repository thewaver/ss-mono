<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTimelineTickProps } from "./TimelineContent.types";

    let props: PageTimelineTickProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.timelineRule, layerClass, props.tick.isMajor && styles.isMajor]}></div>

<div class={[styles.timelineTickLabel, layerClass]}>{props.label}</div>
