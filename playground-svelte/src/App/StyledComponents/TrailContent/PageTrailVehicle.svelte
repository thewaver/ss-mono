<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTrailVehicleProps } from "./TrailContent.types";

    let props: PageTrailVehicleProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div id={props.id} class={[styles.trailVehicle, layerClass]} aria-hidden="true">
    {props.label}
</div>
