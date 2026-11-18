<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { CIRCLE_PACKING_DEFAULTS, MediaQueryMonitorVueUtils, TreemapUtils } from "@thewaver/ss-components-vue";
import type { CirclePackingNode } from "@thewaver/ss-components-vue";
import { CirclePackingKnobs } from "@thewaver/ss-playground/App/Knobs/CirclePackings.const";
import { LIBRARY } from "@thewaver/ss-playground/App/LibraryTree.generated";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NO_MOTION_DURATION_MS,
    WIDE_SPAN,
} from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import LibraryExample from "./Examples/Library.vue";

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
        name: EXAMPLE_NAMES.library,
        span: WIDE_SPAN,
        readout: () =>
            `showing ${showing.value} — press a circle with circles inside it to zoom into it, anywhere else to go back to the top, or Escape to go up one level`,
        path: `${EXAMPLES_ROOT}/Library.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="padding" v-bind="CirclePackingKnobs.PADDING_TEXT">
            <PageNumberField
                :value="padding"
                :min="CirclePackingKnobs.MIN_PADDING"
                :max="CirclePackingKnobs.MAX_PADDING"
                :step="CirclePackingKnobs.PADDING_STEP"
                ariaLabel="Padding in pixels"
                @input="(value: number) => (padding = value)"
            />
        </PageProp>

        <PageProp item-key="zoomDurationMs" v-bind="CirclePackingKnobs.ZOOM_DURATION_MS_TEXT">
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
