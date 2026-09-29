<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TagInputContent/TagInputContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TagContentProps } from "./TagInputContent.types";

    let props: TagContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.tagContent,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isFocusVisible && styles.isFocused,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {@render props.children?.()}<span class={styles.tagRemove} aria-hidden="true">✕</span>
</div>
