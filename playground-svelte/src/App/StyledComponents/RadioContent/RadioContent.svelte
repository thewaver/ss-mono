<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioContent/RadioContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RadioContentProps } from "./RadioContent.types";

    let props: RadioContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.radioContent,
        layerClass,
        props.flags.checkedState === true && styles.isChecked,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
>
    <div class={styles.radioMarker}>
        <div class={styles.radioDot}></div>
    </div>

    {@render props.children?.()}
</div>
