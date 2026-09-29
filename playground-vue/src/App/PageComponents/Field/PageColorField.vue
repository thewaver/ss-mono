<script setup lang="ts">
import { ColorInput } from "@thewaver/ss-components-vue";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageColorInputContent from "../../StyledComponents/ColorInputContent/ColorInputContent.vue";
import PageColorPickerArea from "../ColorPicker/PageColorPickerArea.vue";
import PageColorPickerHue from "../ColorPicker/PageColorPickerHue.vue";
import PageColorPickerPanel from "../ColorPicker/PageColorPickerPanel.vue";
import { useFieldReset } from "./Field.context";
import type { PageColorFieldProps } from "./Field.types";

const props = defineProps<PageColorFieldProps>();

useFieldReset(props.value, (value) => props.onInput(value));
</script>

<template>
    <ColorInput
        :value="value"
        v-bind="COLOR_INPUT_LABELS"
        :is-disabled="isDisabled"
        :ariaLabel="ariaLabel"
        @update:value="props.onInput"
    >
        <template #renderContent="renderProps">
            <PageColorInputContent :render-props="renderProps" is-compact />
        </template>

        <template #renderArea="renderProps">
            <PageColorPickerArea :render-props="renderProps" />
        </template>

        <template #renderHue="renderProps">
            <PageColorPickerHue :render-props="renderProps" />
        </template>

        <template #renderPopup="{ renderSurface, hsv }">
            <PageColorPickerPanel :render-surface="renderSurface" :hsv="hsv" />
        </template>
    </ColorInput>
</template>
