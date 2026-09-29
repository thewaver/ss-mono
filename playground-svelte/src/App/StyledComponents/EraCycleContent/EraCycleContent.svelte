<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/EraCycleContent/EraCycleContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { EraCycleContentProps } from "./EraCycleContent.types";

    let props: EraCycleContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.eraCycle,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {@render props.children?.()}
</div>
