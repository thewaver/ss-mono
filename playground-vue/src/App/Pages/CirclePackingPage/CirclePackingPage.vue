<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { CIRCLE_PACKING_DEFAULTS, MediaQueryMonitorVueUtils, TreemapUtils } from "@thewaver/ss-components-vue";
import type { CirclePackingNode } from "@thewaver/ss-components-vue";
import { CirclePackingKnobs } from "@thewaver/ss-playground/App/Knobs/CirclePackings.const";
import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import LibraryExample from "./Examples/Library.vue";

const EXAMPLES_ROOT = "/src/App/Pages/CirclePackingPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

const padding = shallowRef(CIRCLE_PACKING_DEFAULTS.padding);
const zoomDurationMs = shallowRef(CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

const branch = shallowRef<CirclePackingNode<string>>(LIBRARY);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const showing = computed(() =>
    (TreemapUtils.findPath(LIBRARY, branch.value) ?? [LIBRARY]).map((node) => node.value).join("/"),
);

const examples: ExampleDefs[] = [
    {
        key: "library",
        name: "This library, by lines of code",
        span: WIDE_SPAN,
        readout: () =>
            `showing ${showing.value} — press a circle with circles inside it to zoom into it, anywhere else to go back to the top, or Escape to go up one level`,
        path: `${EXAMPLES_ROOT}/Library.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="padding"
            label="Padding (px)"
            hint="The space left between neighboring circles and around the inside of their parent."
        >
            <PageNumberField
                :value="padding"
                :min="CirclePackingKnobs.MIN_PADDING"
                :max="CirclePackingKnobs.MAX_PADDING"
                :step="CirclePackingKnobs.PADDING_STEP"
                ariaLabel="Padding in pixels"
                @input="(value: number) => (padding = value)"
            />
        </PageProp>

        <PageProp
            item-key="zoomDurationMs"
            label="Zoom duration (ms)"
            hint="How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new view."
        >
            <PageNumberField
                :value="zoomDurationMs"
                :min="CirclePackingKnobs.MIN_ZOOM_DURATION_MS"
                :max="CirclePackingKnobs.MAX_ZOOM_DURATION_MS"
                :step="CirclePackingKnobs.ZOOM_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Zoom duration in milliseconds"
                @input="(value: number) => (zoomDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #library>
            <LibraryExample
                v-model:branch="branch"
                :padding="padding"
                :zoom-duration-ms="prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs"
            />
        </template>
    </PageExamples>
</template>
