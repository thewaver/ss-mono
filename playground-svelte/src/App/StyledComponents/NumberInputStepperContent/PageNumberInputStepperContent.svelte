<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NumberInputStepperContent/NumberInputStepperContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { NumberInputStepperContentProps } from "./NumberInputStepperContent.types";

    let props: NumberInputStepperContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.numberInputStepperButton,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <span aria-hidden="true">{props.direction === "up" ? "▲" : "▼"}</span><span
        class={styles.numberInputStepperName}>{@render props.children?.()}</span
    >
</div>
