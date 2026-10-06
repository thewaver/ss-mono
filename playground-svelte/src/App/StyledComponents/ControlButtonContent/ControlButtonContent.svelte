<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ControlButtonContentProps } from "./ControlButtonContent.types";

    let props: ControlButtonContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.controlButton,
        layerClass,
        props.glyph !== undefined && styles.controlButtonGlyph,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden={props.glyph !== undefined || undefined}
>
    {#if props.glyph !== undefined}
        {props.glyph}
    {:else}
        {@render props.children?.()}
    {/if}
</div>
