<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileDropZoneContentProps } from "./FileDropZoneContent.types";

const NO_FILES = "none picked";

defineProps<FileDropZoneContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.fileDropZoneContent,
            layerClass,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDragOver && styles.isDragOver,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.hasError && styles.hasError,
        ]"
        aria-hidden="true"
    >
        <div :class="styles.fileDropZonePrompt">{{ prompt }}</div>

        <div :class="[styles.fileDropZoneNames, !renderProps.files.length && styles.isEmpty]">
            {{ renderProps.files.length ? renderProps.files.map((file) => file.name).join(", ") : NO_FILES }}
        </div>
    </div>
</template>
