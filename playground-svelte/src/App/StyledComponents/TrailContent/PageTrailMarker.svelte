<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTrailMarkerProps } from "./TrailContent.types";

    let props: PageTrailMarkerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div id={props.id} class={[styles.trailMarker, layerClass]} aria-hidden="true"></div>
