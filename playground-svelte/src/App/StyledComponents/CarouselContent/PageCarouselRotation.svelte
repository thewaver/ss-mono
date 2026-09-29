<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CarouselRotationProps } from "./CarouselContent.types";

    const ROTATION_GLYPHS = {
        playing: "❙❙",
        stopped: "▶",
    };

    let props: CarouselRotationProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.carouselButton,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {props.flags.isPlaying ? ROTATION_GLYPHS.playing : ROTATION_GLYPHS.stopped}
</div>
