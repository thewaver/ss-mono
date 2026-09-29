<script setup lang="ts">
import { useModel } from "vue";

import { ColorInput, Label } from "@thewaver/ss-components-vue";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageColorPickerArea from "../../../PageComponents/ColorPicker/PageColorPickerArea.vue";
import PageColorPickerHue from "../../../PageComponents/ColorPicker/PageColorPickerHue.vue";
import PageColorPickerPanel from "../../../PageComponents/ColorPicker/PageColorPickerPanel.vue";
import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

const LABEL_GAP = 5;

type Props = ColorInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Accent</PageLabelCaption>

        <ColorInput v-model:value="value" v-bind="COLOR_INPUT_LABELS">
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
    </Label>
</template>
