<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TOOLBAR_DEFAULTS } from "@thewaver/ss-components-vue";
import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import PaletteExample from "./Examples/Palette.vue";
import PressedExample from "./Examples/Pressed.vue";
import RefusingExample from "./Examples/Refusing.vue";
import ResizableBar from "./ResizableBar.vue";
import { NOTHING_RUN } from "./ToolbarPage.const";
import type { ToolbarExampleProps } from "./ToolbarPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

const WIDE_SPAN = 2;

const barWidth = shallowRef(ToolbarKnobs.STARTING_BAR_WIDTH);
const gap = shallowRef(TOOLBAR_DEFAULTS.gap);
const lastRun = shallowRef(NOTHING_RUN);
const pressedValues = shallowRef<string[]>([]);

const commonProps = computed<ToolbarExampleProps>(() => ({
    gap: gap.value,
    onActivate: (value) => {
        lastRun.value = value;
    },
}));

const resizeBar = (width: number) => {
    barWidth.value = width;
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        span: WIDE_SPAN,
        readout: () => `last run: ${lastRun.value} — drag the right edge and the row's tail moves into the menu`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "refusing",
        name: "Refusing",
        span: WIDE_SPAN,
        readout: () =>
            "Share never collapses, so it is the last one standing; Print is never in the row; Rename is disabled, so the arrows step past it",
        path: `${EXAMPLES_ROOT}/Refusing.vue`,
    },
    {
        key: "pressed",
        name: "Pressed",
        span: WIDE_SPAN,
        readout: () =>
            `pressed: ${pressedValues.value.join(", ") || "nothing"} — each action stays down until pressed again, and one that collapses is a checkbox in the menu, checked from the same list`,
        path: `${EXAMPLES_ROOT}/Pressed.vue`,
    },
    {
        key: "palette",
        name: "A ring of tools",
        readout: () =>
            `last run: ${lastRun.value} — a layout sizes the bar itself, so nothing runs out of room and the overflow menu has nothing to hold`,
        path: `${EXAMPLES_ROOT}/Palette.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="barWidth"
            label="Bar width (px)"
            hint="How wide the bar is. Narrow it far enough and items start moving into the overflow menu."
        >
            <PageNumberField
                :value="barWidth"
                :min="ToolbarKnobs.MIN_BAR_WIDTH"
                :max="ToolbarKnobs.MAX_BAR_WIDTH"
                :step="ToolbarKnobs.BAR_WIDTH_STEP"
                ariaLabel="Bar width in pixels"
                @input="resizeBar"
            />
        </PageProp>

        <PageProp item-key="gap" label="Gap (px)" hint="The space left between items on the bar.">
            <PageNumberField
                :value="gap"
                :min="ToolbarKnobs.MIN_GAP"
                :max="ToolbarKnobs.MAX_GAP"
                :step="ToolbarKnobs.GAP_STEP"
                ariaLabel="Gap in pixels"
                @input="(value: number) => (gap = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <ResizableBar :width="barWidth" @resize="resizeBar">
                <DefaultExample v-bind="commonProps" />
            </ResizableBar>
        </template>

        <template #refusing>
            <ResizableBar :width="barWidth" @resize="resizeBar">
                <RefusingExample v-bind="commonProps" />
            </ResizableBar>
        </template>

        <template #pressed>
            <ResizableBar :width="barWidth" @resize="resizeBar">
                <PressedExample v-bind="commonProps" v-model:pressed-values="pressedValues" />
            </ResizableBar>
        </template>

        <template #palette>
            <PaletteExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
