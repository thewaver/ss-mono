<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CarouselPickProps } from "./CarouselContent.types";

    let props: CarouselPickProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.carouselPick,
        layerClass,
        props.renderProps.isCurrent && styles.isCurrent,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isActive && styles.isActive,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
></div>
