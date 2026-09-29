<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/MeridiemToggleContent/MeridiemToggleContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { MeridiemToggleContentProps } from "./MeridiemToggleContent.types";

    let props: MeridiemToggleContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.meridiemToggle,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {props.meridiem === "am" ? "AM" : "PM"}
</div>
