<script lang="ts">
import type { InteractionFlags, TextFieldTextStyle } from "@thewaver/ss-components-vue";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

export const computePageTextFieldTextStyle = (flags: InteractionFlags): TextFieldTextStyle => ({
    color: flags.isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
    caretColor: themeVars.color.primary.main,
    fontSize: styles.FIELD_FONT_SIZE,
    lineHeight: styles.FIELD_LINE_HEIGHT,
});
</script>

<script setup lang="ts">
import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldContentProps } from "./TextFieldContent.types";

defineProps<TextFieldContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.textFieldContent,
            layerClass,
            isStretched && styles.isStretched,
            flags.isHovered && styles.isHovered,
            flags.isReadOnly && styles.isReadOnly,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
        :style="{
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined,
        }"
    />
</template>
