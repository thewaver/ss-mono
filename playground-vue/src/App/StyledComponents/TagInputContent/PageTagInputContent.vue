<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TagInputContent/TagInputContent.css";
import * as fieldStyles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TagInputContentProps } from "./TagInputContent.types";

defineProps<TagInputContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.tagInputContent,
            layerClass,
            flags.isHovered && fieldStyles.isHovered,
            flags.isDisabled && fieldStyles.isDisabled,
            flags.hasError && fieldStyles.hasError,
        ]"
    />
</template>
