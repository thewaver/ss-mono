<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorInputContent/ColorInputContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ColorInputContentProps } from "./ColorInputContent.types";

    let props: ColorInputContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.colorInputContent,
        layerClass,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.hasError && styles.hasError,
    ]}
    aria-hidden="true"
>
    <div class={styles.colorInputSwatch} style:background-color={props.renderProps.value}></div>

    {#if !props.isCompact}
        <div class={styles.colorInputValue}>{props.renderProps.value}</div>
    {/if}
</div>
