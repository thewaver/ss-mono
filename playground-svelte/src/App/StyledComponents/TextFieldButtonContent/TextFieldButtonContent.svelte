<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldButtonContent/TextFieldButtonContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TextFieldButtonContentProps } from "./TextFieldButtonContentSvelte.types";

    let props: TextFieldButtonContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.textFieldButtonContent,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
