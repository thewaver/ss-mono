<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ColorFieldTriggerProps } from "./ColorAreaContent.types";

    let props: ColorFieldTriggerProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.colorFieldTrigger,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
