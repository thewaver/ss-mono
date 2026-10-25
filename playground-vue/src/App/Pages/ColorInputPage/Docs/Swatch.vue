<script setup lang="ts">
import { shallowRef } from "vue";

import { ColorInput } from "@thewaver/ss-components-vue";
import {
    COLOR_INPUT_LABELS,
    computeColorValueText,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageColorPickerArea from "../../../PageComponents/ColorPicker/PageColorPickerArea.vue";
import PageColorPickerHue from "../../../PageComponents/ColorPicker/PageColorPickerHue.vue";
import PageColorPickerPanel from "../../../PageComponents/ColorPicker/PageColorPickerPanel.vue";
import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.vue";

const value = shallowRef("#3366ff");
</script>

<template>
    <ColorInput
        v-model:value="value"
        ariaLabel="Accent color"
        v-bind="COLOR_INPUT_LABELS"
        :compute-value-text="computeColorValueText"
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${value}` }}</div>
</template>
