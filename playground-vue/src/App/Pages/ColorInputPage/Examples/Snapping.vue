<script setup lang="ts">
import { useModel } from "vue";

import { ColorInput } from "@thewaver/ss-components-vue";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { toNearestPaletteColor } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import PageColorPickerArea from "../../../PageComponents/ColorPicker/PageColorPickerArea.vue";
import PageColorPickerHue from "../../../PageComponents/ColorPicker/PageColorPickerHue.vue";
import PageColorPickerPanel from "../../../PageComponents/ColorPicker/PageColorPickerPanel.vue";
import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.vue";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const snap = (next: string) => {
    value.value = toNearestPaletteColor(next);
};
</script>

<template>
    <ColorInput v-model:value="value" ariaLabel="Palette color" v-bind="COLOR_INPUT_LABELS" @input="snap">
        <template #renderContent="renderProps">
            <PageColorInputContent :render-props="renderProps" />
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
