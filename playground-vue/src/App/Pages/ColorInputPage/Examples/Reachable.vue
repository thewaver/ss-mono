<script setup lang="ts">
import { h, useModel } from "vue";

import { ColorInput } from "@thewaver/ss-components-vue";
import type { ColorInputRenderProps, InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageColorPickerArea from "../../../PageComponents/ColorPicker/PageColorPickerArea.vue";
import PageColorPickerHue from "../../../PageComponents/ColorPicker/PageColorPickerHue.vue";
import PageColorPickerPanel from "../../../PageComponents/ColorPicker/PageColorPickerPanel.vue";
import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const tooltipDefs: InteractionTooltipDefs<ColorInputRenderProps> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but the OS picker must not open.",
        ),
};
</script>

<template>
    <ColorInput
        v-model:value="value"
        is-disabled
        is-reachable-when-disabled
        ariaLabel="Disabled but reachable color"
        v-bind="COLOR_INPUT_LABELS"
        :tooltip-defs="tooltipDefs"
    >
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
