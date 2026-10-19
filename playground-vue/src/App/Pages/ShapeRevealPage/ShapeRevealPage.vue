<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-vue";
import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
import { THEME_OPTIONS } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    SHAPE_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
import type { ShapeRevealShape } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import { appliedTheme } from "../../PageComponents/Theme/ThemeVue.const";
import ThemeCycleExample from "./Examples/ThemeCycle.vue";
import type { ShapeRevealExampleProps } from "./ShapeRevealExample.types";

const computeThemeLabel = () =>
    THEME_OPTIONS.find((option) => option.value === appliedTheme.value)?.label ?? appliedTheme.value;

const durationMs = shallowRef(SHAPE_REVEAL_DEFAULTS.durationMs);
const delayMs = shallowRef(ShapeRevealKnobs.STARTING_DELAY_MS);
const shape = shallowRef<ShapeRevealShape>(ShapeRevealKnobs.STARTING_SHAPE);
const softness = shallowRef(SHAPE_REVEAL_DEFAULTS.softness);

const computePoints = computed(() => {
    const picked = shape.value;

    if (picked === "circle") return undefined;

    return (size: Size2d) => ShapeConst.getDefaultShapePoints(picked, size);
});

const commonProps = computed<ShapeRevealExampleProps>(() => ({
    durationMs: durationMs.value,
    delayMs: delayMs.value,
    computePoints: computePoints.value,
    softness: softness.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "themeCycle",
        name: EXAMPLE_NAMES.themeCycle,
        readout: () => `showing the ${computeThemeLabel()} theme`,
        path: `${EXAMPLES_ROOT}/ThemeCycle.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="durationMs"
            controls="Sets ShapeRevealOpts.durationMs"
            label="Duration (ms)"
            hint="How long the circle takes to grow over the whole window. 0 switches the theme at once, as does the system's reduced-motion setting."
        >
            <PageNumberField
                :value="durationMs"
                :min="ShapeRevealKnobs.MIN_DURATION_MS"
                :max="ShapeRevealKnobs.MAX_DURATION_MS"
                :step="ShapeRevealKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Duration in milliseconds"
                @input="(value: number) => (durationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="delayMs"
            :controls="EXAMPLES_ONLY_PROP"
            label="Delay (ms)"
            hint="How long the new theme stays on screen, once the circle has covered it, before the next."
        >
            <PageNumberField
                :value="delayMs"
                :min="ShapeRevealKnobs.MIN_DELAY_MS"
                :max="ShapeRevealKnobs.MAX_DELAY_MS"
                :step="ShapeRevealKnobs.DELAY_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Delay in milliseconds"
                @input="(value: number) => (delayMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="computePoints"
            controls="Picks the example contour sent to ShapeRevealOpts.computePoints"
            label="Shape"
            hint="The contour that grows over the window. A circle is what the reveal draws when none is given."
        >
            <PageSelectField
                :value="shape"
                :values="ShapeRevealKnobs.SHAPES"
                :width="SHAPE_FIELD_WIDTH"
                ariaLabel="Shape"
                @change="(next: ShapeRevealShape) => (shape = next)"
            />
        </PageProp>

        <PageProp
            item-key="softness"
            controls="Sets ShapeRevealOpts.softness"
            label="Softness"
            hint="How gradually the growing shape's edge fades, as a share of the distance it grows. 0 gives a hard edge."
        >
            <PageNumberField
                :value="softness"
                :min="ShapeRevealKnobs.MIN_SOFTNESS"
                :max="ShapeRevealKnobs.MAX_SOFTNESS"
                :step="ShapeRevealKnobs.SOFTNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Softness"
                @input="(value: number) => (softness = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #themeCycle>
            <ThemeCycleExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
