<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TextFieldPlaceholderProps } from "./TextFieldPlaceholder.types";

    let props: TextFieldPlaceholderProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.textFieldPlaceholder,
        layerClass,
        props.isTopAligned && styles.isTopAligned,
        props.flags.isEmpty && styles.isEmpty,
    ]}
    aria-hidden="true"
>
    {@render props.children?.()}
</div>
