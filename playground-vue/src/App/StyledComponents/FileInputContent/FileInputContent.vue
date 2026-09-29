<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileInputContent/FileInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileInputContentProps } from "./FileInputContent.types";

const NO_FILES = "none picked";
const PICK_FILE_MARK = "⬆️";

defineProps<FileInputContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.fileInputContent,
            layerClass,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.hasError && styles.hasError,
        ]"
        aria-hidden="true"
    >
        <div :class="styles.fileInputPrompt">{{ PICK_FILE_MARK }}</div>

        <div :class="[styles.fileInputNames, !renderProps.files.length && styles.isEmpty]">
            {{ renderProps.files.length ? renderProps.files.map((file) => file.name).join(", ") : NO_FILES }}
        </div>
    </div>
</template>
