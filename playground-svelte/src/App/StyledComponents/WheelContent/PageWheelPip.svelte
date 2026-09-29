<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageWheelPipProps, PageWheelPipSide } from "./WheelContent.types";

    const PIP_PATH = "M 2 2 H 18 L 10 18 Z";

    const PIP_SIDE_STYLES: Record<PageWheelPipSide, string> = {
        top: styles.wheelPipTop,
        left: styles.wheelPipLeft,
    };

    let props: PageWheelPipProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[PIP_SIDE_STYLES[props.side], layerClass]} aria-hidden="true">
    <svg class={styles.wheelPipShape} viewBox="0 0 20 20">
        <path d={PIP_PATH} />
    </svg>
</div>
