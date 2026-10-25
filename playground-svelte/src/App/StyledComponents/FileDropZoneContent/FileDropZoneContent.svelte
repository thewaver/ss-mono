<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FileDropZoneContentProps } from "./FileDropZoneContentSvelte.types";
    import { NO_FILES } from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.const";

    let props: FileDropZoneContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.fileDropZoneContent,
        layerClass,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDragOver && styles.isDragOver,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.hasError && styles.hasError,
    ]}
    aria-hidden="true"
>
    <div class={styles.fileDropZonePrompt}>{props.prompt}</div>

    <div class={[styles.fileDropZoneNames, !props.renderProps.files.length && styles.isEmpty]}>
        {#if props.renderProps.files.length}
            {#each props.renderProps.files as file, index (index)}
                {index > 0 ? ", " : ""}<bdi>{file.name}</bdi>
            {/each}
        {:else}
            {NO_FILES}
        {/if}
    </div>
</div>
