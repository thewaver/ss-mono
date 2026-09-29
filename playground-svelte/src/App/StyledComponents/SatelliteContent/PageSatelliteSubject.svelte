<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SatelliteContent/SatelliteContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageSatelliteSubjectProps } from "./SatelliteContent.types";

    let props: PageSatelliteSubjectProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.satelliteSubject, layerClass]}
    style:width={`${props.width}px`}
    style:height={`${props.height}px`}
>
    {@render props.children?.()}
</div>
