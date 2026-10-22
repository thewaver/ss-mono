<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CarouselPickProps } from "./CarouselContentSvelte.types";

    let props: CarouselPickProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.carouselPick,
        layerClass,
        props.isCurrent && styles.isCurrent,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
></div>
