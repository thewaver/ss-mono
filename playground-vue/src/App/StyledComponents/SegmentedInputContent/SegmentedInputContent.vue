<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SegmentedInputContent/SegmentedInputContent.css";
import * as fieldStyles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SegmentedInputCellProps } from "./SegmentedInputContent.types";

defineProps<SegmentedInputCellProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.segmentedInputCell,
            layerClass,
            renderProps.hasCaret && renderProps.isFocusVisible && styles.hasCaret,
            renderProps.isSelected && styles.isSelected,
            renderProps.isHovered && fieldStyles.isHovered,
            renderProps.isDisabled && fieldStyles.isDisabled,
            renderProps.hasError && fieldStyles.hasError,
        ]"
        :data-has-caret="renderProps.hasCaret || undefined"
        :data-selected="renderProps.isSelected || undefined"
    >
        {{ renderProps.char ?? "" }}
    </div>
</template>
