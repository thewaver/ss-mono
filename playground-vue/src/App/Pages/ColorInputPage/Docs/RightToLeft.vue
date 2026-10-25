<script setup lang="ts">
import { shallowRef } from "vue";

import { ColorInput } from "@thewaver/ss-components-vue";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageColorPickerArea from "../../../PageComponents/ColorPicker/PageColorPickerArea.vue";
import PageColorPickerHue from "../../../PageComponents/ColorPicker/PageColorPickerHue.vue";
import PageColorPickerPanel from "../../../PageComponents/ColorPicker/PageColorPickerPanel.vue";
import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.vue";

const value = shallowRef("rgb(51 102 255)");
</script>

<template>
    <div dir="rtl">
        <ColorInput v-model:value="value" ariaLabel="Brand color in a right-to-left box" v-bind="COLOR_INPUT_LABELS">
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
    </div>
</template>
