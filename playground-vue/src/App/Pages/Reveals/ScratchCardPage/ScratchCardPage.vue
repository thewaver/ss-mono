<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SCRATCH_CARD_DEFAULTS } from "@thewaver/ss-components-vue";
import { ScratchCardKnobs } from "@thewaver/ss-playground/App/Knobs/ScratchCards.const";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import FrostedExample from "./Examples/Frosted.vue";
import TicketExample from "./Examples/Ticket.vue";
import WindowsExample from "./Examples/Windows.vue";
import type {
    ExampleKey,
    ExampleProgress,
    ScratchCardExampleProps,
    ScratchCardWindowsExampleProps,
} from "./ScratchCardPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/ScratchCardPage/Examples";

const RATIO_DIGITS = 2;
const NOTHING_SCRATCHED = 0;
const WINDOW_COUNT = 3;
const FIRST_WINDOW = 1;

const applyScratch = (progress: ExampleProgress, ratio: number): ExampleProgress => ({
    ratio,
    hasCleared: ratio === NOTHING_SCRATCHED ? false : progress.hasCleared,
});

const precision = shallowRef(SCRATCH_CARD_DEFAULTS.precision);
const brushRadius = shallowRef(SCRATCH_CARD_DEFAULTS.brushRadius);
const softness = shallowRef(SCRATCH_CARD_DEFAULTS.softness);
const brushShape = shallowRef<(typeof ScratchCardKnobs.BRUSH_SHAPES)[number]>(ScratchCardKnobs.STARTING_BRUSH_SHAPE);

const computePoints = computed(() => {
    const shape = brushShape.value;

    if (shape === ScratchCardKnobs.CIRCLE) return undefined;

    return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
});
const threshold = shallowRef(SCRATCH_CARD_DEFAULTS.clearThreshold);
const progress = shallowRef<Record<ExampleKey, ExampleProgress>>({
    ticket: { ratio: NOTHING_SCRATCHED, hasCleared: false },
    frosted: { ratio: NOTHING_SCRATCHED, hasCleared: false },
});
const windowProgress = shallowRef<ExampleProgress[]>(
    Array.from({ length: WINDOW_COUNT }, () => ({ ratio: NOTHING_SCRATCHED, hasCleared: false })),
);

const exampleProps = (key: ExampleKey): ScratchCardExampleProps => ({
    brushRadius: brushRadius.value,
    precision: precision.value,
    softness: softness.value,
    computePoints: computePoints.value,
    clearThreshold: threshold.value,
    onScratch: (ratio) => {
        progress.value = { ...progress.value, [key]: applyScratch(progress.value[key], ratio) };
    },
    onClear: () => {
        progress.value = { ...progress.value, [key]: { ...progress.value[key], hasCleared: true } };
    },
});

const windowsProps = computed<ScratchCardWindowsExampleProps>(() => ({
    brushRadius: brushRadius.value,
    precision: precision.value,
    softness: softness.value,
    computePoints: computePoints.value,
    clearThreshold: threshold.value,
    onWindowScratch: (index, ratio) => {
        windowProgress.value = windowProgress.value.map((entry, at) =>
            at === index ? applyScratch(entry, ratio) : entry,
        );
    },
    onWindowClear: (index) => {
        windowProgress.value = windowProgress.value.map((entry, at) =>
            at === index ? { ...entry, hasCleared: true } : entry,
        );
    },
}));

const describeWindows = () =>
    windowProgress.value
        .map(
            (entry, index) =>
                `window ${index + FIRST_WINDOW}: ${
                    entry.hasCleared ? "cleared" : `${(entry.ratio * 100).toFixed(RATIO_DIGITS)}%`
                }`,
        )
        .join(" · ");

const describe = (key: ExampleKey, whileGoing: string) =>
    `${(progress.value[key].ratio * ScratchCardKnobs.MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
        progress.value[key].hasCleared ? "the rest went by itself once the threshold was crossed" : whileGoing
    }`;

const examples: ExampleDefs[] = [
    {
        key: "ticket",
        name: "Ticket",
        readout: () => describe("ticket", "keep going"),
        path: `${EXAMPLES_ROOT}/Ticket.vue`,
    },
    {
        key: "frosted",
        name: "Frosted",
        readout: () => describe("frosted", "what is under it sharpens as the frost goes"),
        path: `${EXAMPLES_ROOT}/Frosted.vue`,
    },
    {
        key: "windows",
        name: "Ticket with windows",
        readout: describeWindows,
        path: `${EXAMPLES_ROOT}/Windows.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="precision"
            label="Precision"
            hint="How finely the card measures how much has been scratched off. Finer measurement costs more work each frame."
        >
            <PageNumberField
                :value="precision"
                :min="ScratchCardKnobs.MIN_PRECISION"
                :max="ScratchCardKnobs.MAX_PRECISION"
                :step="ScratchCardKnobs.PRECISION_STEP"
                ariaLabel="Precision"
                @input="(value: number) => (precision = value)"
            />
        </PageProp>

        <PageProp
            item-key="brushRadius"
            label="Brush radius (px)"
            hint="How large a patch one stroke of the pointer clears."
        >
            <PageNumberField
                :value="brushRadius"
                :min="ScratchCardKnobs.MIN_BRUSH_RADIUS"
                :max="ScratchCardKnobs.MAX_BRUSH_RADIUS"
                :step="ScratchCardKnobs.BRUSH_STEP"
                ariaLabel="Brush radius in pixels"
                @input="(value: number) => (brushRadius = value)"
            />
        </PageProp>

        <PageProp item-key="brushShape" label="Brush shape" hint="The outline of the patch a stroke clears.">
            <PageSelectField
                :value="brushShape"
                :values="ScratchCardKnobs.BRUSH_SHAPES"
                ariaLabel="Brush shape"
                @change="(shape: (typeof ScratchCardKnobs.BRUSH_SHAPES)[number]) => (brushShape = shape)"
            />
        </PageProp>

        <PageProp
            item-key="softness"
            label="Edge softness"
            hint="How gradually a cleared patch fades into what is still covered. 0 gives a hard edge."
        >
            <PageNumberField
                :value="softness"
                :min="ScratchCardKnobs.MIN_SOFTNESS"
                :max="ScratchCardKnobs.MAX_SOFTNESS"
                :step="ScratchCardKnobs.SOFTNESS_STEP"
                ariaLabel="Edge softness"
                @input="(value: number) => (softness = value)"
            />
        </PageProp>

        <PageProp
            item-key="clearThreshold"
            label="Clear threshold"
            hint="How much of the card has to be scratched off before the rest is cleared for you."
        >
            <PageNumberField
                :value="threshold"
                :min="ScratchCardKnobs.MIN_THRESHOLD"
                :max="ScratchCardKnobs.MAX_THRESHOLD"
                :step="ScratchCardKnobs.THRESHOLD_STEP"
                ariaLabel="Clear threshold"
                @input="(value: number) => (threshold = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #ticket>
            <TicketExample v-bind="exampleProps('ticket')" />
        </template>

        <template #frosted>
            <FrostedExample v-bind="exampleProps('frosted')" />
        </template>

        <template #windows>
            <WindowsExample v-bind="windowsProps" />
        </template>
    </PageExamples>
</template>
