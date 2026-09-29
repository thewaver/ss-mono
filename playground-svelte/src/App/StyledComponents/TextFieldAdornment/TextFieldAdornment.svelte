<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldAdornment/TextFieldAdornment.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TextFieldAdornmentProps } from "./TextFieldAdornment.types";

    let props: TextFieldAdornmentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.textFieldAdornment,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}
</div>
