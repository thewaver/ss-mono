<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SatelliteContent/SatelliteContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageSatelliteBadgeProps } from "./SatelliteContent.types";

    let props: PageSatelliteBadgeProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.satelliteBadge, layerClass, props.isMuted && styles.satelliteBadgeMuted]}
    style:width={`${props.size}px`}
    style:height={`${props.size}px`}
>
    {@render props.children?.()}
</div>
