<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTimelineFrameProps } from "./TimelineContent.types";

    let props: PageTimelineFrameProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.timelineFrame, layerClass]}>{@render props.children?.()}</div>
