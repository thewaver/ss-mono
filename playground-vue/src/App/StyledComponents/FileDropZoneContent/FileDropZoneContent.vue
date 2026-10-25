<script setup lang="ts">
import { NO_FILES } from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileDropZoneContentProps } from "./FileDropZoneContentVue.types";

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
            <template v-if="renderProps.files.length">
                <template v-for="(file, index) in renderProps.files" :key="index"
                    >{{ index > 0 ? ", " : "" }}<bdi>{{ file.name }}</bdi></template
                >
            </template>
            <template v-else>{{ NO_FILES }}</template>
        </div>
    </div>
</template>
