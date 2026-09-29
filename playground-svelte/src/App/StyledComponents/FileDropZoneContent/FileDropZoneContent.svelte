<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FileDropZoneContentProps } from "./FileDropZoneContent.types";

    const NO_FILES = "none picked";

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
        {props.renderProps.files.length ? props.renderProps.files.map((file) => file.name).join(", ") : NO_FILES}
    </div>
</div>
