<script lang="ts">
import type { InteractionFlags, SelectFlags, TextFieldTextStyle } from "@thewaver/ss-components-vue";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectContent/SelectContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

export const computePageSelectTextStyle = (flags: InteractionFlags<SelectFlags>): TextFieldTextStyle => ({
    color: flags.isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
    caretColor: themeVars.color.primary.main,
    fontSize: styles.FIELD_FONT_SIZE,
    lineHeight: styles.FIELD_LINE_HEIGHT,
});
</script>

<script setup lang="ts">
import { useLayerClass } from "../Layer/Layer.context";
import type { SelectContentProps } from "./SelectContent.types";

defineProps<SelectContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.selectContent,
            layerClass,
            flags.isEmpty && styles.isEmpty,
            flags.isFiltering && styles.isFiltering,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isOpen && styles.isOpen,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
        :style="{ width: width ? `${width}px` : undefined }"
    >
        <div :class="styles.selectValue"><slot /></div>
        <div v-if="hasClearSpace && !flags.isEmpty" :class="styles.selectClearSpace" />
        <div :class="styles.selectChevron" />
    </div>
</template>
