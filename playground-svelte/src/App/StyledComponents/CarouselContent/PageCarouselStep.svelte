<script lang="ts">
    import type { CarouselStep } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CarouselStepProps } from "./CarouselContent.types";

    const STEP_GLYPHS: Record<CarouselStep, string> = {
        previous: "‹",
        next: "›",
    };

    let props: CarouselStepProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.carouselButton,
        layerClass,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isActive && styles.isActive,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {STEP_GLYPHS[props.renderProps.step]}
</div>
