<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileInputContent/FileInputContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FileInputContentProps } from "./FileInputContentSvelte.types";
    import {
        NO_FILES,
        PICK_FILE_MARK,
    } from "@thewaver/ss-playground/App/StyledComponents/FileInputContent/FileInputContent.const";

    let props: FileInputContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.fileInputContent,
        layerClass,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.hasError && styles.hasError,
    ]}
    aria-hidden="true"
>
    <div class={styles.fileInputPrompt}>{PICK_FILE_MARK}</div>

    <div class={[styles.fileInputNames, !props.renderProps.files.length && styles.isEmpty]}>
        {#if props.renderProps.files.length}
            {#each props.renderProps.files as file, index (index)}
                {index > 0 ? ", " : ""}<bdi>{file.name}</bdi>
            {/each}
        {:else}
            {NO_FILES}
        {/if}
    </div>
</div>
