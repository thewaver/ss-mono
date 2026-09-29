<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ToggleContent/ToggleContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ToggleContentProps } from "./ToggleContent.types";

    let props: ToggleContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.toggleContent,
        layerClass,
        props.flags.checkedState === true && styles.isChecked,
        props.flags.checkedState === "mixed" && styles.isMixed,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
>
    <div class={styles.toggleHandle}></div>
</div>
