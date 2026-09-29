<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioStarContent/RadioStarContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RadioStarContentProps } from "./RadioStarContent.types";

    let props: RadioStarContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.starContent,
        layerClass,
        props.isFilled && styles.isFilled,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
>
    <span aria-hidden="true">★</span>
</div>
