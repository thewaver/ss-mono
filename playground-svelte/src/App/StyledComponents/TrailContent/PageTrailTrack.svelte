<svelte:options namespace="svg" />

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTrailTrackProps } from "./TrailContent.types";

    let props: PageTrailTrackProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<path class={[styles.trailTrack, layerClass]} d={props.path} />
