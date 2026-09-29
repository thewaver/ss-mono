<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/InlineEditContent/InlineEditContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { InlineEditContentProps } from "./InlineEditContent.types";

    let props: InlineEditContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());

    const isHinted = $derived(
        !props.flags.isDisabled && (props.flags.isHovered === true || props.flags.isFocusVisible === true),
    );
</script>

<div
    class={[
        styles.inlineEditContent,
        layerClass,
        isHinted && styles.isHinted,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <span class={styles.inlineEditText}>{@render props.children?.()}</span><span
        class={styles.inlineEditGlyph}
        aria-hidden="true">✎</span
    >
</div>
