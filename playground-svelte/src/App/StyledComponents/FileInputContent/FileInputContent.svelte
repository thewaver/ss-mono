<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileInputContent/FileInputContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FileInputContentProps } from "./FileInputContent.types";

    const NO_FILES = "none picked";
    const PICK_FILE_MARK = "⬆️";

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
        {props.renderProps.files.length ? props.renderProps.files.map((file) => file.name).join(", ") : NO_FILES}
    </div>
</div>
