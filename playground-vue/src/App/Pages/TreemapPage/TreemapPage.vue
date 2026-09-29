<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MediaQueryMonitorVueUtils, TREEMAP_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-vue";
import { TreemapKnobs } from "@thewaver/ss-playground/App/Knobs/Treemaps.const";
import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import LibraryExample from "./Examples/Library.vue";

const EXAMPLES_ROOT = "/src/App/Pages/TreemapPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

const zoomDurationMs = shallowRef(TREEMAP_DEFAULTS.zoomDurationMs);

const branch = shallowRef(LIBRARY);

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
            `showing ${showing.value} — press a branch to zoom into it, and the bar above or Escape to come back out; a leaf has nothing inside it and does not answer a press`,
        path: `${EXAMPLES_ROOT}/Library.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="zoomDurationMs"
            label="Zoom duration (ms)"
            hint="How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."
        >
            <PageNumberField
                :value="zoomDurationMs"
                :min="TreemapKnobs.MIN_ZOOM_DURATION_MS"
                :max="TreemapKnobs.MAX_ZOOM_DURATION_MS"
                :step="TreemapKnobs.ZOOM_DURATION_STEP_MS"
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
                :zoom-duration-ms="prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs"
            />
        </template>
    </PageExamples>
</template>
