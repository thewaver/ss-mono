<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MediaQueryMonitorVueUtils, SUNBURST_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-vue";
import type { SunburstNode } from "@thewaver/ss-components-vue";
import { SunburstKnobs } from "@thewaver/ss-playground/App/Knobs/Sunbursts.const";
import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import LibraryExample from "./Examples/Library.vue";

const EXAMPLES_ROOT = "/src/App/Pages/SunburstPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

const ringCount = shallowRef(SUNBURST_DEFAULTS.ringCount);
const zoomDurationMs = shallowRef(SUNBURST_DEFAULTS.zoomDurationMs);

const branch = shallowRef<SunburstNode<string>>(LIBRARY);

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
            `showing ${showing.value} — press an arc with rings outside it to zoom into it, and the middle or Escape to come back out`,
        path: `${EXAMPLES_ROOT}/Library.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="ringCount" label="Rings" hint="How many levels are drawn around the middle at once.">
            <PageNumberField
                :value="ringCount"
                :min="SunburstKnobs.MIN_RING_COUNT"
                :max="SunburstKnobs.MAX_RING_COUNT"
                :step="SunburstKnobs.RING_COUNT_STEP"
                ariaLabel="Rings"
                @input="(value: number) => (ringCount = value)"
            />
        </PageProp>

        <PageProp
            item-key="zoomDurationMs"
            label="Zoom duration (ms)"
            hint="How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."
        >
            <PageNumberField
                :value="zoomDurationMs"
                :min="SunburstKnobs.MIN_ZOOM_DURATION_MS"
                :max="SunburstKnobs.MAX_ZOOM_DURATION_MS"
                :step="SunburstKnobs.ZOOM_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Zoom duration in milliseconds"
                @input="(value: number) => (zoomDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #library>
            <LibraryExample
                :ring-count="ringCount"
                :zoom-duration-ms="prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs"
                v-model:branch="branch"
            />
        </template>
    </PageExamples>
</template>
